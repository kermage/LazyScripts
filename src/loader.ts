import { identifier, getOrigin, scriptSorter } from './utilities';

const SELECTORS = `script[type=${ identifier( true ).slice( 0, -1 ) }]`;

const loadScript = async ( element: Element ): Promise<void> => {
	return new Promise( ( executor ) => {
		const source = element.getAttribute( 'data-src' )!;
		const type = element.getAttribute( 'data-type' )!;

		element.setAttribute( 'type', type || 'text/javascript' );

		if ( source ) {
			element.setAttribute( 'src', source );
			element.removeAttribute( 'data-src' );
		} else {
			const textContent = element.textContent;

			if ( null !== textContent ) {
				const encodedData = btoa( decodeURIComponent( encodeURIComponent( textContent ) ) );

				element.setAttribute( 'src', `data:text/javascript;base64, ${ encodedData }` );
			}
		}

		if ( type ) {
			element.removeAttribute( 'data-type' );
		}

		element.addEventListener( 'load', () => {
			if ( ! source ) {
				element.removeAttribute( 'src' );
			}

			if ( ! type ) {
				element.removeAttribute( 'type' );
			}

			executor();
		} );
	} );
};

export const loadScripts = async () => {
	const allScripts = document.querySelectorAll( SELECTORS );

	for ( const element of Array.from( allScripts ).sort( scriptSorter ) ) {
		await loadScript( element );
	}
};

const resourceHint = ( href: string, crossorigin: string | boolean ) => {
	const link = document.createElement( 'link' );

	link.href = href;

	link.rel = 'preconnect';

	if ( crossorigin ) {
		link.crossOrigin = crossorigin.toString();
	}

	return document.head.appendChild( link );
};

export const preconnectExternals = async () => {
	const hinted: HTMLLinkElement[] = [];

	for ( const element of document.querySelectorAll( SELECTORS ) ) {
		const source = element.getAttribute( 'data-src' )!;
		const origin = getOrigin( source );

		if ( origin && origin !== location.origin ) {
			const crossorigin = element.getAttribute( 'crossorigin' )
				|| ( 'module' === element.getAttribute( 'data-type' ) );

			hinted.push( resourceHint( origin, crossorigin ) );
		}
	}

	window.addEventListener( `${ identifier( true ) }:loaded`, () => {
		hinted.forEach( ( link ) => link.remove() );
	} );
};

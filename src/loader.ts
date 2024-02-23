import { identifier, getOrigin, scriptSorter } from './utilities';

const SELECTORS = `script[type=${ identifier( true ).slice( 0, -1 ) }][data-src]`;

const loadScript = async ( element: Element ): Promise<Event> => {
	return new Promise( ( executor: EventListener ) => {
		const source = element.getAttribute( 'data-src' )!;

		element.setAttribute( 'type', 'text/javascript' );
		element.setAttribute( 'src', source );
		element.removeAttribute( 'data-src' );
		element.addEventListener( 'load', executor );
	} )
}

export const loadScripts = async () => {
	const allScripts = document.querySelectorAll( SELECTORS );

	for ( const element of Array.from( allScripts ).sort( scriptSorter ) ) {
		await loadScript( element );
	}
}

const resourceHint = ( href: string ) => {
	const link = document.createElement( 'link' );

	link.href = href;

	link.rel = 'preconnect';

	document.head.appendChild( link );
}

export const preconnectExternals = async () => {
	for ( const element of document.querySelectorAll( SELECTORS ) ) {
		const source = element.getAttribute( 'data-src' )!;
		const origin = getOrigin( source );

		if ( origin && origin !== location.origin ) {
			resourceHint( origin );
		}
	}
}

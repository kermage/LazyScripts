const SELECTORS = 'script[data-src]';

const loadScript = async ( element: Element ): Promise<Event> => {
	return new Promise( ( executor: EventListener ) => {
		const source = element.getAttribute( 'data-src' )!;

		element.setAttribute( 'src', source );
		element.removeAttribute( 'data-src' );
		element.addEventListener( 'load', executor );
	} )
}

export const loadScripts = async () => {
	for ( const element of document.querySelectorAll( SELECTORS ) ) {
		await loadScript( element );
	}
}

const resourceHint = ( href: string ) => {
	const link = document.createElement( 'link' );

	link.href = href;

	link.rel = 'preconnect';

	document.head.appendChild( link );
}

const getOrigin = ( url: string ) => {
	let origin = '';

	try {
		origin = ( new URL( url ) ).origin;
	} catch {}

	return origin;
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

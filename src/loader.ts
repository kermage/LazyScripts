const SELECTORS = 'script[data-src]';

const scriptSorter = ( a: Element, b: Element ) => {
	const isDefer = ( element: Element ) => {
		return null !== element.getAttribute( 'defer' );
	}

	if ( isDefer( a ) ) {
		if ( isDefer( b ) ) {
			return 0;
		}

		return 1;
	}

	return isDefer( b ) ? -1 : 0;
}

const loadScript = async ( element: Element ): Promise<Event> => {
	return new Promise( ( executor: EventListener ) => {
		const source = element.getAttribute( 'data-src' )!;

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

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

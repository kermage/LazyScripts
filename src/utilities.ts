export const identifier = ( lowercase: boolean = false ) => {
	const value = 'LazyScripts';

	return lowercase ? value.toLowerCase() : value;
}


export const warn = ( message: string ) => {
	console.warn( `[${ identifier() }] ${ message }` );
}


export const namespaced = ( type: string ) => {
	return `${ identifier() }-${ type }`;
}


export const getOrigin = ( url: string ) => {
	let origin = '';

	try {
		origin = ( new URL( url ) ).origin;
	} catch {}

	return origin;
}


export const scriptSorter = ( a: Element, b: Element ) => {
	const isDefer = ( element: Element ) => {
		return (
			null !== element.getAttribute( 'defer' ) ||
			'module' === element.getAttribute( 'data-type' )
		);
	}

	if ( isDefer( a ) ) {
		if ( isDefer( b ) ) {
			return 0;
		}

		return 1;
	}

	return isDefer( b ) ? -1 : 0;
}

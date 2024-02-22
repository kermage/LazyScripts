export const namespaced = ( type: string ) => {
	return `lazy-${ type }`;
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

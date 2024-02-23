import { EVENT_TYPES } from './constants';

type Mode = 'add' | 'remove';

export const userInteraction = ( mode: Mode, listener: EventListener ) => {
	const method = mode === 'add' ? 'addEventListener' : 'removeEventListener';

	EVENT_TYPES.forEach( ( type ) => {
		window[ method ]( type, listener, { passive: true } );
	} );
};

export const domNotLoading = async (): Promise<void> => {
	return new Promise( ( resolve ) => {
		if ( 'loading' !== document.readyState ) {
			resolve();
		} else {
			document.addEventListener( 'DOMContentLoaded', () => resolve() );
		}
	} );
};

import { EVENT_TYPES } from './constants';

type Mode = 'add' | 'remove';

export const userInteraction = ( mode: Mode, listener: EventListener ) => {
	const method = mode === 'add' ? 'addEventListener' : 'removeEventListener';

	EVENT_TYPES.forEach( ( type ) => {
		window[ method]( type, listener, { passive: true } );
	} );
}

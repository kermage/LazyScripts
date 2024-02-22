import { TARGET_EVENTS } from './constants';
import { namespaced } from './utilities';

export const interceptRegisters = () => {
	const originalMethods = Object.values( TARGET_EVENTS ).map( ( value ) => value[0].addEventListener );

	TARGET_EVENTS.forEach( ( [ target ], index ) => {
		target.addEventListener = function() {
			arguments[0] = namespaced( arguments[0] );

			originalMethods[ index ].apply( target, arguments as unknown as Parameters<typeof target.addEventListener> );
		}
	} );
}

export const dispatchCustomEvents = () => {
	TARGET_EVENTS.forEach( ( [ target, types ] ) => {
		types.forEach( type => {
			setTimeout( () => target.dispatchEvent( new Event( namespaced( type ) ) ), 50 );
		} )
	} );

	window.dispatchEvent( new CustomEvent( 'lazyscripts:loaded', { bubbles: true, cancelable: true } ) );
}

import { TARGET_EVENTS } from './constants';
import { identifier, namespaced, warn } from './utilities';

export const interceptRegisters = () => {
	const originalMethods = Object.values( TARGET_EVENTS ).map( ( value ) => value[0].addEventListener );

	TARGET_EVENTS.forEach( ( [ target ], index ) => {
		if ( ! target.addEventListener.toString().includes( '[native code]' ) ) {
			warn( `Something else already intercepted the ${ target } event listener.` );

			return;
		}

		target.addEventListener = function() {
			arguments[0] = namespaced( arguments[0] );

			originalMethods[ index ].apply( target, arguments as unknown as Parameters<typeof target.addEventListener> );
		}
	} );
}

export const dispatchCustomEvents = () => {
	TARGET_EVENTS.forEach( ( [ target, types ] ) => {
		types.forEach( ( type ) => {
			( new Promise( ( resolve ) => requestAnimationFrame( resolve ) ) ).then();
			target.dispatchEvent( new Event( namespaced( type ) ) );
		} );
	} );

	window.dispatchEvent( new CustomEvent( `${ identifier( true ) }:loaded`, { bubbles: true, cancelable: true } ) );
}

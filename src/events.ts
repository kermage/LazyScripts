import { TARGET_EVENTS } from './constants';
import { identifier, namespaced, warn } from './utilities';

export const interceptRegisters = () => {
	const originalMethods = Object.values( TARGET_EVENTS ).map( ( value ) => value[ 0 ].addEventListener );

	TARGET_EVENTS.forEach( ( [ target, types ], index ) => {
		if ( ! target.addEventListener.toString().includes( '[native code]' ) ) {
			warn( `Something else already intercepted the ${ target } event listener.` );

			return;
		}

		target.addEventListener = function () {
			if ( types.includes( arguments[ 0 ] ) ) {
				arguments[ 0 ] = namespaced( arguments[ 0 ] );
			}

			originalMethods[ index ].apply( target, arguments as unknown as Parameters<typeof target.addEventListener> );
		};
	} );

	let jQueryHolder: undefined;

	Object.defineProperty( window, 'jQuery', {
		get: () => jQueryHolder,
		set: ( value ) => {
			value.fn.ready = ( callback: CallableFunction ) => {
				document.addEventListener( namespaced( 'DOMContentLoaded' ), () => callback.bind( document )( value ) );
			};

			const originalOn = value.fn.on;
			const eventName = ( event: string ) => {
				return event.split( ' ' ).map( ( type ) => {
					return 'load' === type ? namespaced( type ) : type;
				} ).join( ' ' );
			};

			value.fn.on = function () {
				if ( window === this[ 0 ] ) {
					if ( 'string' === typeof arguments[ 0 ] ) {
						arguments[ 0 ] = eventName( arguments[ 0 ] );
					} else if ( 'object' === typeof arguments[ 0 ] ) {
						Object.keys( arguments[ 0 ] ).forEach( ( key ) => {
							const event = arguments[ 0 ][ key ];

							delete arguments[ 0 ][ key ];

							arguments[ 0 ][ eventName( key ) ] = event;
						} );
					}
				}

				originalOn.apply( this, arguments as unknown as Parameters<typeof originalOn> );
			};

			jQueryHolder = value;
		}
	} );
};

export const dispatchCustomEvents = () => {
	TARGET_EVENTS.forEach( ( [ target, types ] ) => {
		types.forEach( ( type ) => {
			( new Promise( ( resolve ) => requestAnimationFrame( resolve ) ) ).then();
			target.dispatchEvent( new Event( namespaced( type ) ) );
		} );
	} );

	window.dispatchEvent( new CustomEvent( `${ identifier( true ) }:loaded`, { bubbles: true, cancelable: true } ) );
};

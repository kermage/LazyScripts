import { EVENT_TYPES, TARGET_EVENTS } from './constants';

export default class LazyScripts {
	listener: EventListener;


	constructor() {
		this.listener = this.trigger.bind( this )
	}


	static init() {
		return ( new LazyScripts() ).start();
	}


	start() {
		EVENT_TYPES.forEach( ( type ) => {
			window.addEventListener( type, this.listener, { passive: true } );
		} );
	}


	stop() {
		EVENT_TYPES.forEach( ( type ) => {
			window.removeEventListener( type, this.listener );
		} );
	}


	trigger() {
		this.stop();
		this.load();
		this.dispatch();
	}


	load() {
		document.querySelectorAll( 'script[data-src]' ).forEach( ( element ): void => {
			element.setAttribute( 'src', element.getAttribute( 'data-src' )! );
			element.removeAttribute( 'data-src' );
		} )
	}


	dispatch() {
		const originalMethods = Object.values( TARGET_EVENTS ).map( ( value ) => value[0].addEventListener );

		TARGET_EVENTS.forEach( ( [ target, types ], index ) => {
			target.addEventListener = function() {
				arguments[0] = `lazy-${ arguments[0] }`;

				originalMethods[ index ].apply( target, arguments as unknown as Parameters<typeof target.addEventListener> );
			}

			types.forEach( type => {
				setTimeout(() => target.dispatchEvent( new Event( `lazy-${ type }` ) ), 50 );
			} )
		} );
	}
}

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
		TARGET_EVENTS.forEach( ( [ target, type ] ) => {
			setTimeout(() => target.dispatchEvent( new Event( type ) ), 50 );
		} );
	}
}

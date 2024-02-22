import { EVENT_TYPES } from './constants';
import { interceptRegisters, dispatchCustomEvents } from './events';
import { preconnectExternals, loadScripts } from './loader';

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

		document.addEventListener( 'DOMContentLoaded', preconnectExternals );
	}


	stop() {
		EVENT_TYPES.forEach( ( type ) => {
			window.removeEventListener( type, this.listener );
		} );
	}


	async trigger() {
		this.stop();
		interceptRegisters();
		await loadScripts();
		dispatchCustomEvents();
	}
}

import { interceptRegisters, dispatchCustomEvents } from './events';
import { preconnectExternals, loadScripts } from './loader';
import { userInteraction, domNotLoading } from './listeners';

export default class LazyScripts {
	listener: EventListener;


	constructor() {
		this.listener = this.trigger.bind( this )
	}


	static init() {
		return ( new LazyScripts() ).init();
	}


	init() {
		userInteraction( 'add', this.listener );
		document.addEventListener( 'DOMContentLoaded', preconnectExternals );
	}


	async trigger() {
		userInteraction( 'remove', this.listener );
		await domNotLoading();
		interceptRegisters();
		await loadScripts();
		dispatchCustomEvents();
	}
}

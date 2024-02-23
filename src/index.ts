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
		const html = document.documentElement;

		if ( html.dataset.lazyscripts ) {
			console.warn( 'LazyScripts was already initialized.' );

			return;
		}

		html.dataset.lazyscripts = 'true';

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

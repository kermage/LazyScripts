import { interceptRegisters, dispatchCustomEvents } from './events';
import { preconnectExternals, loadScripts } from './loader';
import { userInteraction, domNotLoading } from './listeners';
import { identifier, namespaced, warn } from './utilities';

export default class LazyScripts {
	listener: EventListener;
	persisted: boolean | undefined;

	constructor() {
		this.listener = this.trigger.bind(this);
	}

	static init() {
		return new LazyScripts().init();
	}

	init() {
		const html = document.documentElement;

		if (html.dataset[identifier(true)]) {
			warn('Another instance already initialized the page.');

			return;
		}

		html.dataset[identifier(true)] = 'true';

		userInteraction('add', this.listener);
		document.addEventListener('DOMContentLoaded', preconnectExternals);
		window.addEventListener('pageshow', (event) => {
			if (undefined !== this.persisted) {
				window.dispatchEvent(new Event(namespaced('pageshow')));
			}

			this.persisted = event.persisted;
		});
	}

	async trigger() {
		userInteraction('remove', this.listener);
		await domNotLoading();
		interceptRegisters();
		await loadScripts();
		dispatchCustomEvents();
	}
}

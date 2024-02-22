export const EVENT_TYPES = [
	'keydown',
	'mousedown',
	'mousemove',
	'touchstart',
	'touchmove',
	'wheel'
];

export const TARGET_EVENTS: [ EventTarget, string[] ][] = [
	[
		document,
		[
			'DOMContentLoaded',
		],
	],
	[
		window,
		[
			'DOMContentLoaded',
			'load',
			'pageshow',
		],
	],
];

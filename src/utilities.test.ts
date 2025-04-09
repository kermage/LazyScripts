import { describe, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { namespaced, getOrigin, scriptSorter } from './utilities';

describe('namespaced', () => {
	it('should return correct strings', ({ expect }) => {
		expect(namespaced('DOMContentLoaded')).toBe('LazyScripts-DOMContentLoaded');
		expect(namespaced('load')).toBe('LazyScripts-load');
		expect(namespaced('pageshow')).toBe('LazyScripts-pageshow');
	});
});

describe('getOrigin', () => {
	it('should return correct strings', ({ expect }) => {
		expect(getOrigin('main.js')).toBe('');
		expect(getOrigin('/vendor1.js')).toBe('');
		expect(getOrigin('./vendor2.js')).toBe('');
		expect(getOrigin('localhost/vendor3.js')).toBe('');
		expect(getOrigin('https://github.com')).toBe('https://github.com');
	});
});

describe('scriptSorter', () => {
	const document = new JSDOM().window.document;

	const createScript = (name: string, strategy?: string) => {
		const element = document.createElement('script');

		element.setAttribute('src', name);

		if (strategy) {
			element.setAttribute(strategy, '');
		}

		return element;
	};

	const transformedScripts = (array: [string, string | undefined][]) => {
		return array
			.map(([name, strategy]) => createScript(name, strategy))
			.sort(scriptSorter)
			.map((script) => script.getAttribute('src'));
	};

	it('should return correct order', ({ expect }) => {
		expect(
			transformedScripts([
				['main.js', undefined],
				['vendor1.js', 'defer'],
				['vendor2.js', 'async'],
				['vendor3.js', undefined],
			]),
		).toStrictEqual(['main.js', 'vendor2.js', 'vendor3.js', 'vendor1.js']);
		expect(
			transformedScripts([
				['main.js', 'defer'],
				['vendor1.js', undefined],
				['vendor2.js', 'async'],
				['vendor3.js', undefined],
			]),
		).toStrictEqual(['vendor1.js', 'vendor2.js', 'vendor3.js', 'main.js']);
		expect(
			transformedScripts([
				['main.js', 'defer'],
				['vendor1.js', 'defer'],
				['vendor2.js', 'defer'],
				['vendor3.js', undefined],
			]),
		).toStrictEqual(['vendor3.js', 'main.js', 'vendor1.js', 'vendor2.js']);
		expect(
			transformedScripts([
				['main.js', 'defer'],
				['vendor1.js', 'defer'],
				['vendor2.js', 'async'],
				['vendor3.js', undefined],
			]),
		).toStrictEqual(['vendor2.js', 'vendor3.js', 'main.js', 'vendor1.js']);
		expect(
			transformedScripts([
				['main.js', 'async'],
				['vendor1.js', 'defer'],
				['vendor2.js', 'defer'],
				['vendor3.js', undefined],
			]),
		).toStrictEqual(['main.js', 'vendor3.js', 'vendor1.js', 'vendor2.js']);
	});
});

function customLogger(event) {
	console.log('Vendor #1', 'Triggered', event.type, event.currentTarget.toString(), event);
}

console.log(document.currentScript.src, 'LOADED!');

document.addEventListener('DOMContentLoaded', customLogger);
window.addEventListener('DOMContentLoaded', customLogger);
window.addEventListener('load', customLogger);
window.addEventListener('pageshow', customLogger);

window.onpageshow = function (event) {
	console.log('Vendor #1', 'pageshow', event);
};

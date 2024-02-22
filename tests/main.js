function customLogger( event ) {
	console.log( 'Triggered', event.type, event.currentTarget.toString() );
}

console.log( document.currentScript.src, 'LOADED!' );

document.addEventListener( 'DOMContentLoaded', customLogger );
window.addEventListener( 'DOMContentLoaded', customLogger );
window.addEventListener( 'load', customLogger );
window.addEventListener( 'pageshow', customLogger );

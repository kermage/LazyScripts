console.log( 'main.js', 'LOADED!' );

document.addEventListener( 'DOMContentLoaded', function() {
	console.log( 'Triggered', document, '"DOMContentLoaded"' );
} );

window.addEventListener( 'DOMContentLoaded', function() {
	console.log( 'Triggered', window, '"DOMContentLoaded"' );
} );

window.addEventListener( 'load', function() {
	console.log( 'Triggered', window, '"load"' );
} );

window.addEventListener( 'pageshow', function() {
	console.log( 'Triggered', window, '"pageshow"' );
} );

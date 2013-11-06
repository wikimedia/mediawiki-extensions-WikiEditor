/*
 * JavaScript for WikiEditor Template Editor
 */
jQuery( document ).ready( function ( $ ) {
	// Disable in template namespace
	if ( mw.config.get( 'wgNamespaceNumber' ) === 10 ) {
		return true;
	}
	// Add template editor module
	$( 'textarea#wpTextbox1' ).wikiEditor( 'addModule', 'templateEditor' );
});

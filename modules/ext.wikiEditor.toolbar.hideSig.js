/*
 * Remove the signature button if the main namespace is edited.
 */
$( document ).ready( function() {
	if ( !$.wikiEditor.isSupported( $.wikiEditor.modules.toolbar ) ) {
		return;
	}
	if ( $( 'body' ).hasClass( 'ns-0' ) ) {
		$( '#wpTextbox1' ).wikiEditor( 'removeFromToolbar', { 'section': 'main', 'group': 'insert', 'tool': 'signature' } );
	}
});

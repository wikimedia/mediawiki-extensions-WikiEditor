/* JavaScript for WikiEditor Toc module */

$j(document).ready( function() {
	// Check preferences for toolbar
	if ( !wgWikiEditorPreferences || !( wgWikiEditorPreferences.toc && wgWikiEditorPreferences.toc.enable ) ) {
		return true;
	}
	// Add the toc module
	if ( $j.fn.wikiEditor ) {
		mw.usability.load( [ '$j.ui','$j.ui.draggable', '$j.ui.resizable' ], function() {
			// load the module and let it know were ready to go
			$j( '#wpTextbox1' )
				.wikiEditor( 'addModule', { 'toc' : { 'rtl' : ( $j( 'body' ).is( '.rtl' ) ) } } )
				//FIXME - should move the ready handler code to the create function so this isn't necissary
				.data( 'wikiEditor-context' ).fn.trigger( 'ready' );
		} );
	}
});

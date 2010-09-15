/* JavaScript for WikiEditor Highlight module */

$j(document).ready( function() {
	// Check preferences for highlight
	if ( !wgWikiEditorEnabledModules.toc ) { //HACK
		return true;
	}
	// Add the highlight module
	if ( $j.fn.wikiEditor ) {
		$j( 'textarea#wpTextbox1' ).wikiEditor( 'addModule', 'highlight' );
	}
});

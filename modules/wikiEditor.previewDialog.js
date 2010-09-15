/* JavaScript for WikiEditor PreviewDialog module */

$j(document).ready( function() {
	// Check preferences for preview
	if ( !wgWikiEditorEnabledModules.previewDialog ) {
		return true;
	}
	// Add the preview module
	if ( $j.fn.wikiEditor ) {
		$j( 'textarea#wpTextbox1' ).wikiEditor( 'addModule', 'previewDialog' );
	}
});

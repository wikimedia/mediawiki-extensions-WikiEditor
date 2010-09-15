/* JavaScript for WikiEditor Templates module */

$j(document).ready( function() {
	// Check preferences for templates
	if ( !wgWikiEditorEnabledModules.templates ) {
		return true;
	}
	// Disable for template namespace
	if ( wgNamespaceNumber == 10 ) {
		return true;
	}
	// Add the templates module
	if ( $j.fn.wikiEditor ) {
		$j( 'textarea#wpTextbox1' ).wikiEditor( 'addModule', 'templates' );
	}
});

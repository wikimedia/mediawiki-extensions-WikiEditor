/* JavaScript for WikiEditor Template Editor module */

$j(document).ready( function() {
	// Check preferences for templateEditor
	if ( !wgWikiEditorEnabledModules.templateEditor ) {
		return true;
	}
	//disable if in template namespace
	if ( wgNamespaceNumber == 10 ) {
		return true;
	}
	// Add the templateEditor module
	if ( $j.fn.wikiEditor ) {
		$j( 'textarea#wpTextbox1' ).wikiEditor( 'addModule', 'templateEditor' );
	}
});

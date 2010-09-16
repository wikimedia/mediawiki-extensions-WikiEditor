/*
 * JavaScript for WikiEditor Table of Contents
 */

$( document ).ready( function() {
	// Add table of contents module
	$( '#wpTextbox1' )
		.wikiEditor( 'addModule', 'toc' );
		// FIXME - should move the ready handler code to the create function so this isn't necissary
		//.data( 'wikiEditor-context' ).fn.trigger( 'ready' );
} );

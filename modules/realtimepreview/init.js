mw.hook( 'wikiEditor.toolbarReady' ).add( function ( $textarea ) {
	var RealtimePreview = require( './RealtimePreview.js' );
	var realtimePreview = new RealtimePreview();
	$textarea.wikiEditor( 'addToToolbar', {
		section: 'secondary',
		group: 'default',
		tools: {
			realtimepreview: {
				type: 'element',
				element: function ( context ) {
					return realtimePreview.getToolbarButton( context );
				}
			}
		}
	} );
	if ( realtimePreview.getUserPref() && realtimePreview.isScreenWideEnough() ) {
		realtimePreview.setEnabled();
		mw.hook( 'ext.WikiEditor.realtimepreview.inuse' ).fire( this );
	}
} );

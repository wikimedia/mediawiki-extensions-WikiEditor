var ResizingDragBar = require( './ResizingDragBar.js' );
var TwoPaneLayout = require( './TwoPaneLayout.js' );
var ErrorLayout = require( './ErrorLayout.js' );

/**
 * @class
 */
function RealtimePreview() {
	this.configData = mw.loader.moduleRegistry[ 'ext.wikiEditor' ].script.files[ 'data.json' ];
	this.enabled = false;
	this.twoPaneLayout = new TwoPaneLayout();
	this.pagePreview = require( 'mediawiki.page.preview' );
	// @todo This shouldn't be required, but the preview element is added in PHP
	// and can have attributes with values that aren't easily accessible from here,
	// and we need to duplicate here what Live Preview does in core.
	var $previewContent = $( '#wikiPreview' ).clone().html();
	this.$previewNode = $( '<div>' )
		.addClass( 'ext-WikiEditor-realtimepreview-preview' )
		.append( $previewContent );
	this.errorLayout = new ErrorLayout();
	this.errorLayout.getReloadButton().connect( this, {
		click: this.doRealtimePreview.bind( this )
	} );
	this.twoPaneLayout.getPane2().append( this.$previewNode, this.errorLayout.$element );
	this.eventNames = 'change.realtimepreview input.realtimepreview cut.realtimepreview paste.realtimepreview';
	// Used to ensure we wait for a response before making new requests.
	this.isPreviewing = false;
	this.previewPending = false;
}

/**
 * @public
 * @param {Object} context The WikiEditor context.
 * @return {OO.ui.ToggleButtonWidget}
 */
RealtimePreview.prototype.getToolbarButton = function ( context ) {
	this.context = context;
	var $uiText = context.$ui.find( '.wikiEditor-ui-text' );

	// Fix the height of the textarea, before adding a resizing bar below it.
	var height = context.$textarea.height();
	$uiText.css( 'height', height + 'px' );
	context.$textarea.removeAttr( 'rows cols' );

	// Add the resizing bar.
	var bottomDragBar = new ResizingDragBar( { isEW: false } );
	$uiText.after( bottomDragBar.$element );

	// Create and configure the toolbar button.
	this.button = new OO.ui.ToggleButtonWidget( {
		label: mw.msg( 'wikieditor-realtimepreview-preview' ),
		icon: 'article',
		value: this.enabled,
		framed: false
	} );
	this.button.connect( this, { change: this.toggle } );
	return this.button;
};

/**
 * Toggle the two-pane preview display.
 *
 * @private
 */
RealtimePreview.prototype.toggle = function () {
	var $uiText = this.context.$ui.find( '.wikiEditor-ui-text' );
	var $textarea = this.context.$textarea;

	// Remove or add the layout to the DOM.
	if ( this.enabled ) {
		// Move height from the TwoPaneLayout to the text UI div.
		$uiText.css( 'height', this.twoPaneLayout.$element.height() + 'px' );

		// Put the text div back to being after the layout, and then hide the layout.
		this.twoPaneLayout.$element.after( $uiText );
		this.twoPaneLayout.$element.hide();

		// Remove the keyup handler.
		$textarea.off( this.eventNames );

		// Let other things happen after disabling.
		mw.hook( 'ext.WikiEditor.realtimepreview.disable' ).fire( this );

	} else {
		// Add the layout before the text div of the UI and then move the text div into it.
		$uiText.before( this.twoPaneLayout.$element );
		this.twoPaneLayout.setPane1( $uiText );
		this.twoPaneLayout.$element.show();

		// Move explicit height from text-ui (which may have been set via manual resizing), to panes.
		this.twoPaneLayout.$element.css( 'height', $uiText.height() + 'px' );
		$uiText.css( 'height', '100%' );

		// Enable realtime previewing.
		this.addPreviewListener( $textarea );

		// Let other things happen after enabling.
		mw.hook( 'ext.WikiEditor.realtimepreview.enable' ).fire( this );
	}

	// Record the toggle state and update the button.
	this.enabled = !this.enabled;
	this.button.setFlags( { progressive: this.enabled } );
};

/**
 * @public
 * @param {jQuery} $editor The element to listen to changes on.
 */
RealtimePreview.prototype.addPreviewListener = function ( $editor ) {
	// Get preview when enabling.
	this.doRealtimePreview();
	// Also get preview on keyup, change, paste etc.
	$editor
		.off( this.eventNames )
		.on( this.eventNames, mw.util.debounce(
			this.doRealtimePreview.bind( this ),
			this.configData.realtimeDebounce
		) );
};

/**
 * @private
 * @param {jQuery} $msg
 */
RealtimePreview.prototype.showError = function ( $msg ) {
	this.$previewNode.hide();
	// There is no need for a default message because mw.Api.getErrorMessage() will
	// always provide something (even for no network connection, server-side fatal errors, etc.).
	this.errorLayout.setMessage( $msg );
	this.errorLayout.toggle( true );
};

/**
 * @private
 */
RealtimePreview.prototype.doRealtimePreview = function () {
	// Wait for a response before making any new requests.
	if ( this.isPreviewing ) {
		// Queue up one final preview once this one finishes.
		this.previewPending = true;
		return;
	}

	this.isPreviewing = true;
	this.twoPaneLayout.getPane2().addClass( 'ext-WikiEditor-twopanes-loading' );
	var loadingSelectors = this.pagePreview.getLoadingSelectors();
	loadingSelectors.push( '.ext-WikiEditor-realtimepreview-preview' );
	this.errorLayout.toggle( false );
	this.pagePreview.doPreview( {
		$previewNode: this.$previewNode,
		$spinnerNode: false,
		loadingSelectors: loadingSelectors
	} ).fail( function ( code, result ) {
		this.showError( ( new mw.Api() ).getErrorMessage( result ) );
		mw.log.error( 'WikiEditor realtime preview error', result );
	}.bind( this ) ).always( function () {
		this.twoPaneLayout.getPane2().removeClass( 'ext-WikiEditor-twopanes-loading' );
		this.isPreviewing = false;

		if ( this.previewPending ) {
			this.previewPending = false;
			this.doRealtimePreview();
		}
	}.bind( this ) );
};

module.exports = RealtimePreview;

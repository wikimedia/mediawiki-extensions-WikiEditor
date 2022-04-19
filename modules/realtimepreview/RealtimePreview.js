var ResizingDragBar = require( './ResizingDragBar.js' );
var TwoPaneLayout = require( './TwoPaneLayout.js' );
var ErrorLayout = require( './ErrorLayout.js' );
var ManualWidget = require( './ManualWidget.js' );

/**
 * @class
 */
function RealtimePreview() {
	this.configData = mw.loader.moduleRegistry[ 'ext.wikiEditor' ].script.files[ 'data.json' ];
	// Preference name, must match what's in extension.json and Hooks.php.
	this.prefName = 'wikieditor-realtimepreview';
	this.enabled = this.getUserPref();
	this.twoPaneLayout = new TwoPaneLayout();
	this.pagePreview = require( 'mediawiki.page.preview' );
	// @todo This shouldn't be required, but the preview element is added in PHP
	// and can have attributes with values that aren't easily accessible from here,
	// and we need to duplicate here what Live Preview does in core.
	var $previewContent = $( '#wikiPreview' ).clone().html();
	this.$previewNode = $( '<div>' )
		.addClass( 'ext-WikiEditor-realtimepreview-preview' )
		.append( $previewContent );

	// Loading bar.
	this.$loadingBar = $( '<div>' ).addClass( 'ext-WikiEditor-realtimepreview-loadingbar' ).append( '<div>' );
	this.$loadingBar.hide();

	// Error layout.
	this.errorLayout = new ErrorLayout();
	this.errorLayout.getReloadButton().connect( this, {
		click: function () {
			// Re-show the manual message after the error message is closed.
			if ( this.inManualMode ) {
				this.manualWidget.toggle( true );
			}
			this.doRealtimePreview();
		}.bind( this )
	} );

	// Manual reload button (visible on hover).
	this.reloadButton = new OO.ui.ButtonWidget( {
		classes: [ 'ext-WikiEditor-reloadButton' ],
		icon: 'reload',
		label: mw.msg( 'wikieditor-realtimepreview-reload' ),
		accessKey: mw.msg( 'accesskey-wikieditor-realtimepreview' ),
		title: mw.msg( 'wikieditor-realtimepreview-reload-title' )
	} );
	this.reloadButton.connect( this, {
		click: function () {
			if ( !this.enabled ) {
				this.enable();
			}
			this.doRealtimePreview();
		}.bind( this )
	} );

	// Manual mode widget.
	this.manualWidget = new ManualWidget( this, this.reloadButton );
	this.inManualMode = false;

	this.twoPaneLayout.getPane2().append( this.manualWidget.$element, this.reloadButton.$element, this.$loadingBar, this.$previewNode, this.errorLayout.$element );
	this.eventNames = 'change.realtimepreview input.realtimepreview cut.realtimepreview paste.realtimepreview';
	// Used to ensure we wait for a response before making new requests.
	this.isPreviewing = false;
	this.previewPending = false;
	// Used to average response times and automatically disable realtime preview if it's very slow.
	this.responseTimes = [];
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
		framed: false,
		// T305953; So we can find usage of this class later: .tool
		classes: [ 'tool', 'ext-WikiEditor-realtimepreview-button' ]
	} );
	this.button.connect( this, { change: this.toggle } );
	return this.button;
};

/**
 * Get the user preference for Realtime Preview.
 *
 * @public
 * @return {boolean}
 */
RealtimePreview.prototype.getUserPref = function () {
	return mw.user.options.get( this.prefName ) > 0;
};

/**
 * Enable Realtime Preview.
 *
 * @public
 */
RealtimePreview.prototype.enable = function () {
	this.enabled = false;
	this.toggle();
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

		// Load the preview when enabling,
		this.doRealtimePreview();
		// and also on keyup, change, paste etc.
		$textarea
			.off( this.eventNames )
			.on( this.eventNames, this.getEventHandler() );

		// Hide or show the manual-reload message bar.
		this.manualWidget.toggle( this.inManualMode );

		// Let other things happen after enabling.
		mw.hook( 'ext.WikiEditor.realtimepreview.enable' ).fire( this );
	}

	// Record the toggle state and update the button.
	this.enabled = !this.enabled;
	this.button.$element.toggleClass( 'tool-active', this.enabled ); // T305953
	this.button.setFlags( { progressive: this.enabled } );
	( new mw.Api() ).saveOption( this.prefName, this.enabled ? 1 : 0 );
};

/**
 * @public
 * @return {Function}
 */
RealtimePreview.prototype.getEventHandler = function () {
	return mw.util.debounce(
		function () {
			// Only do preview if we're not in manual mode (as set in this.checkResponseTimes()).
			if ( !this.inManualMode ) {
				this.doRealtimePreview();
			}
		}.bind( this ),
		this.configData.realtimeDebounce
	);
};

/**
 * @private
 * @param {jQuery} $msg
 */
RealtimePreview.prototype.showError = function ( $msg ) {
	this.$previewNode.hide();
	this.manualWidget.toggle( false );
	// There is no need for a default message because mw.Api.getErrorMessage() will
	// always provide something (even for no network connection, server-side fatal errors, etc.).
	this.errorLayout.setMessage( $msg );
	this.errorLayout.toggle( true );
};

/**
 * @private
 * @param {number} time
 */
RealtimePreview.prototype.checkResponseTimes = function ( time ) {
	// Don't track response times if we're already in manual mode.
	if ( this.inManualMode ) {
		return;
	}

	this.responseTimes.push( Date.now() - time );
	if ( this.responseTimes.length < 3 ) {
		return;
	}

	var totalResponseTime = this.responseTimes.reduce( function ( a, b ) {
		return a + b;
	}, 0 );

	if ( ( totalResponseTime / this.responseTimes.length ) > this.configData.realtimeDisableDuration ) {
		this.inManualMode = true;
		// The error message might already be displayed if e.g. server timeout is greater than the disable-duration here.
		this.errorLayout.toggle( false );
		this.manualWidget.toggle( true );
	}

	this.responseTimes.shift();
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
	this.$loadingBar.show();
	this.reloadButton.setDisabled( true );
	var loadingSelectors = this.pagePreview.getLoadingSelectors();
	loadingSelectors.push( '.ext-WikiEditor-realtimepreview-preview' );
	loadingSelectors.push( '.ext-WikiEditor-ManualWidget' );
	this.errorLayout.toggle( false );
	var time = Date.now();

	this.pagePreview.doPreview( {
		$previewNode: this.$previewNode,
		$spinnerNode: false,
		loadingSelectors: loadingSelectors
	} ).fail( function ( code, result ) {
		this.showError( ( new mw.Api() ).getErrorMessage( result ) );
		mw.log.error( 'WikiEditor realtime preview error', result );
	}.bind( this ) ).always( function () {
		this.$loadingBar.hide();
		this.reloadButton.setDisabled( false );
		this.isPreviewing = false;
		this.checkResponseTimes( time );

		if ( this.previewPending ) {
			this.previewPending = false;
			this.doRealtimePreview();
		}
	}.bind( this ) );
};

module.exports = RealtimePreview;

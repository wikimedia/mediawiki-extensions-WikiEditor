/* global RealtimePreview */
/**
 * @class
 * @constructor
 * @param {RealtimePreview} realtimePreview
 * @param {OO.ui.ButtonWidget} reloadHoverButton
 */
function ManualWidget( realtimePreview, reloadHoverButton ) {
	var config = {
		classes: [ 'ext-WikiEditor-ManualWidget' ],
		framed: true
	};
	ManualWidget.super.call( this, config );

	this.reloadHoverButton = reloadHoverButton;

	// UI elements.
	var reloadIcon = new OO.ui.IconWidget( { icon: 'reload' } );
	var $reloadLabel = $( '<span>' )
		.text( mw.msg( 'wikieditor-realtimepreview-manual' ) );
	this.reloadButton = new OO.ui.ButtonWidget( {
		label: mw.msg( 'wikieditor-realtimepreview-reload' ),
		framed: false,
		flags: [ 'progressive' ]
	} );
	this.reloadButton.connect( realtimePreview, {
		click: realtimePreview.doRealtimePreview.bind( realtimePreview )
	} );
	this.$element.append( reloadIcon.$element, $reloadLabel, this.reloadButton.$element );
}

OO.inheritClass( ManualWidget, OO.ui.Widget );

ManualWidget.prototype.toggle = function ( show ) {
	ManualWidget.parent.prototype.toggle.call( this, show );
	if ( show ) {
		this.reloadHoverButton.$element.remove();
		// Use the same access key as the hover reload button, because this won't ever be displayed at the same time as that.
		this.reloadButton.setAccessKey( mw.msg( 'accesskey-wikieditor-realtimepreview' ) );
	}
};

module.exports = ManualWidget;

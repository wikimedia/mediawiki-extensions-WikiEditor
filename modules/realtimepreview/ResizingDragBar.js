/**
 * @class
 * @constructor
 * @extends OO.ui.Element
 * @param {Object} [config] Configuration options
 * @param {boolean} [config.isEW] Orientation of the drag bar, East-West (true) or North-South (false).
 */
function ResizingDragBar( config ) {
	config = Object.assign( {}, {
		isEW: true,
		classes: [ 'ext-WikiEditor-ResizingDragBar' ]
	}, config );
	ResizingDragBar.super.call( this, config );

	const classNameDir = 'ext-WikiEditor-ResizingDragBar-' + ( config.isEW ? 'ew' : 'ns' );
	// Possible class names:
	// * ext-WikiEditor-ResizingDragBar-ew
	// * ext-WikiEditor-ResizingDragBar-ns
	this.$element.addClass( classNameDir );

	// Determine the horizontal direction to move (flexbox automatically reverses but the offset direction doesn't).
	const rtlFactor = config.isEW && OO.ui.Element.static.getDir( document ) === 'rtl' ? -1 : 1;
	this.$element.on( 'mousedown', ( eventMousedown ) => {
		if ( eventMousedown.button !== ResizingDragBar.static.MAIN_MOUSE_BUTTON ) {
			// If not the main mouse (e.g. left) button, ignore.
			return;
		}
		// Prevent selecting (or anything else) when dragging over other parts of the page.
		$( document ).on( 'selectstart.' + classNameDir, false );
		// Set up parameter names.
		const xOrY = config.isEW ? 'pageX' : 'pageY';
		const widthOrHeight = config.isEW ? 'width' : 'height';
		let lastOffset = eventMousedown[ xOrY ];
		// Handle the actual dragging.
		$( document ).on( 'mousemove.' + classNameDir, ( eventMousemove ) => {
			// Initial width or height of the pane.
			const startSize = this.getResizedPane()[ widthOrHeight ]();
			// Current position of the mouse (relative to page, not viewport).
			const newOffset = eventMousemove[ xOrY ];
			// Distance the mouse has moved.
			const change = rtlFactor * ( lastOffset - newOffset );
			// Set the new size of the pane, and tell others about it.
			const newSize = Math.max( startSize - change, ResizingDragBar.static.MIN_PANE_SIZE );
			this.getResizedPane().css( widthOrHeight, newSize );
			// Save the new starting point of the mouse, from which to calculate the next move.
			lastOffset = newOffset;
			// Let other scripts do things after the resize.
			mw.hook( 'ext.WikiEditor.realtimepreview.resize' ).fire( this );
		} );
	} );
	// Add a UI affordance within the handle area (CSS gives it its appearance).
	this.$element.append( $( '<span>' ) );
	// Remove the resize event handler when the mouse is released.
	$( document ).on( 'mouseup', () => {
		$( document ).off( 'mousemove.' + classNameDir );
		$( document ).off( 'selectstart.' + classNameDir, false );
	} );
}

OO.inheritClass( ResizingDragBar, OO.ui.Element );

/**
 * @static
 * @property {number} See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
 */
ResizingDragBar.static.MAIN_MOUSE_BUTTON = 0;

/**
 * @static
 * @property {number} The minimum pane size, in pixels.
 * Should be slightly more than the affordance length.
 * This should match the max-width of the .ext-WikiEditor-twopanes-pane2 element.
 */
ResizingDragBar.static.MIN_PANE_SIZE = 248;

/**
 * Get the pane that is resized by this bar (always the immediate prior sibling).
 *
 * @public
 * @return {jQuery}
 */
ResizingDragBar.prototype.getResizedPane = function () {
	return this.$element.prev();
};

module.exports = ResizingDragBar;

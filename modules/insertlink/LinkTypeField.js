/**
 * @class
 * @extends OO.ui.FieldLayout
 * @mixes OO.EventEmitter
 * @constructor
 */
function LinkTypeField() {
	// Mixin constructor
	OO.EventEmitter.call( this );

	this.radioInt = new OO.ui.RadioOptionWidget( {
		data: 'int',
		label: mw.msg( 'wikieditor-toolbar-tool-link-int' )
	} );
	this.radioExt = new OO.ui.RadioOptionWidget( {
		data: 'ext',
		label: mw.msg( 'wikieditor-toolbar-tool-link-ext' )
	} );
	var radioSelect = new OO.ui.RadioSelectWidget( {
		items: [
			this.radioInt,
			this.radioExt
		]
	} );
	radioSelect.connect( this, {
		choose: this.onRadioChoose
	} );

	var config = {
		align: 'top',
		classes: [ 'ext-WikiEditor-InsertLink-LinkTypeField' ]
	};
	LinkTypeField.super.call( this, radioSelect, config );
}

OO.inheritClass( LinkTypeField, OO.ui.FieldLayout );
OO.mixinClass( LinkTypeField, OO.EventEmitter );

/**
 * Select the 'external link' radio.
 *
 * @param {boolean} isExternal
 */
LinkTypeField.prototype.setIsExternal = function ( isExternal ) {
	this.getField().selectItem( isExternal ? this.radioExt : this.radioInt );
};

/**
 * Is the 'internal link' radio currently selected?
 *
 * @return {boolean}
 */
LinkTypeField.prototype.isInternal = function () {
	return this.radioInt.isSelected();
};

/**
 * Emit a 'change' event when the radio selection changes.
 *
 * @private
 */
LinkTypeField.prototype.onRadioChoose = function () {
	this.emit( 'change', this.radioExt.isSelected() );
};

module.exports = LinkTypeField;
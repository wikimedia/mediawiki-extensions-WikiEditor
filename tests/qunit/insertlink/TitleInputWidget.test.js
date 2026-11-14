const TitleInputWidget = require( '../../../modules/insertlink/TitleInputWidget.js' );

QUnit.module( 'ext.wikiEditor.insertlink.TitleInputWidget', ( hooks ) => {
	hooks.beforeEach( function () {
		this.widget = new TitleInputWidget();
		this.widget.setLookupsDisabled( true );
		this.getItems = function ( query, response ) {
			this.widget.setValue( query );
			const data = this.widget.getLookupCacheDataFromResponse( response );
			return this.widget.getLookupMenuOptionsFromData( data );
		};
	} );
	hooks.afterEach( function () {
		this.widget.$overlay.remove();
	} );

	QUnit.test( 'External link suggestion keeps the URL as typed', function ( assert ) {
		const url = 'https://phabricator.wikimedia.org/tag/wikieditor_2010/';
		const items = this.getItems( url, { query: { pages: { '-1': {
			ns: 0,
			title: 'Https://phabricator.wikimedia.org/tag/wikieditor 2010/',
			missing: ''
		} } } } );

		assert.strictEqual( items.length, 1, 'One suggestion' );
		assert.true( items[ 0 ].isExternal(), 'Suggestion is an external link' );
		assert.strictEqual( items[ 0 ].getData(), url, 'Underscores are not replaced' );
	} );

	QUnit.test( 'Internal link suggestion uses the normalized title', function ( assert ) {
		const items = this.getItems( 'foo_bar', { query: { pages: { '-1': {
			ns: 0,
			title: 'Foo bar',
			missing: ''
		} } } } );

		assert.strictEqual( items.length, 1, 'One suggestion' );
		assert.false( items[ 0 ].isExternal(), 'Suggestion is an internal link' );
		assert.strictEqual( items[ 0 ].getData(), 'Foo bar', 'Title is normalized' );
	} );
} );

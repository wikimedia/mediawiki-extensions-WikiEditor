/*!
 * WikiEditor extension initialisation
 * @copyright 2015 Wikimedia Foundation and Alex Monk
 * @license GPL; see COPYING
 */

( function ( mw, $ ) {
	mw.wikiEditor = {
		logEditEvent: function ( action, data ) {
			if ( mw.loader.getState( 'schema.Edit' ) === null ) {
				return;
			}

			mw.loader.using( 'schema.Edit' ).done( function () {
				data = $.extend( {
					version: 1,
					action: action,
					editor: 'wikitext',
					platform: 'desktop', // FIXME
					integration: 'page',
					'page.id': mw.config.get( 'wgArticleId' ),
					'page.title': mw.config.get( 'wgPageName' ),
					'page.ns': mw.config.get( 'wgNamespaceNumber' ),
					'page.revid': mw.config.get( 'wgRevisionId' ),
					'page.length': -1, // FIXME
					'user.id': mw.user.getId(),
					'user.editCount': mw.config.get( 'wgUserEditCount', 0 ),
					'mediawiki.version': mw.config.get( 'wgVersion' )
				}, data );

				if ( mw.user.isAnon() ) {
					data['user.class'] = 'IP';
				}

				data['action.' + action + '.type'] = data.type;
				data['action.' + action + '.mechanism'] = data.mechanism;
				data['action.' + action + '.timing'] = data.timing === undefined ?
					0 : Math.floor( data.timing );
				// Remove renamed properties
				delete data.type;
				delete data.mechanism;
				delete data.timing;

				mw.eventLog.logEvent( 'Edit', data );
			} );
		}
	};
}( mediaWiki, jQuery ) );

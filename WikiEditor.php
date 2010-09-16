<?php
/**
 * WikiEditor extension
 * 
 * @file
 * @ingroup Extensions
 * 
 * @author Trevor Parscal <trevor@wikimedia.org>
 * @author Roan Kattouw <roan.kattouw@gmail.com>
 * @author Nimish Gautam <nimish@wikimedia.org>
 * @author Adam Miller <amiller@wikimedia.org>
 * @license GPL v2 or later
 * @version 0.3.0
 */

/* Configuration */

// Each module may be configured individually to be globally on/off or user preference based
$wgWikiEditorFeatures = array(
	'addMediaWizard' => array( 'global' => false, 'user' => false ),
	'dialogs' => array( 'global' => false, 'user' => true ),
	'highlight' => array( 'global' => false, 'user' => true ),
	'toolbar' => array( 'global' => false, 'user' => true ),
	'preview' => array( 'global' => false, 'user' => true ),
	'previewDialog' => array( 'global' => false, 'user' => true ),
	'publish' => array( 'global' => false, 'user' => true ),
	'templateEditor' => array( 'global' => false, 'user' => true ),
	'templates' => array( 'global' => false, 'user' => true ),
	'toc' => array( 'global' => false, 'user' => true ),
);

// Bump this each time you change an icon without renaming it
$wgWikiEditorIconVersion = 0;

/* Setup */

$wgExtensionCredits['other'][] = array(
	'path' => __FILE__,
	'name' => 'WikiEditor',
	'author' => array( 'Trevor Parscal', 'Roan Kattouw', 'Nimish Gautam', 'Adam Miller' ),
	'version' => '0.3.0',
	'url' => 'http://www.mediawiki.org/wiki/Extension:UsabilityInitiative',
	'descriptionmsg' => 'wikieditor-desc',
);
$wgAutoloadClasses['WikiEditorHooks'] = dirname( __FILE__ ) . '/WikiEditor.hooks.php';
$wgExtensionMessagesFiles['WikiEditor'] = dirname( __FILE__ ) . '/WikiEditor.i18n.php';
$wgHooks['EditPage::showEditForm:initial'][] = 'WikiEditorHooks::editPageShowEditFormInitial';
$wgHooks['GetPreferences'][] = 'WikiEditorHooks::getPreferences';
$wgHooks['MakeGlobalVariablesScript'][] = 'WikiEditorHooks::makeGlobalVariablesScript';
$wgHooks['ResourceLoaderRegisterModules'][] = 'WikiEditorHooks::resourceLoaderRegisterModules';

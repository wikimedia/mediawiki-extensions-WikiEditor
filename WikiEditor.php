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
$wgWikiEditorModules = array(
	// Order is significant: makes beta prefs appear before labs prefs
	'toolbar' => array( 'global' => false, 'user' => true ),
	'highlight' => array( 'global' => false, 'user' => true ),
	'preview' => array( 'global' => false, 'user' => true ),
	'previewDialog' => array( 'global' => false, 'user' => true ),
	'publish' => array( 'global' => false, 'user' => true ),
	'toc' => array( 'global' => false, 'user' => true ),
	'templateEditor' => array( 'global' => false, 'user' => true ),
	'templates' => array( 'global' => false, 'user' => true ),
	'addMediaWizard' => array( 'global' => false, 'user' => false ),
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
$wgHooks['BeforePageDisplay'][] = 'WikiEditorHooks::beforePageDisplay';
$wgHooks['GetPreferences'][] = 'WikiEditorHooks::getPreferences';
$wgHooks['MakeGlobalVariablesScript'][] = 'WikiEditorHooks::makeGlobalVariablesScript';
$wgHooks['ResourceLoaderRegisterModules'][] = 'WikiEditorHooks::resourceLoaderRegisterModules';

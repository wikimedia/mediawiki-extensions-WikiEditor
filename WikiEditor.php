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
	
	/* Textarea / i-frame compatible (probably deployable) */
	
	'toolbar' => array( 'global' => false, 'user' => true ),
	// Provides interactive tools
	'dialogs' => array( 'global' => false, 'user' => true ),
	// Adds a tab for previewing in-line
	'preview' => array( 'global' => false, 'user' => true ),
	// Adds a button for previewing in a dialog
	'previewDialog' => array( 'global' => false, 'user' => true ),
	//  Adds a button and dialog for step-by-step publishing
	'publish' => array( 'global' => false, 'user' => true ),
	
	/* I-frame dependent (do not deploy!) */
	
	// Experimental wikitext parsing/syntax highlight
	'highlight' => array( 'global' => false, 'user' => true ),
	// Failry stable table of contents
	'toc' => array( 'global' => false, 'user' => true ),
	// Pretty broken template collapsing/editing
	'templateEditor' => array( 'global' => false, 'user' => true ),
	// Bare-bones (probably broken) template collapsing
	'templates' => array( 'global' => false, 'user' => true ),
	
	/* Unknown status */
	
	// Adds the AddMediaWizard gadget to the toolbar
	'addMediaWizard' => array( 'global' => false, 'user' => false ),
);

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

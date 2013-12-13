<?php
/**
 * Inicialización de la extensión Visual
 *
 * Documentation:   https://github.com/maparrar/Visual
 * Support:         https://github.com/maparrar/Visual
 * Source code:     https://github.com/maparrar/Visual
 *
 * @file Visual.php
 * @ingroup Visual
 *
 * @licence GNU GPL v2+
 *
 * @author Alejandro Parra < maparrar@gmail.com >
 */


$wgExtensionCredits['other'][] = array(
	'path' => __FILE__,
	'name' => 'Visual',
	'version' => 'visual = 0.1',
	'author' => array( '[https://github.com/maparrar maparrar]' ),
	'url' => 'https://github.com/maparrar/Visual',
	'descriptionmsg' => 'visual-desc',
);

// Adds Autoload Classes
$wgAutoloadClasses['VisualHooks'] = dirname( __FILE__ ) . "/VisualHooks.php";
// Adds Internationalized Messages
//$wgExtensionMessagesFiles['Visual'] = dirname( __FILE__ ) . "/Visual.i18n.php";

//VisualHooks::addResources($out);

// Registers Hooks
$wgHooks['BeforePageDisplay'][] = 'VisualHooks::addResources';
//$wgHooks['MakeGlobalVariablesScript'][] = 'JSBreadCrumbsHooks::addJSVars';
//$wgHooks['GetPreferences'][] = 'JSBreadCrumbsHooks::addPreferences';
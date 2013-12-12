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

/**
 * This documentation group collects source code files belonging to Visual.
 *
 * @defgroup Visual Visual
 */

define( 'Visual_VERSION', 'visual = 0.1' );

$wgExtensionCredits['other'][] = array(
	'path' => __FILE__,
	'name' => 'Visual',
	'version' => Visual_VERSION,
	'author' => array( '[https://github.com/maparrar maparrar]' ),
	'url' => 'https://github.com/maparrar/Visual',
	'descriptionmsg' => 'visual-desc',
);

$wgExtensionMessagesFiles['Visual'] = dirname( __FILE__ ) . '/Visual.i18n.php';
<?php
/**
 * Verdant Harvest theme functions.
 *
 * @package verdant-harvest
 */

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'verdant-harvest-style',
		get_parent_theme_file_uri( 'style.css' ),
		array(),
		wp_get_theme()->get( 'Version' )
	);
} );

add_action( 'after_setup_theme', function () {
	add_editor_style( 'style.css' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_script(
		'verdant-harvest-motion',
		get_parent_theme_file_uri( 'assets/motion.js' ),
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
} );

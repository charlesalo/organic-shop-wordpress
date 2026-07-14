<?php
/**
 * Fix wp_mail() rejecting the default wordpress@localhost From address
 * (PHPMailer treats "localhost" as an invalid domain).
 */

add_filter( 'wp_mail_from', function ( $from_email ) {
	if ( 'wordpress@localhost' === $from_email ) {
		return 'no-reply@organicshop.test';
	}
	return $from_email;
} );

add_filter( 'wp_mail_from_name', function ( $from_name ) {
	if ( 'WordPress' === $from_name ) {
		return 'Organic Shop';
	}
	return $from_name;
} );

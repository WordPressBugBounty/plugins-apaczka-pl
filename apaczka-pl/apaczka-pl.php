<?php
/**
 * Plugin Name: Apaczka.pl
 * Plugin URI: https://www.apaczka.com/zostan-sprzedawca
 * Description: Nadawaj przesyłki za pośrednictwem Apaczka.pl bezpośrednio z panelu swojego sklepu
 * Product: Apaczka Woocommerce
 * Version: 1.3.1
 * Tested up to: 6.8
 * Requires at least: 5.3
 * Requires PHP: 7.2
 * Author: iLabs LTD
 * Author URI: https://iLabs.dev
 * Text Domain: apaczka-pl
 * Domain Path: /languages/
 *
 * Copyright 2022 iLabs LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

define( 'APACZKA_PL_PLUGIN_DIR', __DIR__ );
define( 'APACZKA_PL_PLUGIN_FILE', __FILE__ );

function apaczka(): \Inspire_Labs\Apaczka_Woocommerce\Plugin {
	return new \Inspire_Labs\Apaczka_Woocommerce\Plugin();
}

add_action(
	'after_setup_theme',
	function () {
		if (
		( function_exists( 'is_plugin_active' ) && is_plugin_active( 'woocommerce/woocommerce.php' ) )
		|| in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) )
		|| ( defined( 'WC_PLUGIN_FILE' ) && defined( 'WC_VERSION' ) )
		) {

			$config = array(
				'__FILE__'    => __FILE__,
				'slug'        => 'apaczka_woocommerce',
				'lang_dir'    => 'lang',
				'text_domain' => 'apaczka-pl',
			);

            load_plugin_textdomain(
                'apaczka-pl',
                false,
                dirname( plugin_basename( APACZKA_PL_PLUGIN_FILE ) ) . '/lang/'
            );

			apaczka()->execute( $config );
			apaczka()->plugins_loaded_hooks();


		} else {
			add_action( 'admin_notices', 'apaczka_woo_needed_notice' );
			return;
		}
	}
);


add_action(
	'before_woocommerce_init',
	function () {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
		}
	}
);


function apaczka_woo_needed_notice() {
	$message = sprintf(
	/* translators: Placeholders: %1$s and %3$s are <strong> tags. %2$s and %4$s are text */
		'%1$s %2$s %3$s %4$s',
		'<strong>',
		esc_html__( 'Apaczka WooCommerce 2.0', 'apaczka-pl' ),
		'</strong>',
		esc_html__( 'requires WooCommerce to function.', 'apaczka-pl' )
	);
	printf( '<div class="error"><p>%s</p></div>', wp_kses_post( $message ) );
}

add_filter(
	'plugin_action_links_' . plugin_basename( __FILE__ ),
	function ( $links ) {
		$plugin_links = array(
			'<a href="/wp-admin/admin.php?page=wc-settings&tab=apaczka_woocommerce_settings_general">' . esc_html__( 'Ustawienia', 'apaczka-pl' ) . '</a>',
		);

		return array_merge( $links, $plugin_links );
	}
);


/**
 * On deactivation delete services cache
 */
register_deactivation_hook( __FILE__, 'apaczka_delete_service_cache' );
function apaczka_delete_service_cache() {
	delete_option( 'apaczka_woocommerce_SC_CACHE' );
	delete_option( 'apaczka_woocommerce_SC_CACHE_TIMESTAMP' );
}

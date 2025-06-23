<?php

namespace Inspire_Labs\Apaczka_Woocommerce;

use Automattic\WooCommerce\Blocks\Integrations\IntegrationInterface;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Woo_Blocks implements IntegrationInterface {


	/**
	 * The name of the integration.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'apaczka-woo-blocks';
	}

	/**
	 * When called invokes any initialization/setup for the integration.
	 */
	public function initialize() {

        $current_plugin_version = apaczka()->get_plugin_version();
		$script_url =  apaczka()->get_plugin_js_url() . '/build/apaczka-pl-block-frontend.js';
        $script_path  = apaczka()->get_plugin_dir() . 'assets/js/build/apaczka-pl-block-frontend.js';

        $script_asset = array(
			'dependencies' => array( 'wc-settings', 'wp-data', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n', 'wp-primitives' ),
			'version'      => file_exists( $script_path ) ? filemtime( $script_path ) : $current_plugin_version,
		);

		wp_register_script(
			'apaczka-pl-wc-blocks-integration',
			$script_url,
			$script_asset['dependencies'],
			$script_asset['version'],
			true
		);

        $lang_dir = APACZKA_PL_PLUGIN_DIR . '/lang/';

        wp_set_script_translations(
            'apaczka-pl-wc-blocks-integration',
            'apaczka-pl',
            $lang_dir
        );
	}

	/**
	 * Returns an array of script handles to enqueue in the frontend context.
	 *
	 * @return string[]
	 */
	public function get_script_handles() {
		return array( 'apaczka-pl-wc-blocks-integration' );
	}

	/**
	 * Returns an array of script handles to enqueue in the editor context.
	 *
	 * @return string[]
	 */
	public function get_editor_script_handles() {
		return array( 'apaczka-pl-wc-blocks-integration' );
	}

	/**
	 * An array of key, value pairs of data made available to the block on the client side.
	 *
	 * @return array
	 */
	public function get_script_data() {
		return array(
			'apaczka' => 'wc-data-apaczka',
		);
	}

    /**
     * Get the file modified time as a cache buster if we're in dev mode.
     *
     * @param string $file Local path to the file.
     *
     * @return string The cache buster value to use for the given file.
     * @throws \Exception
     */
	protected function get_file_version( $file ) {
		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG && file_exists( $file ) ) {
			return filemtime( $file );
		}

		return apaczka()->get_plugin_version();
	}
}

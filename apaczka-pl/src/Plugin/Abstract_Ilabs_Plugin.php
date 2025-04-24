<?php
/**
 * @version 0.1
 */

namespace Inspire_Labs\Apaczka_Woocommerce\Plugin;

use Exception;

abstract class Abstract_Ilabs_Plugin {

	use Tools;
	use Environment;


	private static $config;

	/**
	 * Execute
	 *
	 * @param array $config
	 *
	 * @return void
	 * @throws Exception
	 */
	public function execute( array $config ) {
		self::$config = $config;
		$this->init_request();
		$this->before_init();

		add_action(
			'init',
			function () {
				$this->enqueue_scripts();
				$this->init();
			}
		);

		add_action(
			'plugins_loaded',
			function () use ( $config ) {
				if ( ! function_exists( 'is_plugin_active' ) ) {
					$this->require_wp_core_file( 'wp-admin/includes/plugin.php' );
				}
			}
		);
	}

	/**
	 * Get request
	 *
	 * @return Request
	 */
	public function get_request(): Request {
		return new Request();
	}

	private function init_request() {
		$request = new Request();
		$request->register_request_filter( new Security_Request_Filter() );

		foreach ( $this->register_request_filters() as $filter ) {
			$request->register_request_filter( $filter );
		}

		$request->build();
	}

	/**
	 * @return Request_Filter_Interface[]
	 */
	protected function register_request_filters(): array {
		return array();
	}


	private function enqueue_scripts() {
		add_action(
			'admin_enqueue_scripts',
			array( $this, 'enqueue_dashboard_scripts' )
		);
		add_action(
			'wp_enqueue_scripts',
			array( $this, 'enqueue_frontend_scripts' )
		);
	}

	abstract public function enqueue_frontend_scripts();

	abstract public function enqueue_dashboard_scripts();

	abstract protected function before_init();

	abstract public function plugins_loaded_hooks();
}

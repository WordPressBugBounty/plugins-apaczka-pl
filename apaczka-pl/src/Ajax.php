<?php

namespace Inspire_Labs\Apaczka_Woocommerce;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Ajax {

	/**
	 * Ajax handler
	 */
	public function init() {
		add_action( 'wp_ajax_apaczka', array( $this, 'ajax_apaczka' ) );
		add_action(
			'admin_head',
			array( $this, 'wp_footer_apaczka_nonce' )
		);
	}

	public function wp_footer_apaczka_nonce() {
		?>
		<script type="text/javascript">
			var apaczka_ajax_nonce = '<?php echo esc_attr( wp_create_nonce( 'apaczka_ajax_nonce' ) ); ?>';
		</script>
		<?php
	}

	public function ajax_apaczka() {
		check_ajax_referer( 'apaczka_ajax_nonce', 'security' );
		if ( isset( $_REQUEST['apaczka_action'] ) ) {
			$action = sanitize_text_field( wp_unslash( $_REQUEST['apaczka_action'] ) );
			if ( 'create_package' === $action ) {
				$this->create_package( Shipping_Method_Apaczka::APACZKA_PICKUP_COURIER );
			}
			if ( 'calculate' === $action ) {
				$this->calculate( Shipping_Method_Apaczka::APACZKA_PICKUP_COURIER );
			}
			if ( 'cancel_package' === $action ) {
				$this->cancel();
			}
			if ( 'create_package_pickup_self' === $action ) {
				$this->create_package( Shipping_Method_Apaczka::APACZKA_PICKUP_SELF );
			}
			if ( 'download_turn_in' === $action ) {
				$this->download_turn_in();
			}
		}
	}

	public function create_package() {
		Shipping_Method_Apaczka::ajax_create_package();
	}

	public function calculate() {
		Shipping_Method_Apaczka::ajax_calculate_package();
	}

	public function cancel() {
		Shipping_Method_Apaczka::ajax_cancel_package();
	}

	public function download_turn_in() {
		Shipping_Method_Apaczka::download_turn_in();
	}
}


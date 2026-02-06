<?php

namespace Inspire_Labs\Apaczka_Woocommerce;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Helper
 */
class Helper {


	/**
	 * Retrieves order meta data with fallback options.
	 *
	 * @param int    $order_id The order ID.
	 * @param string $meta_key The meta key to retrieve.
	 * @return mixed|null The meta value or null if not found.
	 *
	 * @since 1.3.6
	 * @access public
	 */
	public function get_woo_order_meta( $order_id, $meta_key ) {

		$res = null;

		if ( ! $order_id ) {
			return null;
		}

		$order = wc_get_order( $order_id );
		if ( ! $order || is_wp_error( $order ) ) {
			return null;
		}

		$res = $order->get_meta( $meta_key );

		if ( empty( $res ) ) {
			$res = get_post_meta( $order_id, $meta_key, true );
		}

		if ( ! $res && '_apaczka' === $meta_key ) {
			$res = $this->get_woo_order_meta( $order_id, 'alsendo_connect_wc_order' );
		}

		if ( ! $res && 'apaczka_delivery_point' === $meta_key ) {
			$res = $this->get_woo_order_meta( $order_id, 'alsendo_connect_delivery_point' );
		}

		return $res;
	}
}

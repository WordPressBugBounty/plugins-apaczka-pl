<?php

namespace Inspire_Labs\Apaczka_Woocommerce;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Integrations
 */
class Integrations {


	/**
	 * @var Helper
	 */
	private $helper;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->hooks();
		$this->helper = new Helper();
	}

	/**
	 * Registers hooks for the plugin functionality.
	 *
	 * @return void
	 *
	 * @since 1.3.6
	 * @access public
	 */
	public function hooks() {

		add_filter( 'wc_subscriptions_object_data', array( $this, 'woo_subscriptions_integration' ), 10, 3 );
		add_action( 'wps_sfw_renewal_order_creation', array( $this, 'sfw_subscriptions_integration' ), 10, 2 );
	}


	/**
	 * Integrates with WooCommerce Subscriptions to copy data between orders.
	 *
	 * @param array $data The subscription data.
	 * @param mixed $to_object The target object.
	 * @param mixed $from_object The source object.
	 * @return array The modified subscription data.
	 *
	 * @since 1.3.6
	 * @access public
	 */
	public function woo_subscriptions_integration( $data, $to_object, $from_object ) {

		$subscription_id = null;
		$new_order_id    = null;

		if ( ( is_object( $from_object ) ) ) {
			$subscription_id = $from_object->get_id();
		} else {
			$subscription_id = is_numeric( $from_object ) ? $from_object : null;
		}

		if ( ( is_object( $to_object ) ) ) {
			$new_order_id = $to_object->get_id();
		} else {
			$new_order_id = is_numeric( $to_object ) ? $to_object : null;
		}

		if ( ! empty( $subscription_id ) && ! empty( $new_order_id ) ) {
			$this->copy_apaczka_data_to_new_order( $subscription_id, $new_order_id );
		}

		return $data;
	}


	/**
	 * Copies Apaczka shipping data from one order to another.
	 *
	 * @param int $subscription_id The source order ID.
	 * @param int $new_order_id The target order ID.
	 * @return void
	 *
	 * @since 1.3.6
	 * @access public
	 */
	public function copy_apaczka_data_to_new_order( $subscription_id, $new_order_id ) {

		$subscription    = null;
		$parent_order_id = null;

		if ( function_exists( 'wcs_get_subscription' ) ) {
			$subscription = wcs_get_subscription( $subscription_id );
		}

		if ( ! $subscription || is_wp_error( $subscription ) ) {
			return;
		}

		$parent_order_id = $subscription->get_parent_id();

		if ( empty( $parent_order_id ) ) {
			return;
		}

		$new_order = wc_get_order( $new_order_id );

		if ( ! $new_order || is_wp_error( $new_order ) ) {
			return;
		}

		$apaczka_wc_order_data  = $this->helper->get_woo_order_meta( $parent_order_id, '_apaczka' );
		$apaczka_delivery_point = $this->helper->get_woo_order_meta( $parent_order_id, 'apaczka_delivery_point' );

		if ( ! empty( $apaczka_wc_order_data ) ) {
			if ( isset( $apaczka_wc_order_data['order_send'] ) ) {
				unset( $apaczka_wc_order_data['order_send'] );
			}
			if ( isset( $apaczka_wc_order_data['package_send'] ) ) {
				unset( $apaczka_wc_order_data['package_send'] );
			}
			$new_order->update_meta_data( '_apaczka', $apaczka_wc_order_data );
			$new_order->save();
		}

		if ( ! empty( $apaczka_delivery_point ) ) {
			$new_order->update_meta_data( 'apaczka_delivery_point', $apaczka_delivery_point );
			$new_order->save();
		}
	}


	/**
	 * Integrates with Subscriptions for WooCommerce plugin to copy shipping data to renewal orders.
	 *
	 * @param WC_Order $new_order The new renewal order.
	 * @param int      $subscription_id The subscription ID.
	 * @return void
	 *
	 * @since 1.3.6
	 * @access public
	 */
	public function sfw_subscriptions_integration( $new_order, $subscription_id ) {

		if ( ! $new_order || is_wp_error( $new_order ) ) {
			return;
		}

		$subscription    = null;
		$parent_order_id = null;

		if ( 'yes' === get_option( 'woocommerce_custom_orders_table_enabled' ) ) {
			if ( class_exists( 'WPS_Subscription' ) ) {
				$subscription = new \WPS_Subscription( $subscription_id );
			}
		} else {
			$subscription = get_post( $subscription_id );
		}

		if ( $subscription ) {
			$parent_order_id = $subscription->get_meta( 'wps_parent_order' );
		}

		if ( ! $parent_order_id ) {
			return;
		}

		$apaczka_wc_order_data  = $this->helper->get_woo_order_meta( $parent_order_id, '_apaczka' );
		$apaczka_delivery_point = $this->helper->get_woo_order_meta( $parent_order_id, 'apaczka_delivery_point' );

		if ( ! empty( $apaczka_wc_order_data ) ) {
			if ( isset( $apaczka_wc_order_data['order_send'] ) ) {
				unset( $apaczka_wc_order_data['order_send'] );
			}
			if ( isset( $apaczka_wc_order_data['package_send'] ) ) {
				unset( $apaczka_wc_order_data['package_send'] );
			}
			$new_order->update_meta_data( '_apaczka', $apaczka_wc_order_data );
			$new_order->save();
		}

		if ( ! empty( $apaczka_delivery_point ) ) {
			$new_order->update_meta_data( 'apaczka_delivery_point', $apaczka_delivery_point );
			$new_order->save();
		}
	}
}

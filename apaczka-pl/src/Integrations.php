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

		$parent_order = wc_get_order( $parent_order_id );
		$this->log_order_shipping_data( $parent_order, 'check address data in parent order' );

		$apaczka_wc_order_data  = $this->helper->get_woo_order_meta( $parent_order_id, '_apaczka' );
		$apaczka_delivery_point = $this->helper->get_woo_order_meta( $parent_order_id, 'apaczka_delivery_point' );

		if ( ! empty( $apaczka_wc_order_data ) ) {
			if ( isset( $apaczka_wc_order_data['order_send'] ) ) {
				unset( $apaczka_wc_order_data['order_send'] );
			}
			if ( isset( $apaczka_wc_order_data['package_send'] ) ) {
				unset( $apaczka_wc_order_data['package_send'] );
			}
			$apaczka_wc_order_data = $this->update_apaczka_receiver_from_order( $apaczka_wc_order_data, $new_order, $subscription, $parent_order );
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

		$subscription     = null;
		$wcs_subscription = null;
		$parent_order_id  = null;

		if ( function_exists( 'wcs_get_subscription' ) ) {
			$wcs_subscription = wcs_get_subscription( $subscription_id );
		}

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

		if ( ! $parent_order_id && $wcs_subscription && ! is_wp_error( $wcs_subscription ) ) {
			$parent_order_id = $wcs_subscription->get_parent_id();
		}

		if ( ! $parent_order_id ) {
			return;
		}

		$parent_order = wc_get_order( $parent_order_id );
		$this->log_order_shipping_data( $parent_order, 'check address data in parent order' );
		$this->log_order_shipping_data( $wcs_subscription, 'check address data in subscription object' );

		$apaczka_wc_order_data  = $this->helper->get_woo_order_meta( $parent_order_id, '_apaczka' );
		$apaczka_delivery_point = $this->helper->get_woo_order_meta( $parent_order_id, 'apaczka_delivery_point' );

		if ( ! empty( $apaczka_wc_order_data ) ) {
			if ( isset( $apaczka_wc_order_data['order_send'] ) ) {
				unset( $apaczka_wc_order_data['order_send'] );
			}
			if ( isset( $apaczka_wc_order_data['package_send'] ) ) {
				unset( $apaczka_wc_order_data['package_send'] );
			}
			$apaczka_wc_order_data = $this->update_apaczka_receiver_from_order( $apaczka_wc_order_data, $new_order, $wcs_subscription, $parent_order );
			$new_order->update_meta_data( '_apaczka', $apaczka_wc_order_data );
			$new_order->save();
		}

		if ( ! empty( $apaczka_delivery_point ) ) {
			$new_order->update_meta_data( 'apaczka_delivery_point', $apaczka_delivery_point );
			$new_order->save();
		}
	}

	/**
	 * Updates Apaczka receiver data with address details from an order.
	 *
	 * @param array             $data          Apaczka data array.
	 * @param WC_Order          $order         Renewal order.
	 * @param WC_Subscription   $subscription  Subscription object with latest customer shipping data.
	 * @param WC_Order|null     $parent_order  Parent order as fallback source.
	 * @return array
	 */
	private function update_apaczka_receiver_from_order( $data, $order, $subscription = null, $parent_order = null ) {
		if ( function_exists( 'wc_get_logger' ) ) {
			\wc_get_logger()->debug( 'update_apaczka_receiver_from_order: start', array( 'source' => 'subscription-apaczka' ) );
			\wc_get_logger()->debug( print_r( $data, true ), array( 'source' => 'subscription-apaczka' ) );
		}

		if ( ! is_array( $data ) ) {
			if ( function_exists( 'wc_get_logger' ) ) {
				\wc_get_logger()->debug( 'update_apaczka_receiver_from_order: input data is not an array', array( 'source' => 'subscription-apaczka' ) );
			}
			return $data;
		}

		if ( ! isset( $data['receiver'] ) || ! is_array( $data['receiver'] ) ) {
			$data['receiver'] = array();
		}

		// Do not fallback company to parent order for "name", otherwise stale values can override updated customer data.
		$receiver_company    = $this->get_shipping_value_from_sources( 'company', $order, $subscription, null );
		$shipping_first_name = $this->get_shipping_value_from_sources( 'first_name', $order, $subscription, $parent_order );
		$shipping_last_name  = $this->get_shipping_value_from_sources( 'last_name', $order, $subscription, $parent_order );
		$full_name           = trim( $shipping_first_name . ' ' . $shipping_last_name );

		$this->log_order_shipping_data( $order, 'check address data in new order' );
		$this->log_order_shipping_data( $subscription, 'check address data in subscription object (mapping source)' );

		$data['receiver']['country_code']   = $this->get_shipping_value_from_sources( 'country', $order, $subscription, $parent_order );
		$data['receiver']['postal_code']    = $this->get_shipping_value_from_sources( 'postcode', $order, $subscription, $parent_order );
		$data['receiver']['city']           = $this->get_shipping_value_from_sources( 'city', $order, $subscription, $parent_order );
		$data['receiver']['line1']          = $this->get_shipping_value_from_sources( 'address_1', $order, $subscription, $parent_order );
		$data['receiver']['line2']          = $this->get_shipping_value_from_sources( 'address_2', $order, $subscription, $parent_order );
		$data['receiver']['name']         = ! empty( $receiver_company ) ? $receiver_company : $full_name;
		$data['receiver']['contact_person'] = $full_name;

		$data['receiver']['phone'] = $this->get_shipping_value_from_sources( 'phone', $order, $subscription, $parent_order );

		$data['receiver']['email'] = $this->get_shipping_value_from_sources( 'email', $order, $subscription, $parent_order );

		if ( function_exists( 'wc_get_logger' ) ) {
			\wc_get_logger()->debug( 'receiver after base mapping', array( 'source' => 'subscription-apaczka' ) );
			\wc_get_logger()->debug( print_r( $data['receiver'], true ), array( 'source' => 'subscription-apaczka' ) );
		}

		$receiver_address_line_full = '';
		if ( ! empty( $data['receiver']['line1'] ) ) {
			$receiver_address_line_full = trim( $data['receiver']['line1'] );
		}

		if ( ! empty( $data['receiver']['line2'] ) ) {
			$receiver_address_line_2     = trim( $data['receiver']['line2'] );
			$receiver_address_line_full .= ', ' . $receiver_address_line_2;
		}

		$data['receiver']['line1'] = $receiver_address_line_full;
		$data['receiver']['line2'] = '';

		if ( function_exists( 'wc_get_logger' ) ) {
			\wc_get_logger()->debug( 'receiver after line merge', array( 'source' => 'subscription-apaczka' ) );
			\wc_get_logger()->debug( print_r( $data['receiver'], true ), array( 'source' => 'subscription-apaczka' ) );
			\wc_get_logger()->debug( 'update_apaczka_receiver_from_order: end', array( 'source' => 'subscription-apaczka' ) );
		}

		return $data;
	}

	/**
	 * Logs shipping data from an order for debugging.
	 *
	 * @param WC_Order|null $order   Order object.
	 * @param string        $message Log message prefix.
	 * @return void
	 */
	private function log_order_shipping_data( $order, $message ) {
		if ( ! function_exists( 'wc_get_logger' ) ) {
			return;
		}

		if ( ! $order || is_wp_error( $order ) ) {
			\wc_get_logger()->debug( $message . ': order not found', array( 'source' => 'subscription-apaczka' ) );
			return;
		}

		$receiver_company    = $order->get_shipping_company();
		$shipping_first_name = $order->get_shipping_first_name();
		$shipping_last_name  = $order->get_shipping_last_name();

		\wc_get_logger()->debug( $message, array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $receiver_company, true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $shipping_first_name, true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $shipping_last_name, true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $order->get_shipping_country(), true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $order->get_shipping_postcode(), true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $order->get_shipping_city(), true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $order->get_shipping_address_1(), true ), array( 'source' => 'subscription-apaczka' ) );
		\wc_get_logger()->debug( print_r( $order->get_shipping_address_2(), true ), array( 'source' => 'subscription-apaczka' ) );
	}

	/**
	 * Returns shipping field value with source priority:
	 * subscription -> new order -> parent order.
	 *
	 * @param string                $field        Shipping field key.
	 * @param WC_Order              $order        Renewal order.
	 * @param WC_Subscription|null  $subscription Subscription object.
	 * @param WC_Order|null         $parent_order Parent order fallback object.
	 * @return string
	 */
	private function get_shipping_value_from_sources( $field, $order, $subscription = null, $parent_order = null ) {
		$sources = array( $subscription, $order, $parent_order );

		foreach ( $sources as $source ) {
			$value = $this->get_shipping_value_with_fallback( $source, $field );
			if ( '' !== $value ) {
				return $value;
			}
		}

		return '';
	}

	/**
	 * Returns shipping field value using robust fallbacks on one WC object.
	 *
	 * @param WC_Data $object WC order/subscription object.
	 * @param string  $field  Shipping field key.
	 * @return string
	 */
	private function get_shipping_value_with_fallback( $object, $field ) {
		if ( ! $object || is_wp_error( $object ) || ! method_exists( $object, 'get_meta' ) ) {
			return '';
		}

		$object_id    = method_exists( $object, 'get_id' ) ? $object->get_id() : 0;
		$fresh_object = $object;

		if ( $object_id && function_exists( 'wcs_get_subscription' ) && class_exists( 'WC_Subscription' ) && $object instanceof \WC_Subscription ) {
			$fresh_subscription = wcs_get_subscription( $object_id );
			if ( $fresh_subscription && ! is_wp_error( $fresh_subscription ) ) {
				$fresh_object = $fresh_subscription;
			}
		} elseif ( $object_id ) {
			$fresh_order = wc_get_order( $object_id );
			if ( $fresh_order && ! is_wp_error( $fresh_order ) ) {
				$fresh_object = $fresh_order;
			}
		}

		$getter_map = array(
			'company'    => 'get_shipping_company',
			'first_name' => 'get_shipping_first_name',
			'last_name'  => 'get_shipping_last_name',
			'country'    => 'get_shipping_country',
			'postcode'   => 'get_shipping_postcode',
			'city'       => 'get_shipping_city',
			'address_1'  => 'get_shipping_address_1',
			'address_2'  => 'get_shipping_address_2',
			'phone'      => 'get_shipping_phone',
			'email'      => 'get_shipping_email',
		);

		$meta_map = array(
			'company'    => '_shipping_company',
			'first_name' => '_shipping_first_name',
			'last_name'  => '_shipping_last_name',
			'country'    => '_shipping_country',
			'postcode'   => '_shipping_postcode',
			'city'       => '_shipping_city',
			'address_1'  => '_shipping_address_1',
			'address_2'  => '_shipping_address_2',
			'phone'      => '_shipping_phone',
			'email'      => '_shipping_email',
		);

		$value = '';

		if ( isset( $getter_map[ $field ] ) ) {
			$getter = $getter_map[ $field ];
			if ( method_exists( $fresh_object, $getter ) ) {
				$value = (string) $fresh_object->{$getter}();
			}

			if ( '' === trim( $value ) && method_exists( $object, $getter ) ) {
				$value = (string) $object->{$getter}();
			}
		}

		if ( '' === trim( $value ) && isset( $meta_map[ $field ] ) ) {
			$meta_key = $meta_map[ $field ];
			$value    = (string) $fresh_object->get_meta( $meta_key, true );
			if ( '' === trim( $value ) ) {
				$value = (string) $object->get_meta( $meta_key, true );
			}
		}

		if ( '' === trim( $value ) && 'phone' === $field ) {
			if ( method_exists( $fresh_object, 'get_billing_phone' ) ) {
				$value = (string) $fresh_object->get_billing_phone();
			}
			if ( '' === trim( $value ) && method_exists( $object, 'get_billing_phone' ) ) {
				$value = (string) $object->get_billing_phone();
			}
		}

		if ( '' === trim( $value ) && 'email' === $field ) {
			if ( method_exists( $fresh_object, 'get_billing_email' ) ) {
				$value = (string) $fresh_object->get_billing_email();
			}
			if ( '' === trim( $value ) && method_exists( $object, 'get_billing_email' ) ) {
				$value = (string) $object->get_billing_email();
			}
		}

		return is_string( $value ) ? trim( $value ) : '';
	}
}

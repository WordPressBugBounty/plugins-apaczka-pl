<?php
/**
 * Plugin main class.
 *
 * @package Inspire_Labs\Apaczka_Woocommerce
 */

namespace Inspire_Labs\Apaczka_Woocommerce;

use Exception;
use Inspire_Labs\Apaczka_Woocommerce\Plugin\Abstract_Ilabs_Plugin;
use WC_Order;

class Plugin extends Abstract_Ilabs_Plugin {

	const TEXTDOMAIN = 'apaczka-pl';

	const APP_PREFIX = 'apaczka_woocommerce';

	public static $plugin_dir;

	public $shipping_methods = array();

    /**
     * Cached shipping zones \WC_Shipping_Zones::get_zones()
     *
     * @var $cached_zones
     */
    public $cached_zones = array();


	public function init() {
		$this->require_wp_core_file( 'wp-admin/includes/class-wp-filesystem-base.php' );
		$this->require_wp_core_file( 'wp-admin/includes/class-wp-filesystem-direct.php' );

		if ( is_admin() ) {
			$this->init_admin_features();
		}

        add_filter( 'woocommerce_get_order_item_totals', array( $this, 'show_selected_point_data_in_order_details' ), 2, 100 );
	}

	protected function register_request_filters(): array {
		return array();
	}

	protected function before_init() {
	}

	public function plugins_loaded_hooks() {

		$this->shipping_methods['apaczka'] = new Shipping_Method_Apaczka();

		if ( is_admin() ) {
			( new Apaczka_Shipping_Rates() )->init();
			add_filter(
				'woocommerce_shipping_methods',
				array( $this, 'woocommerce_shipping_methods' ),
				20,
				1
			);
		}

		if ( ! is_plugin_active( 'apaczka-pl-mapa-punktow/apaczka-points-map.php' ) ) {
			add_action(
				'woocommerce_init',
				function () {
					$this->shipping_methods['apaczka']->filtering_shipping_fields();
				}
			);
		}
	}


	/**
	 * @param $key
	 *
	 * @return false|mixed|void
	 */
	public static function get_option( $key ) {
		return get_option(
			self::APP_PREFIX
			. '_settings_general' . '_' . $key
		);
	}

	public function woocommerce_shipping_methods( $methods ) {
		$methods[ $this->shipping_methods['apaczka']->id ]
			= get_class( $this->shipping_methods['apaczka'] );

		return $methods;
	}

	private function init_admin_features() {
		add_action( 'woocommerce_settings_saved', array( $this, 'save_post' ) );
		add_filter(
			'woocommerce_get_settings_pages',
			function ( $woocommerce_settings ) {
				new Global_Settings_Integration();

				return $woocommerce_settings;
			}
		);

		( new Ajax() )->init();

		if ( ! class_exists( 'Apaczka_Points_Map\Points_Map_Plugin' ) ) {
			add_action(
				'woocommerce_admin_order_data_after_shipping_address',
				function ( WC_Order $order ) {
					$apaczka_delivery_point = get_post_meta(
						$order->get_id(),
						'apaczka_delivery_point',
						true
					);

					if ( ! empty( $apaczka_delivery_point ) ) {
						echo '<div class="order_data_column"><h4>' . __(
							'Others:',
							'apaczka-pl'
						) . '</h4><p><strong>'
							. __( 'Delivery point', 'apaczka-pl' )
							. ': </strong>'
							. esc_attr( $apaczka_delivery_point['apm_access_point_id'] )
							. ' (' . esc_attr( $apaczka_delivery_point['apm_supplier'] ) . '. ' . esc_attr( $apaczka_delivery_point['apm_name'] ) . ')'
							. '</p></div>';
					}
				},
				100
			);
		}
	}

	public function save_post() {
		update_option( 'apaczka_countries_cache', '' );
	}


	/**
     * Get admin script_id
     *
	 * @return string
	 */
	private function get_admin_script_id(): string {
		return self::APP_PREFIX . '_admin-js';
	}

    /**
     * Get admin css_id
     *
     * @return string
     */
	private function get_admin_css_id(): string {
		return self::APP_PREFIX . '_admin-css';
	}

    /**
     * Get frontend blocks script_id
     *
     * @return string
     */
	public function get_front_blocks_script_id(): string {
		return self::APP_PREFIX . '_front_blocks-js';
	}

    /**
     * Enqueue frontend scripts
     *
     * @return void
     */
	public function enqueue_frontend_scripts() {
		if ( ! class_exists( 'Apaczka_Points_Map\Points_Map_Plugin' ) ) {

            global $wp;
            $thankyou_page          = ! empty( $wp->query_vars['order-received'] ) ? absint( $wp->query_vars['order-received'] ) : false;

			if ( is_checkout() || has_block( 'woocommerce/checkout' ) ) {

                $current_plugin_version = apaczka()->get_plugin_version();

                $bp_css_path = apaczka()->get_plugin_dir() . 'assets/css/bliskapaczka-map.css';
                $bp_css_ver  = file_exists( $bp_css_path ) ? filemtime( $bp_css_path ) : $current_plugin_version;
                wp_enqueue_style(
                    self::APP_PREFIX . '_bliskapaczka_map',
                    $this->get_plugin_css_url() . '/bliskapaczka-map.css',
                    array(),
                    $bp_css_ver
                );

				wp_enqueue_style(
					$this->get_admin_css_id(),
					$this->get_plugin_css_url() . '/front.css'
				);
			}


            if ( ! $thankyou_page && ( is_checkout() || has_block( 'woocommerce/checkout' ) ) ) {
                $lang = $this->get_website_language();
                $map_config = $this->get_map_config();
				$fb_js_path = apaczka()->get_plugin_dir() . 'assets/js/front-blocks.js';
                $fb_js_ver  = file_exists( $fb_js_path ) ? filemtime( $fb_js_path ) : $current_plugin_version;
                wp_enqueue_script(
                    $this->get_front_blocks_script_id(),
                    $this->get_plugin_js_url() . '/front-blocks.js',
					array( 'jquery' ),
                    $fb_js_ver,
                    array( 'in_footer' => true )
                );
                wp_localize_script(
                    $this->get_front_blocks_script_id(),
                    'apaczka_block',
                    array(
                        'button_text1'  => esc_html__( 'Select point', 'apaczka-pl' ),
                        'button_text2'  => esc_html__( 'Change point', 'apaczka-pl' ),
                        'selected_text' => esc_html__( 'Selected Parcel Locker:', 'apaczka-pl' ),
                        'alert_text'    => esc_html__( 'Delivery point must be chosen!', 'apaczka-pl' ),
                        'map_config'    => $map_config,
                    )
                );



                $bp_js_path = apaczka()->get_plugin_dir() . 'assets/js/bliskapaczka-map.js';
                $bp_js_ver  = file_exists( $bp_js_path ) ? filemtime( $bp_js_path ) : $current_plugin_version;
                wp_enqueue_script(
                    self::APP_PREFIX . '_bliskapaczka-map',
                    $this->get_plugin_js_url() . '/bliskapaczka-map.js',
                    array( 'jquery' ),
                    $bp_js_ver,
                    array( 'in_footer' => true )
                );

                $front_js_path = apaczka()->get_plugin_dir() . 'assets/js/frontend.js';
                $front_js_ver  = file_exists( $front_js_path ) ? filemtime( $front_js_path ) : $current_plugin_version;
                wp_enqueue_script(
                    self::APP_PREFIX . '_frontend.js',
                    $this->get_plugin_js_url() . '/frontend.js',
                    array( 'jquery' ),
                    $front_js_ver,
                    array( 'in_footer' => true )
                );
                wp_localize_script(
                    self::APP_PREFIX . '_frontend.js',
                    'apaczka_checkout',
                    array(
                        'map_config' => $this->get_map_config(),
                        'lang'       => $lang,
                    )
                );




            }


		}
	}

	public function enqueue_dashboard_scripts() {

		if ( $this->is_required_pages() ) {

            $current_screen = get_current_screen();
            $current_plugin_version = apaczka()->get_plugin_version();
            $lang = $this->get_website_language();

			wp_enqueue_style(
				$this->get_admin_css_id(),
				$this->get_plugin_css_url() . '/admin.css'
			);

            $bp_css_path = apaczka()->get_plugin_dir() . 'assets/css/bliskapaczka-map.css';
            $bp_css_ver  = file_exists( $bp_css_path ) ? filemtime( $bp_css_path ) : $current_plugin_version;
            wp_enqueue_style(
                self::APP_PREFIX . '_bliskapaczka_map',
                $this->get_plugin_css_url() . '/bliskapaczka-map.css',
                array(),
                $bp_css_ver
            );

			wp_enqueue_script(
				'jquery_maskedinput',
				$this->get_plugin_js_url() . '/jquery.maskedinput.js'
			);

			$admin_js_path  = $this->get_plugin_dir() . 'assets/js/admin.js';
			$admin_js_ver  = file_exists( $admin_js_path ) ? filemtime( $admin_js_path ) : $current_plugin_version;

			if ( is_a( $current_screen, 'WP_Screen' ) && 'woocommerce_page_wc-settings' === $current_screen->id ) {
				if ( isset( $_GET['tab'] ) && 'apaczka_woocommerce_settings_general' === $_GET['tab'] ) {

					wp_enqueue_script(
						$this->get_admin_script_id(),
						$this->get_plugin_js_url() . '/admin.js',
						array( 'jquery' ),
                        $admin_js_ver
					);
                    wp_localize_script(
                        $this->get_admin_script_id(),
                        'apaczka_admin',
                        array(
                            'ajaxurl'           => admin_url( 'admin-ajax.php' ),
                            'nonce'             => wp_create_nonce( 'apaczka_pl_ajax_nonce' ),
                            'lang'              => $lang
                        )
                    );

                    $bp_js_path = apaczka()->get_plugin_dir() . 'assets/js/bliskapaczka-map.js';
                    $bp_js_ver  = file_exists( $bp_js_path ) ? filemtime( $bp_js_path ) : $current_plugin_version;
                    wp_enqueue_script(
                        self::APP_PREFIX . '_bliskapaczka-map.js',
                        $this->get_plugin_js_url() . '/bliskapaczka-map.js',
                        array( 'jquery' ),
                        $bp_js_ver,
                        array( 'in_footer' => true )
                    );
				}


			}

            if ( ( isset( $_GET['page'] ) && 'wc-orders' === $_GET['page'] ) || ( isset( $_GET['post'] ) && isset( $_GET['action'] ) && 'edit' === $_GET['action'] ) ) {


                wp_enqueue_script(
                    'apaczka_pl_order_metabox',
                    $this->get_plugin_js_url() . '/order-metabox.js',
                    array( 'jquery', 'mediaelement', 'wc-admin-order-meta-boxes' ),
                    $admin_js_ver,
                    array( 'in_footer' => true )
                );


                $sender_templates_json  = ( new Sender_Settings_Templates_Helper() )->get_all_templates_json();
                $package_templates_json = ( new Gateway_Settings_Templates_Helper() )->get_all_templates_json();

                wp_localize_script(
                    'apaczka_pl_order_metabox',
                    'apaczka_order_metabox',
                    array(
                        'ajaxurl'                      => admin_url( 'admin-ajax.php' ),
                        'preloader'                    => $this->get_plugin_img_url() . '/animation-round-small.gif',
                        'nonce'                        => wp_create_nonce( 'apaczka_ajax_nonce' ),
                        'sender_templates'             => json_decode( $sender_templates_json, true ),
                        'package_properties_templates' => json_decode( $package_templates_json, true )
                    )
                );


                $bp_js_path = apaczka()->get_plugin_dir() . 'assets/js/bliskapaczka-map.js';
                $bp_js_ver  = file_exists( $bp_js_path ) ? filemtime( $bp_js_path ) : $current_plugin_version;
                wp_enqueue_script(
                    self::APP_PREFIX . '_bliskapaczka-map',
                    $this->get_plugin_js_url() . '/bliskapaczka-map.js',
                    array( 'jquery' ),
                    $bp_js_ver,
                    array( 'in_footer' => true )
                );
            }



            /*$bp_js_path = apaczka()->get_plugin_dir() . 'assets/js/bliskapaczka-map.js';
            $bp_js_ver  = file_exists( $bp_js_path ) ? filemtime( $bp_js_path ) : $current_plugin_version;
            wp_enqueue_script(
                self::APP_PREFIX . '_bliskapaczka-map',
                $this->get_plugin_js_url() . '/bliskapaczka-map.js',
                array( 'jquery' ),
                $bp_js_ver,
                array( 'in_footer' => true )
            );*/

        }
	}

	public function is_required_pages() {
		global $pagenow;

		if ( isset( $_GET['post'] ) && ! empty( $_GET['post'] ) && is_numeric( $_GET['post'] ) ) {
			$post_type = get_post_type( $_GET['post'] );
			if ( 'product' === $post_type ) {
				return false;
			}
		}

		$current_screen = get_current_screen();

		if ( 'post.php' === $pagenow || 'post-new.php' === $pagenow ) {
			return true;
		}

		if ( is_a( $current_screen, 'WP_Screen' ) && 'woocommerce_page_wc-settings' === $current_screen->id ) {
			if ( isset( $_GET['tab'] ) && $_GET['tab'] == 'apaczka_woocommerce_settings_general' ) {
				return true;
			}
		}

		if ( is_a( $current_screen, 'WP_Screen' ) && 'woocommerce_page_wc-orders' === $current_screen->id ) {
			if ( isset( $_GET['id'] ) ) {
				return true;
			}
		}

		return false;
	}


    /**
     * Retrieves and caches shipping zones.
     *
     * @uses WC_Shipping_Zones::get_zones() To fetch shipping zones if not already cached.
     *
     * @return array An array of WooCommerce shipping zones, or an empty array if WC_Shipping_Zones class doesn't exist.
     */
    private function get_cached_zones() {
        $cached_zones = ! empty( $this->cached_zones ) ? $this->cached_zones : null;
        if ( empty( $cached_zones ) ) {
            if ( class_exists( 'WC_Shipping_Zones' ) ) {
                $cached_zones       = \WC_Shipping_Zones::get_zones();
                $this->cached_zones = $cached_zones;
            }
        }
        return $cached_zones;
    }


    /**
     * Clears the cached shipping zones.
     *
     * @return void
     */
    public function clear_zones_cache() {
        $this->cached_zones = null;
    }

    /**
     * Get map config
     *
     * @return array
     */
    public function get_map_config() {

        $config = array();

        $delivery_zones = $this->get_cached_zones();

        $zone_ids = array_keys( array( '' ) + $delivery_zones );

        foreach ( $zone_ids as $zone_id ) {

            $shipping_zone = new \WC_Shipping_Zone( $zone_id );

            $shipping_methods = $shipping_zone->get_shipping_methods( true, 'values' );

            foreach ( $shipping_methods as $instance_id => $shipping_method ) {
                if ( isset( $shipping_method->instance_settings['display_apaczka_map'] ) && 'yes' === $shipping_method->instance_settings['display_apaczka_map'] ) {
                    $map_supplier = $shipping_method->instance_settings['supplier_apaczka_map'];

                    if ( 'ALL' === $map_supplier ) {
                        //$config[ $instance_id ]['geowidget_supplier'] = array( 'DHL_PARCEL', 'DPD', 'INPOST', 'POCZTA', 'UPS', 'PWR' );
                        $config[ $instance_id ]['geowidget_supplier'] = array(
                            'RUCH',
                            'INPOST',
                            'INPOST_INTERNATIONAL',
                            'POCZTA',
                            'DPD',
                            'UPS',
                            'DHL',
                            'GLS',
                            'FEDEX',
                        );
                    } else {
                        $single_carrier                               = $shipping_method->instance_settings['supplier_apaczka_map'];
                        if ( 'DHL_PARCEL' === $single_carrier ) {
                            $single_carrier = 'DHL';
                        } elseif ( 'PWR' === $single_carrier ) {
                            $single_carrier = 'RUCH';
                        }
                        $config[ $instance_id ]['geowidget_supplier'] = array( $single_carrier );
                    }

                    $config[ $instance_id ]['geowidget_only_cod'] = $shipping_method->instance_settings['only_cod_apaczka_map'];
                }
            }
        }

        return $config;
    }


    /**
     * Get website language
     *
     * @return string
     */
    public function get_website_language() {

        $lang = '';

        // Check for WPML.
        if ( class_exists( 'SitePress' ) ) {
            $lang = apply_filters( 'wpml_current_language', null );
            return $lang;
        }

        // Check for Polylang.
        if ( function_exists( 'pll_current_language' ) ) {
            $lang = pll_current_language();
            return $lang;
        }

        // Standard WordPress (no multilingual plugin).
        $locale = get_locale();
        $lang   = substr( $locale, 0, 2 );

        return $lang;
    }


    /**
     * Show parcel machine in order details
     *
     * @param array    $items $items.
     *
     * @param WC_Order $order $order.
     *
     * @return array
     */
    public function show_selected_point_data_in_order_details( $items, $order ) {

        static $details_shown = false;

        $locker_data = $order->get_meta( 'apaczka_delivery_point' );
        if ( empty( $locker_data ) ) {
            return $items;
        }

        if ( ! $details_shown ) {
            $locker_id       = ! empty( $locker_data['apm_access_point_id'] ) ? $locker_data['apm_access_point_id'] : '';
            $locker_operator = ! empty( $locker_data['apm_supplier'] ) ? $locker_data['apm_supplier'] : '';
            if ( ! empty( $locker_operator ) ) {
                if( 'RUCH' === $locker_operator ) {
                    $locker_operator = 'ORLEN PACZKA';
                }
                $locker_id = esc_html( $locker_operator ) . ': ' . esc_attr( $locker_id );
            }

            $locker_desc        = '';
            $locker_name        = ! empty( $locker_data['apm_name'] ) ? $locker_data['apm_name'] : '';
            $locker_street      = ! empty( $locker_data['apm_street'] ) ? $locker_data['apm_street'] : '';
            $locker_postal_code = ! empty( $locker_data['apm_postal_code'] ) ? $locker_data['apm_postal_code'] : '';
            $locker_city        = ! empty( $locker_data['apm_city'] ) ? $locker_data['apm_city'] : '';

            $locker_desc .= $locker_name . '<br>' . $locker_street . '<br>' . $locker_postal_code . ' ' . $locker_city;

            $shipping_method_id          = '';
            $shipping_method_instance_id = '';

            foreach ( $order->get_items( 'shipping' ) as $item_id => $item ) {
                $shipping_method_id          = $item->get_method_id();
                $shipping_method_instance_id = $item->get_instance_id();
            }

            $items['shipping']['value']
                .= sprintf(
                '<br>%1s:<br><span class="apaczka-pl-chosen-locker-point point">%1s</span><br><span class="apaczka-pl-chosen-locker-point description">%3s</span>',
                esc_html__( 'Selected point', 'apaczka-pl' ),
                esc_attr( $locker_id ),
                $locker_desc
            );

            $details_shown = true;
        }

        return $items;
    }

}

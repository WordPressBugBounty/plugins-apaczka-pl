<?php

namespace Inspire_Labs\Apaczka_Woocommerce;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Global_Settings
 */
class Global_Settings {


    /**
     * Get API settings
     *
     * @return array
     */
    public function get_api_settings(): array {
        return array(
            array(
                'title'       => esc_html__( 'API settings', 'apaczka-pl' ),
                'type'        => 'title',
                'description' => '',
                'id'          => 'api_settings',
            ),

            array(
                'title'    => esc_html__( 'App ID', 'apaczka-pl' ),
                'id'       => $this->get_setting_id( 'app_id' ),
                'css'      => '',
                'default'  => '',
                'type'     => 'text',
                'desc_tip' => false,
                'class'    => '',
            ),

            array(

                'title'       => esc_html__( 'App Secret', 'apaczka-pl' ),
                'id'          => $this->get_setting_id( 'app_secret' ),
                'type'        => 'password',
                'description' => esc_html__( 'App Secret', 'apaczka-pl' ),
                'default'     => '',
                'desc_tip'    => true,
            ),

            array(
                'id'   => 'api_settings',
                'type' => 'sectionend',
            ),
        );
    }


    /**
     * Get sender settings
     *
     * @return array
     */
    public function get_sender_settings(): array {
        return array(
            array(
                'title'       => esc_html__( 'Sender details', 'apaczka-pl' ),
                'id'          => 'sender_details',
                'type'        => 'title',
                'description' => '',
            ),
            array(
                'title'       => esc_html__( 'Address type', 'apaczka-pl' ),
                'id'          => $this->get_setting_id( 'sender_is_residential' ),
                'type'        => 'select',
                'description' => '',
                'default'     => 'company',
                'desc_tip'    => true,
                'options'     => array(
                    '0' => esc_html__( 'Company', 'apaczka-pl' ),
                    '1' => esc_html__( 'Private', 'apaczka-pl' ),
                ),
            ),
            array(

                'title'             => esc_html__( 'Company name', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_company_name' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '50',
                ),
            ),
            array(

                'title'             => esc_html__( 'First Name', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_first_name' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '50',
                ),
            ),
            array(

                'title'             => esc_html__( 'Last name', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_last_name' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '50',
                ),
            ),
            array(
                'title'             => esc_html__( 'Street', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_street' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '50',
                ),

            ),
            array(
                'title'             => esc_html__( 'Building number', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_building_number' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '10',
                ),

            ),
            array(
                'title'             => esc_html__( 'Apartment number', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_apartment_number' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '10',
                ),

            ),

            array(
                'title'             => esc_html__( 'Postal code', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_postal_code' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                ),

            ),
            array(
                'title'             => esc_html__( 'City', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_city' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '50',
                ),

            ),
            array(
                'title'             => esc_html__( 'Contact person', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_contact_person' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                    'maxlength' => '50',
                ),

            ),
            array(
                'title'             => esc_html__( 'Phone', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_phone' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                ),
            ),
            array(
                'title'             => esc_html__( 'E-mail', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_email' ),
                'type'              => 'email',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required_' => '',
                ),
            ),
            array(
                'title'             => esc_html__( 'Bank account number', 'apaczka-pl' ),
                'id'                => $this->get_setting_id( 'sender_bank_account_number' ),
                'type'              => 'text',
                'description'       => '',
                'default'           => '',
                'desc_tip'          => true,
                'custom_attributes' => array(
                    'required' => 'true',
                ),
                'ok'                => 'ok',
            ),

            array(
                'title'       => esc_html__( 'Create new sender template?', 'apaczka-pl' ),
                'id'          => $this->get_setting_id( 'create_sender_template' ),
                'type'        => 'select',
                'description' => '',
                'default'     => 'no',
                'desc_tip'    => true,
                'options'     => array(
                    'no'  => esc_html__( 'No', 'apaczka-pl' ),
                    'yes' => esc_html__( 'Yes', 'apaczka-pl' ),
                ),
            ),

            array(
                'title'       => esc_html__( 'New sender template name', 'apaczka-pl' ),
                'id'          => $this->get_setting_id( 'new_sender_template_name' ),
                'type'        => 'text',
                'description' => '',
                'default'     => '',
                'value'       => '',
                'desc_tip'    => true,
            ),

            array(
                'title'       => esc_html__( 'Choose sender template to load', 'apaczka-pl' ),
                'id'          => $this->get_setting_id( 'select_sender_template' ),
                'type'        => 'select',
                'description' => '',
                'default'     => '',
                'desc_tip'    => true,
                'options'     => ( new Sender_Settings_Templates_Helper() )->get_all_templates_list(),

            ),

            array(
                'id'   => 'sender_details',
                'type' => 'sectionend',
            ),

        );
    }

    /**
     * Get parcel settings
     *
     * @return array
     */
    public function get_parcel_settings(): array {
        $options_hours = array();
        for ( $h = 9; $h < 20; $h++ ) {
            $options_hours[ $h . ':00' ] = $h . ':00';
            if ( $h < 19 ) {
                $options_hours[ $h . ':30' ] = $h . ':30';
            }
        }

        return array(

            array(
                'title'       => esc_html__( 'Default shipping settings', 'apaczka-pl' ),
                'type'        => 'title',
                'id'          => 'default_shipping_settings',

                'description' => '',
            ),


            array(
                'id'                       => $this->get_setting_id( 'service' ),
                'title'                    => esc_html__(
                    'Default service',
                    'apaczka-pl'
                ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'options'                  => self::get_services_verified(),
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'shipping_method' ),
                'title'                    => esc_html__( 'Default way to send a parcel', 'apaczka-pl' ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'options'                  => array(
                    'POINT'   => esc_html__( 'Shipment directly at the point', 'apaczka-pl' ),
                    'COURIER' => esc_html__( 'Courier pickup request', 'apaczka-pl' ),
                    'SELF'    => esc_html__( 'Pickup self', 'apaczka-pl' ),
                ),
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'parcel_type' ),
                'title'                    => esc_html__( 'Parcel type', 'apaczka-pl' ),
                'type'                     => 'select',
                'desc_tip'                 => '',
                'options'                  => array(
                    'box'             => esc_html__( 'Box', 'apaczka-pl' ),
                    'europalette'     => esc_html__( 'Europalette', 'apaczka-pl' ),
                    'palette_60x80'   => esc_html__( 'Palette 60x80', 'apaczka-pl' ),
                    'palette_120x100' => esc_html__( 'Palette 120x100', 'apaczka-pl' ),
                    'palette_120x120' => esc_html__( 'Palette 120x120', 'apaczka-pl' ),
                ),
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'is_nstd' ),
                'title'                    => esc_html__( 'Non standard package', 'apaczka-pl' ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => 'no',
                'desc_tip'                 => true,
                'options'                  => array(
                    'yes' => esc_html__( 'Yes', 'apaczka-pl' ),
                    'no'  => esc_html__( 'No', 'apaczka-pl' ),
                ),
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'package_width' ),
                'title'                    => esc_html__( 'Package length [cm]', 'apaczka-pl' ),
                'type'                     => 'number',
                'description'              => esc_html__( 'Package length [cm].', 'apaczka-pl' ),
                'default'                  => '',
                'desc_tip'                 => true,
                'custom_attributes'        => array(
                    'min'      => 0,
                    'max'      => 10000,
                    'step'     => 1,
                    'required' => 'required',
                ),
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => $this->get_setting_id( 'package_depth' ),
                'title'                    => esc_html__( 'Package width [cm]', 'apaczka-pl' ),
                'type'                     => 'number',
                'description'              => esc_html__( 'Package width [cm].', 'apaczka-pl' ),
                'default'                  => '',
                'desc_tip'                 => true,
                'custom_attributes'        => array(
                    'min'      => 0,
                    'max'      => 10000,
                    'step'     => 1,
                    'required' => 'required',
                ),
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => $this->get_setting_id( 'package_height' ),
                'title'                    => esc_html__( 'Package height [cm]', 'apaczka-pl' ),
                'type'                     => 'number',
                'description'              => esc_html__( 'Package height [cm].', 'apaczka-pl' ),
                'default'                  => '',
                'desc_tip'                 => true,
                'custom_attributes'        => array(
                    'min'      => 0,
                    'max'      => 10000,
                    'step'     => 1,
                    'required' => 'required',
                ),
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => $this->get_setting_id( 'package_weight' ),
                'title'                    => esc_html__( 'Package weight [kg]', 'apaczka-pl' ),
                'type'                     => 'number',
                'description'              => esc_html__( 'Package weight [kg].', 'apaczka-pl' ),
                'default'                  => '',
                'desc_tip'                 => true,
                'custom_attributes'        => array(
                    'min'      => 0,
                    'max'      => 10000,
                    'step'     => 'any',
                    'required' => 'required',
                ),
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'package_contents' ),
                'title'                    => esc_html__( 'Default package contents', 'apaczka-pl' ),
                'type'                     => 'text',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'declared_content' ),
                'title'                    => esc_html__( 'Declared value', 'apaczka-pl' ),
                'type'                     => 'text',
                'label'                    => '',
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'declared_content_auto' ),
                'title'                    => esc_html__( 'Automatically complete the "Declaration of value" with the value of the order', 'apaczka-pl' ),
                'type'                     => 'checkbox',
                'label'                    => '',
                'default'                  => 'yes',
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'set_order_status_completed' ),
                'title'                    => esc_html__( 'Change order status to Completed after shipment created?', 'apaczka-pl' ),
                'type'                     => 'checkbox',
                'label'                    => '',
                'default'                  => 'no',
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'pickup_hour_from' ),
                'title'                    => esc_html__( 'Pickup hour from', 'apaczka-pl' ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'options'                  => $options_hours,
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => $this->get_setting_id( 'pickup_hour_to' ),
                'title'                    => esc_html__( 'Pickup hour to', 'apaczka-pl' ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'options'                  => $options_hours,
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'dispath_point_inpost' ),
                'title'                    => esc_html__( 'Default dispatch point (InPost)', 'apaczka-pl' ),
                'type'                     => 'text',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'dispath_point_kurier48' ),
                'title'                    => esc_html__( 'Default dispatch point (Kurier48)', 'apaczka-pl' ),
                'type'                     => 'text',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => $this->get_setting_id( 'dispath_point_ups' ),
                'title'                    => esc_html__( 'Default dispatch point (UPS)', 'apaczka-pl' ),
                'type'                     => 'text',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => $this->get_setting_id( 'dispath_point_dpd' ),
                'title'                    => esc_html__( 'Default dispatch point DPD', 'apaczka-pl' ),
                'type'                     => 'text',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'visible_on_order_details' => true,
            ),

            array(
                'id'                       => $this->get_setting_id( 'create_package_template' ),
                'title'                    => esc_html__( 'Create new template from this settings?', 'apaczka-pl' ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => 'no',
                'desc_tip'                 => true,
                'options'                  => array(
                    'no'  => esc_html__( 'No', 'apaczka-pl' ),
                    'yes' => esc_html__( 'Yes', 'apaczka-pl' ),
                ),
                'visible_on_order_details' => false,
            ),

            array(
                'id'                       => $this->get_setting_id( 'new_package_template_name' ),
                'title'                    => esc_html__( 'New template name', 'apaczka-pl' ),
                'type'                     => 'text',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'visible_on_order_details' => false,
            ),

            array(
                'id'                       => $this->get_setting_id( 'select_package_template' ),
                'title'                    => esc_html__( 'Choose template to load', 'apaczka-pl' ),
                'type'                     => 'select',
                'description'              => '',
                'default'                  => '',
                'desc_tip'                 => true,
                'options'                  => ( new Gateway_Settings_Templates_Helper() )->get_all_templates_list(),
                'visible_on_order_details' => true,
            ),
            array(
                'id'                       => 'load_from_template',
                'name'                     => '',
                'title'                    => '',
                'type'                     => 'load_from_template',
                'visible_on_order_details' => true,
            ),

            array(
                'id'   => 'default_shipping_settings',
                'type' => 'sectionend',
            )

        );
    }


    /**
     * Generates a setting ID from a key.
     *
     * @param string $key The setting key.
     * @return string The full setting ID.
     *
     * @since 1.0.0
     * @access public
     */
    public function get_setting_id( $key ): string {
        return Plugin::APP_PREFIX . '_settings_general_' . $key;
    }


    /**
     * Gets the current sender configuration from settings.
     *
     * @return array The sender configuration array.
     *
     * @since 1.0.0
     * @access public
     */
    public function get_current_sender_config(): array {
        $sender_config = array();

        $settings       = $this->get_sender_settings();
        $detect_section = Plugin::APP_PREFIX . '_settings_general_sender_';

        foreach ( $settings as $setting ) {
            if ( ! isset( $setting['id'] ) ) {
                continue;
            }
            if ( strpos( $setting['id'], $detect_section ) === 0 ) {
                $sender_config[ str_replace(
                    $this->get_setting_id( 'sender_' ),
                    '',
                    $setting['id']
                ) ] = get_option( $setting['id'] );
            }
        }

        return $sender_config;
    }

    /**
     * Gets the name of the currently selected sender template.
     *
     * @return string The template name or empty string if none selected.
     *
     * @since 1.0.0
     * @access public
     */
    public function get_current_sender_template_name(): string {
        $current_sender_template_name = get_option(
            $this->get_setting_id( 'select_sender_template' )
        );

        return ! empty( $current_sender_template_name )
            ? $current_sender_template_name : '';
    }

    /**
     * Gets the name of the currently selected parcel template.
     *
     * @return string The template name or empty string if none selected.
     *
     * @since 1.0.0
     * @access public
     */
    public function get_current_parcel_template_name(): string {
        $current_parcel_template_name = get_option(
            $this->get_setting_id( 'select_package_template' )
        );

        return ! empty( $current_parcel_template_name )
            ? $current_parcel_template_name : '';
    }


    /**
     * Gets available shipping services nice names.
     *
     * @return array Array of services with service IDs as keys and names as values.
     *
     * @since 1.3.8
     * @access private static
     */
    private static function get_services_verified(): array {
        $return   = array();
        $services = ( new Service_Structure_Helper() )->get_services();
        if ( ! is_array( $services ) ) {
            return array();
        }

        foreach ( $services as $service ) {

            $visible_name = '';

            if( property_exists( $service, 'domestic' ) && property_exists( $service, 'name' ) ) {

                $visible_name = $service->name;

                if ( '0' === $service->domestic ) {
                    if (false === strpos( strtolower( $service->name ), 'zagranica' )
                        &&
                        false === strpos( strtolower( $service->name ), 'international' ) ) {
                        $visible_name .= ' ' . esc_html__('International','apaczka-pl');
                    }
                }
            }

            $return [ $service->service_id ] = $visible_name;
        }

        return $return;
    }


    /**
     * Get API settings
     *
     * @return array
     */
    public function get_help_settings(): array {
        return array(
            array(
                'id'    => 'help_settings',
                'visible_on_order_details' => false,
                'title' => esc_html__( 'Help', 'apaczka-pl' ),
                'type'  => 'title',
                'desc'  => '<b>' . esc_html__( 'Support Apaczka:', 'apaczka-pl' ) . '</b><br>'
                           . '<b>' . esc_html__( 'In case of questions/problems related to the plugin, please contact us via the ', 'apaczka-pl' ) . '</b>'
                           . '<a href="https://panel.apaczka.pl/formularz-kontaktowy" target="_blank">'
                           . esc_html__( 'Contact form', 'apaczka-pl' ) . '</a><br>'
                           . esc_html__( 'Probably you can find some logs ', 'apaczka-pl' )
                           . '<a href=" ' . esc_url( apaczka()->get_woocommerce_logs_section_url() ) . ' " target="_blank">'
                           . esc_html__( 'here', 'apaczka-pl' ) . '</a><br>'
            ),

            array(
                'id'   => 'help_settings',
                'type' => 'sectionend',
            ),
        );
    }


    public function get_debug_settings()
    {
        return array(

            array(
                'title'       => '',
                'type'        => 'title',
                'id'          => 'debug_settings',
                'description' => '',
            ),

            array(
                'id'                       => $this->get_setting_id( 'apaczka_map_debug_mode' ),
                'title'                    => esc_html__( 'An alternative way to show the map button', 'apaczka-pl' ),
                'type'                     => 'checkbox',
                'label'                    => '',
                'default'                  => 'no',
                'visible_on_order_details' => false,
            ),

            array(
                'id'                       => $this->get_setting_id( 'apaczka_debug_mode' ),
                'title'                    => esc_html__( 'Log API requests to a log file', 'apaczka-pl' ),
                'type'                     => 'checkbox',
                'label'                    => '',
                'default'                  => 'no',
                'visible_on_order_details' => false,
            ),

            array(
                'id'   => 'debug_settings',
                'type' => 'sectionend',
            )
        );

    }
}

<?php
/**
 * @var WC_ORDER $order
 * @var array $apaczka_wc_order_data
 * @var array $sender_templates
 * @var array $sender_templates_json
 * @var array $package_properties_templates
 * @var array $package_properties_templates_json
 * @var array $package_properties_services
 * @var array $package_properties_parcel_types
 * @var array $package_properties_shipping_methods
 * @var array $package_properties_hours
 * @var bool $package_send
 * @var bool $apaczka_delivery_point
 */

use Inspire_Labs\Apaczka_Woocommerce\Global_Settings;
use Inspire_Labs\Apaczka_Woocommerce\Plugin;
use Inspire_Labs\Apaczka_Woocommerce\Service_Structure_Helper; ?>

<?php
$custom_attributes = array();
if ($package_send) {
    $custom_attributes['disabled'] = 'disabled';
}

$id = 'gateway';
?>

<?php if ( ! $package_send) : ?>

    <div id="apaczka_panel_sender"
         class="panel woocommerce_options_panel apaczka_panel">

        <h4>
            <?php _e('Sender', 'apaczka-pl'); ?>
        </h4>

        <div class="options_group">
            <div class="apaczka-sender-template-wrapper">
                <?php
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }
                if ( ! $package_send) :
                    woocommerce_wp_select(
                        array(
                            'id'                => '_apaczka[sender_template]',
                            'label'             => __(
                                'Sender template',
                                'apaczka-pl'
                            ),
                            'desc_tip'          => false,
                            'type'              => 'number',
                            'options'           => $sender_templates,
                            'value'             => '',
                            'custom_attributes' => array('data-raw-id' => 'test'),
                        )
                    );
                    ?>


                    <button id="apaczka_load_sender_settings_btn"
                            class='apaczka_load_sender_settings_btn'>
                        <?php
                        _e(
                            'Get sender data from selected template',
                            'apaczka-pl'
                        )
                        ?>
                    </button>
                <?php endif; ?>
            </div>
            <?php
            $key                           = 'is_residential';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Address type',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'options'           => array(
                        '0' => __('Company', 'apaczka-pl'),
                        '1' => __('Private', 'apaczka-pl'),
                    ),
                    'value'             => isset($apaczka_wc_order_data['sender'][$key])
                        ? $apaczka_wc_order_data['sender'][$key]
                        : '0',
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'company_name';
            $custom_attributes             = array('maxlength' => '50');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Company name',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'first_name';
            $custom_attributes             = array('maxlength' => '50');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'First name',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'last_name';
            $custom_attributes             = array('maxlength' => '50');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Last name',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'street';
            $custom_attributes             = array('maxlength' => '50');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __('Street', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'building_number';
            $custom_attributes             = array('maxlength' => '10');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Building number',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'apartment_number';
            $custom_attributes             = array('maxlength' => '10');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Apartment number',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'postal_code';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Postal code',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'city';
            $custom_attributes             = array('maxlength' => '50');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __('City', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'contact_person';
            $custom_attributes             = array('maxlength' => '50');
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Contact person',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'phone';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __('Phone', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'email';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __('E-mail', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'email',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'bank_account_number';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[sender][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Bank account number',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['sender'][$key],
                )
            );
            ?>

            <input type="hidden"
                   data-key="foreign_address_id"
                   id="_apaczka[sender][apm_foreign_access_point_id]"
                   name="_apaczka[sender][apm_foreign_access_point_id]"/>

        </div>


    </div>


    <div id="apaczka_panel_receiver"
         class="panel woocommerce_options_panel apaczka_panel">
        <h4>
            <?php _e('Receiver', 'apaczka-pl'); ?>
        </h4>

        <div class="options_group">

            <?php
            $key                           = 'is_residential';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Address type',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'options'           => array(
                        '0' => __('Company', 'apaczka-pl'),
                        '1' => __('Private', 'apaczka-pl'),
                    ),
                    'value'             => '0',
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'country_code';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __('Country', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('Country', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            /*
            $key                           = 'company_name';
            $custom_attributes             = ['maxlength' => '50'];
            $custom_attributes['data-key'] = $key;
            if ( $package_send ) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input( [
                'id'                => sprintf( '_apaczka[receiver][%s]',
                    $key ),
                'label'             => __( 'Company name', 'apaczka-pl' ),
                'desc_tip'          => false,
                'type'              => 'text',
                'custom_attributes' => $custom_attributes,
                'data_type'         => 'text',
                'value'             => isset($apaczka_wc_order_data['receiver'][ $key ])
                    ? $apaczka_wc_order_data['receiver'][ $key ]
                    : $order->get_billing_company(),
                'placeholder'       => __( 'Company name', 'apaczka-pl' ),
            ] );
            */
            ?>

            <?php
            $key                           = 'name';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => ! empty($order->get_billing_company()) || ! empty($order->get_shipping_company())
                        ? __('Company name', 'apaczka-pl')
                        : __('First name', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => ! empty($order->get_shipping_company()) ? $order->get_shipping_company() : $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => ! empty($order->get_billing_company()) || ! empty($order->get_shipping_company())
                        ? __('Company name', 'apaczka-pl')
                        : __('First name', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'line1';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Address line 1',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('Address line 1', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'line2';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Address line 2',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('Address line 2', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'postal_code';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __('Postcode', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('Postcode', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'city';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __('City', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('City', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'contact_person';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            // $contact_person = $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name();

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Contact person',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('Contact person', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'phone';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __('Phone', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('Phone', 'apaczka-pl'),
                )
            );
            ?>

            <?php
            $key                           = 'email';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[receiver][%s]',
                        $key
                    ),
                    'label'             => __('E-mail', 'apaczka-pl'),
                    'desc_tip'          => false,
                    'type'              => 'email',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['receiver'][$key],
                    'placeholder'       => __('E-mail', 'apaczka-pl'),
                )
            );
            ?>

        </div>
    </div>

    <div id="apaczka_panel_properties"
         class="panel woocommerce_options_panel apaczka_panel">

        <h4>
            <?php _e('Package properties', 'apaczka-pl'); ?>
        </h4>

        <div class="options_group">

            <div class="apaczka-sender-template-wrapper">
                <?php
                $selected_template_in_settings = get_option((new Global_Settings())->get_setting_id('select_package_template'));

                $key                           = 'selected_template';
                $custom_attributes             = array();
                $custom_attributes['data-key'] = $key;
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }
                woocommerce_wp_select(
                    array(
                        'id'                => sprintf(
                            '_apaczka[package_properties][%s]',
                            $key
                        ),
                        'label'             => __(
                            'Package properties template',
                            'apaczka-pl'
                        ),
                        'desc_tip'          => false,
                        'options'           => $package_properties_templates,
                        'value'             => $selected_template_in_settings,
                        'custom_attributes' => $custom_attributes,
                    )
                );
                ?>

                <?php if ( ! $package_send) : ?>

                    <button id="apaczka_load_package_properties_settings_btn"
                            class='apaczka_load_package_properties_settings_btn'>
                        <?php
                        _e(
                            'Get data from selected template',
                            'apaczka-pl'
                        )
                        ?>
                    </button>
                <?php endif; ?>

            </div>

            <?php
            $key                           = 'parcel_type';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Parcel type',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'options'           => $package_properties_parcel_types,
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'is_nstd';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Non standard package',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'options'           => array(
                        'yes' => __('Tak', 'apaczka-pl'),
                        'no'  => __('Nie', 'apaczka-pl'),
                    ),
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'package_width';
            $custom_attributes['min']      = 0;
            $custom_attributes['max']      = 10000;
            $custom_attributes['step']     = 1;
            $custom_attributes['required'] = 0;
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Package width',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'package_depth';
            $custom_attributes             = array();
            $custom_attributes['min']      = 0;
            $custom_attributes['max']      = 10000;
            $custom_attributes['step']     = 1;
            $custom_attributes['required'] = 0;
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Package depth',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'package_height';
            $custom_attributes             = array();
            $custom_attributes['min']      = 0;
            $custom_attributes['max']      = 10000;
            $custom_attributes['step']     = 1;
            $custom_attributes['required'] = 0;
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Package height',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'package_weight';
            $custom_attributes             = array();
            $custom_attributes['min']      = 0;
            $custom_attributes['max']      = 10000;
            $custom_attributes['step']     = 1;
            $custom_attributes['required'] = 0;
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Package weight',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'package_contents';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Package contents',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'text',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                )
            );
            ?>

            <?php
            $key                           = 'cod_amount';
            $custom_attributes             = array();
            $custom_attributes['min']      = 0;
            $custom_attributes['max']      = 10000;
            $custom_attributes['step']     = 'any';
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[additional_options][%s]',
                        $key
                    ),
                    'label'             => __(
                        'COD amount',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'custom_attributes' => $custom_attributes,
                    'data_type'         => 'text',
                    'value'             => $apaczka_wc_order_data['additional_options'][$key],
                )
            );
            ?>


            <?php
            $key                           = 'declared_content';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'label'             => __(
                        'Declared value',
                        'apaczka-pl'
                    ),
                    'custom_attributes' => $custom_attributes,
                    'class'             => '',
                )
            );
            ?>

            <?php
            $key                           = 'comment';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[additional_options][%s]',
                        $key
                    ),
                    'value'             => $apaczka_wc_order_data['additional_options'][$key] ?? '',
                    'label'             => __(
                        'Comment',
                        'apaczka-pl'
                    ),
                    'custom_attributes' => $custom_attributes,
                    'class'             => '',
                )
            );
            ?>

            <?php
            $key                           = 'shipping_method';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            $shipping_method_from_settings = get_option((new Global_Settings())->get_setting_id('shipping_method'));
            $selected_value                = '';
            if (isset($apaczka_wc_order_data['package_properties'][$key])
                && ! empty($apaczka_wc_order_data['package_properties'][$key])) {
                $selected_value = $apaczka_wc_order_data['package_properties'][$key];
            } else {
                $selected_value = $shipping_method_from_settings;
            }

            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Shipping method',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'options'           => $package_properties_shipping_methods,
                    'value'             => $selected_value,
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>


            <?php
            $key                           = 'pickup_hour_from';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Pickup hour from',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'options'           => $package_properties_hours,
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'pickup_hour_to';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }
            woocommerce_wp_select(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Pickup hour to',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'number',
                    'options'           => $package_properties_hours,
                    'value'             => $apaczka_wc_order_data['package_properties'][$key],
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

            <?php
            $key                           = 'pickup_date';
            $custom_attributes             = array();
            $custom_attributes['data-key'] = $key;
            if ($package_send) {
                $custom_attributes['disabled'] = 'disabled';
            }

            $pickup_date = ! empty($apaczka_wc_order_data['package_properties'][$key]) ? $apaczka_wc_order_data['package_properties'][$key] : null;
            if ($pickup_date && strtotime($pickup_date) !== false) {
                if (strtotime($pickup_date) < strtotime('today')) {
                    $new_date    = date('Y-m-d');
                    $pickup_date = $new_date;
                }
            } else {
                $pickup_date = date('Y-m-d');
            }

            woocommerce_wp_text_input(
                array(
                    'id'                => sprintf(
                        '_apaczka[package_properties][%s]',
                        $key
                    ),
                    'label'             => __(
                        'Pickup date',
                        'apaczka-pl'
                    ),
                    'desc_tip'          => false,
                    'type'              => 'date',
                    'value'             => $pickup_date,
                    'custom_attributes' => $custom_attributes,
                )
            );
            ?>

        </div>


    </div>

<?php endif ?>

<div class="panel woocommerce_options_panel apaczka_panel">
    <?php if ($package_send == false) : ?>
        <div class="apaczka-actions-wrapper">
            <div class="options_panel-button-wrapper">
                <button class="button-primary apaczka_calculate_price"
                        id="apaczka_calculate_price_btn">
                    <?php
                    _e(
                        'Calculate price',
                        'apaczka-pl'
                    );
                    ?>
                </button>
            </div>
            <span style="float:none;"
                  class="spinner spinner_calculate"></span>
            <div style="padding-top:5px"></div>

            <div id="apaczka-calculate-wrapper"></div>

            <div id="deliver_to_any_shipping_point" style="display:none">
                <p>
                    <?php echo __('Deliver the shipment to any shipping point of the selected carrier',
                        'apaczka-pl'); ?>
                </p>
            </div>

            <div class="apaczka-hidden" id="dispath_point_inpost_wrapper">
                <?php
                $key                           = 'dispath_point_inpost';
                $custom_attributes             = array();
                $custom_attributes['data-key'] = $key;
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }

                woocommerce_wp_text_input(
                    array(
                        'id'                => sprintf(
                            '_apaczka[package_properties][%s]',
                            $key
                        ),
                        'label'             => __(
                            'Dispath point',
                            'apaczka-pl'
                        ),
                        'desc_tip'          => false,
                        'type'              => 'text',
                        'custom_attributes' => $custom_attributes,
                        'data_type'         => 'text',
                        // 'value'             => $apaczka_wc_order_data['package_properties'][ $key ],
                        'value'             => get_option('apaczka_woocommerce_settings_general_dispath_point_inpost'),
                        'placeholder'       => __('Dispath point', 'apaczka-pl'),
                    )
                );
                ?>
            </div>

            <div class="apaczka-hidden" id="dispath_point_kurier48_wrapper">
                <?php
                $key                           = 'dispath_point_kurier48';
                $custom_attributes             = array();
                $custom_attributes['data-key'] = $key;
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }

                woocommerce_wp_text_input(
                    array(
                        'id'                => sprintf(
                            '_apaczka[package_properties][%s]',
                            $key
                        ),
                        'label'             => __(
                            'Dispath point',
                            'apaczka-pl'
                        ),
                        'desc_tip'          => false,
                        'type'              => 'text',
                        'custom_attributes' => $custom_attributes,
                        'data_type'         => 'text',
                        // 'value'             => $apaczka_wc_order_data['package_properties'][ $key ],
                        'value'             => get_option('apaczka_woocommerce_settings_general_dispath_point_kurier48'),
                        'placeholder'       => __('Dispath point', 'apaczka-pl'),
                    )
                );
                ?>
            </div>
            <div class="apaczka-hidden" id="dispath_point_ups_wrapper">
                <?php
                $key                           = 'dispath_point_ups';
                $custom_attributes             = array();
                $custom_attributes['data-key'] = $key;
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }

                woocommerce_wp_text_input(
                    array(
                        'id'                => sprintf(
                            '_apaczka[package_properties][%s]',
                            $key
                        ),
                        'label'             => __(
                            'Dispath point',
                            'apaczka-pl'
                        ),
                        'desc_tip'          => false,
                        'type'              => 'text',
                        'custom_attributes' => $custom_attributes,
                        'data_type'         => 'text',
                        // 'value'             => $apaczka_wc_order_data['package_properties'][ $key ],
                        'value'             => get_option('apaczka_woocommerce_settings_general_dispath_point_ups'),
                        'placeholder'       => __('Dispath point', 'apaczka-pl'),
                    )
                );

                ?>
            </div>

            <div class="apaczka-hidden" id="dispath_point_dpd_wrapper">
                <?php
                $key                           = 'dispath_point_dpd';
                $custom_attributes             = array();
                $custom_attributes['data-key'] = $key;
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }

                woocommerce_wp_text_input(
                    array(
                        'id'                => '_apaczka_dispath_point_dpd',
                        'label'             => __(
                            'Dispath point',
                            'apaczka-pl'
                        ),
                        'desc_tip'          => false,
                        'type'              => 'text',
                        'custom_attributes' => $custom_attributes,
                        'data_type'         => 'text',
                        'value'             => get_option('apaczka_woocommerce_settings_general_dispath_point_dpd'),
                        'placeholder'       => __('Dispath point', 'apaczka-pl'),
                    )
                );
                ?>
            </div>


            <div class="apaczka-hidden" id="apaczka_delivery_point_id_wrapper">
                <?php
                $key                           = 'delivery_point_id';
                $custom_attributes             = array();
                $custom_attributes['data-key'] = $key;
                if ($package_send) {
                    $custom_attributes['disabled'] = 'disabled';
                }

                woocommerce_wp_text_input(
                    array(
                        'id'                => sprintf(
                            '_apaczka[delivery_point_id]',
                            $key
                        ),
                        'label'             => __(
                            'Delivery point id',
                            'apaczka-pl'
                        ),
                        'desc_tip'          => false,
                        'type'              => 'text',
                        'custom_attributes' => $custom_attributes,
                        'data_type'         => 'text',
                        'value'             => isset($apaczka_delivery_point['apm_foreign_access_point_id']) ? $apaczka_delivery_point['apm_foreign_access_point_id'] : '',
                        'placeholder'       => __('Delivery point id', 'apaczka-pl'),
                    )
                );

                ?>


                <input data-key="apm_access_point_id" type="hidden"
                       id="_apaczka_apm_access_point_id"
                       name="_apaczka[delivery_point][apm_access_point_id]"/>
                <input data-key="apm_supplier" type="hidden"
                       id="_apaczka_apm_supplier"
                       name="_apaczka[delivery_point][apm_supplier"/>
                <input data-key="apm_name" type="hidden" id="_apaczka_apm_name"
                       name="_apaczka[delivery_point][apm_name]"/>
                <input data-key="apm_foreign_access_point_id" type="hidden"
                       id="_apaczka_apm_foreign_access_point_id"
                       name="_apaczka[delivery_point][apm_foreign_access_point_id]"/>
                <input data-key="apm_street" type="hidden"
                       id="_apaczka_apm_street"
                       name="_apaczka[delivery_point][apm_street]"/>
                <input data-key="apm_city" type="hidden" id="_apaczka_apm_city"
                       name="_apaczka[delivery_point][apm_city]"/>
                <input data-key="apm_postal_code" type="hidden"
                       id="_apaczka_apm_postal_code"
                       name="_apaczka[delivery_point][apm_postal_code]"/>
                <input data-key="apm_country_code" type="hidden"
                       id="_apaczka_apm_country_code"
                       name="_apaczka[delivery_point][apm_country_code]"/>

            </div>

            <div class="options_panel-button-wrapper">
                <?php $apaczka_preloader = apaczka()->get_plugin_img_url() . '/animation-round-small.gif'; ?>
                <span id="apaczka_pl_preloader"><img src="<?php echo esc_url( $apaczka_preloader ); ?>"></span>
                <!--<div class="apaczka_set_order_completed-wrapper apaczka-hidden">
					<p class="apaczka_set_order_completed">
						<input name="apaczka_set_order_completed" id="apaczka_set_order_completed" type="checkbox" value="1">
						<label for="apaczka_set_order_completed">
							<?php /*_e( 'Change order status to Completed?', 'apaczka-pl' ); */ ?>
						</label>
					</p>
				</div>-->
                <button disabled class="button-primary apaczka_send"
                        id="apaczka_send"
                        data-apaczka-id="<?php echo esc_attr($id); ?>">
                    <?php _e('Send', 'apaczka-pl'); ?></button>
            </div>

            <br>
            <span style="float:none;"
                  class="spinner spinner_courier"></span>
            <div style="padding-top:5px"></div>
            <span style="float:none;" class="spinner spinner_self"></span>
        </div>
    <?php endif; ?>
    <div class="apaczka_error" id="apaczka_error">
        <?php
        if (isset($apaczka_wc_order_data['error_messages'])
            && $apaczka_wc_order_data['error_messages'] != ''
        ) :
            ?>
            <hr/>

            <?php echo esc_html($apaczka_wc_order_data['error_messages']); ?>

        <?php endif; ?>
    </div>

    <div class="apaczka_success" style="color: lawngreen"
         id="apaczka_success">
    </div>

    <?php if ($package_send == true) : ?>
        <?php
        $srv_list        = (new Service_Structure_Helper())->get_services();
        $choosed_carrier = '';
        $apaczka_order   = get_post_meta($post->ID, '_apaczka_last_order_object', true);
        if ($apaczka_order) {
            foreach ($srv_list as $service) {
                if ($service->service_id == $apaczka_order['service_id']) {
                    $choosed_carrier = $service->name;
                }
            }
        }
        ?>
        <h3>
            <?php
            _e(
                'Your order has been placed on apaczka.pl',
                'apaczka-pl'
            );
            ?>
        </h3>
        <h4><?php _e('The waybill number is:', 'apaczka-pl'); ?>
            <strong><a target="_blank"
                       href="<?php echo esc_url($apaczka_wc_order_data['apaczka_order']->tracking_url); ?>">
                    <?php echo esc_attr($apaczka_wc_order_data['apaczka_order']->waybill_number); ?>
                </a>
            </strong>
        </h4>
        <?php if ($choosed_carrier) : ?>
            <h4><?php _e('Carrier:', 'apaczka-pl'); ?>
                <strong id="apaczka_choosed_carrier_id" data-id="<?php echo esc_attr($apaczka_order['service_id']); ?>"
                        style="color:#36aa27">
                    <?php echo esc_attr($choosed_carrier); ?>
                </strong>
            </h4>
        <?php endif; ?>
    <?php endif; ?>

    <?php if ($package_send) : ?>
        <br/>

        <button
                class="button-primary"
                id="apaczka_get_waybill">
            <?php
            _e(
                'Get waybill',
                'apaczka-pl'
            );
            ?>
        </button>
        </a>
        <br/>
        <br/>
        <button class="button-primary apaczka_cancel" id="apaczka_cancel"
                data-apaczka-id="<?php echo esc_attr($id); ?>">
            <?php
            _e(
                'Cancel parcel',
                'apaczka-pl'
            );
            ?>
        </button>


        <?php if ($apaczka_wc_order_data['package_properties']['shipping_method'] === 'COURIER') : ?>
            <button class="button-primary apaczka_download_turn_in"
                    id="apaczka_download_turn_in"
                    data-apaczka-id="<?php echo esc_attr($id); ?>">
                <?php
                _e(
                    'Download turn in protocol',
                    'apaczka-pl'
                );
                ?>
            </button>
        <?php endif; ?>
    <?php endif; ?>

</div>
<input type="hidden" id="apaczka_pl_wc_order_id" value="<?php echo esc_attr( $order_id ); ?>">
<input type="hidden" id="apaczka_pl_apaczka_order_created" value="<?php echo esc_attr( $apaczka_order_id ); ?>">


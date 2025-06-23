(function ($) {

    let apaczka_geowidget_supplier;
    let geowidget_only_cod = false;
    let apaczka_only_cod   = false;
    let initial_map_address   = '';
    let shipping_country_code   = '';

    function apaczka_pl_create_operator_block(operatorId, operatorName) {
        operatorName = operatorName.toUpperCase();
        return {
            operator: operatorName,
            price: null
        };
    }

    function apaczka_wait_fo_element(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }


    function apaczka_change_react_input(input, value) {
        if (typeof input != 'undefined' && input !== null) {
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;
            nativeInputValueSetter.call(input, value);
            var inputEvent = new Event("input", {bubbles: true});
            input.dispatchEvent(inputEvent);
        }
    }


    function apaczka_pl_set_apm_data(record) {

        console.log( 'apaczka_wc_block_point_callback' );
        console.log( record );

        let visible_point_id   = '';
        let visible_point_desc = '';
        let visible_city       = '';
        let visible_street     = '';
        let visible_house      = '';
        let apaczka_point_data = {};

        if ('code' in record) {
            if ('brand' in record) {
                apaczka_point_data.apm_access_point_id = record.code;
                visible_point_id                       = '<div id="selected-parcel-machine-id">' + record.brand + ': ' + record.code + '</div>\n';
            } else {
                apaczka_point_data.apm_access_point_id = record.code;
                visible_point_id                       = '<div id="selected-parcel-machine-id">' + record.code + '</div>\n';
            }
        }

        if ('operator' in record) {
            apaczka_point_data.apm_supplier = record.operator;
        }

        if ('description' in record) {
            apaczka_point_data.apm_name = record.description;
            visible_point_desc         += record.description;
        }

        if ('code' in record) {
            apaczka_point_data.apm_foreign_access_point_id = record.code;
        }

        if ('street' in record) {
            apaczka_point_data.apm_street = record.street;
            visible_point_desc           += '<br>' + record.street;
        }

        if ('city' in record) {
            apaczka_point_data.apm_city = record.city;
            visible_point_desc         += '<br>' + record.city;
        }

        if ('postalCode' in record) {
            apaczka_point_data.apm_postal_code = record.postalCode;
            visible_point_desc                += '<br>' + record.postalCode;
        }

        if ('country_code' in record) {
            apaczka_point_data.apm_country_code = record.country_code;
        }

        let shipping_country = $( '#shipping-country' );
        if (typeof shipping_country != 'undefined' && shipping_country !== null) {
            shipping_country_code = $( shipping_country ).val();
            if (typeof shipping_country_code != 'undefined' && shipping_country_code !== null) {
                apaczka_point_data.apm_country_code = record.shipping_country_code;
            }
        }

        apaczka_change_react_input(document.getElementById('apaczka-point'), JSON.stringify(apaczka_point_data));

        $('#apaczka_pl_geowidget_block').text(apaczka_block.button_text2);

        let point_desc = '<span id="selected-parcel-machine-desc">' + visible_point_desc + '</span>';

        let apaczka_point = '<div class="apaczka_selected_point_data" id="apaczka_selected_point_data">\n'
            + visible_point_id
            + point_desc + '</div>';

        $('#apaczka_selected_point_data_wrap').html(apaczka_point);
        $('#apaczka_selected_point_data_wrap').show();

        $('#shipping-phone').prop('required', true);
        $('label[for="shipping-phone"]').text('Telefon (wymagany)');

    }


    function apaczka_pl_open_modal() {
        document.getElementById('apaczka_pl_checkout_validation_modal').style.display = 'flex';
    }

    function apaczka_pl_close_modal() {
        document.getElementById('apaczka_pl_checkout_validation_modal').style.display = 'none';

        // Scroll to map button.
        let scrollToElement = document.getElementById('shipping-option');

        if (scrollToElement) {
            scrollToElement.scrollIntoView({behavior: 'smooth'});
        }

    }

    function apaczka_pl_block_get_initial_map_address() {


        let initial_map_address = false;

        let city = $( '#billing_city' ).val();
        if (typeof city != 'undefined' && city !== null) {
            initial_map_address = city;
        } else {
            let city_2 = $( '#shipping_city' ).val();
            if (typeof city_2 != 'undefined' && city_2 !== null) {
                initial_map_address = city_2;
            }
        }

        if ( ! initial_map_address ) {
            if ( 'wcSettings' in window ) {
                let wc_settings = window.wcSettings;

                if ( 'checkoutData' in wc_settings ) {
                    let checkout_data = wc_settings.checkoutData;
                    //console.log( 'checkout_data' );
                    //console.log( checkout_data );
                    if ( 'shipping_address' in checkout_data ) {
                        let shipping_address = checkout_data.shipping_address;
                        if ( 'country' in shipping_address ) {

                            if ('city' in shipping_address) {
                                initial_map_address = shipping_address.city;
                            }

                        }
                    }
                }
            }
        }

        return initial_map_address;
    }


    document.addEventListener('change', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        if (target.classList.contains('wc-block-components-radio-control__input')) {
            const parent = document.getElementById("shipping-option");
            if (parent && parent.contains(target)) {
                console.log("Change input inside Shipping Block");
                $('#apaczka_selected_point_data').each(function (ind, elem) {
                    $(elem).remove();
                });
                apaczka_change_react_input(document.getElementById('apaczka-point'), '');
            }
        }
    });


    document.addEventListener('click', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        if (target.hasAttribute( 'id' )) {
            if (target.getAttribute( 'id' ) === 'apaczka_pl_geowidget_modal_cross') {
                e.preventDefault();
                let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'none';
                }
            }

            if ( target.getAttribute( 'id' ) === 'apaczka_pl_geowidget_block' ) {
                e.preventDefault();

                let checked_radio_control = $( 'input[name^="radio-control-"]:checked' );
                if (typeof checked_radio_control != 'undefined' && checked_radio_control !== null) {
                    let id          = $( checked_radio_control ).attr( 'id' );
                    let instance_id = null;
                    let method_data = null;
                    if (typeof id != 'undefined' && id !== null) {
                        method_data = id.split( ":" );
                        instance_id = method_data[method_data.length - 1];
                    }

                    if (instance_id) {
                        console.log( 'MAP shipping config' );
                        console.log( apaczka_block.map_config );

                        if ( ! $.isEmptyObject( apaczka_block.map_config )) {
                            if (apaczka_block.map_config.hasOwnProperty( instance_id )) {

                                let operators             = null;
                                if ('' === initial_map_address || typeof initial_map_address == 'undefined' || initial_map_address === null) {
                                    initial_map_address = apaczka_pl_block_get_initial_map_address();
                                }

                                let shipping_country_code = 'PL';
                                let shipping_country = $( '#shipping-country' );
                                if (typeof shipping_country != 'undefined' && shipping_country !== null) {
                                    shipping_country_code = $( shipping_country ).val();
                                }

                                var key             = instance_id;
                                var shipping_config = apaczka_block.map_config[key];

                                apaczka_geowidget_supplier = shipping_config.hasOwnProperty( "geowidget_supplier" ) ? shipping_config.geowidget_supplier : null;
                                if (apaczka_geowidget_supplier !== null) {

                                    operators = apaczka_geowidget_supplier.map(
                                        function (operator) {
                                            return apaczka_pl_create_operator_block( 'operators - ' + operator, operator );
                                        }
                                    ).filter( Boolean );
                                    operators = operators.length ? operators : null;

                                    console.log( 'operators' );
                                    console.log( operators );
                                }
                                geowidget_only_cod = shipping_config.hasOwnProperty( "geowidget_only_cod" ) ? shipping_config.geowidget_only_cod : null;
                                if (geowidget_only_cod && 'yes' === geowidget_only_cod) {
                                    apaczka_only_cod = true;
                                } else {
                                    apaczka_only_cod = false;
                                }

                                //console.log( 'Apaczka PL: country_code map_init: ', shipping_country_code );
                                //console.log( 'map_initial_address: ', initial_map_address );

                                BPWidget.init(
                                    document.getElementById( 'apaczka_pl_geowidget_modal_inner_content' ),
                                    {

                                        callback: function (point) {
                                            // console.log(point);
                                            // console.log('point code:', point.code);
                                            // console.log('point operator:', point.operator);
                                            let map_modal           = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                                            map_modal.style.display = 'none';
                                            apaczka_pl_set_apm_data( point );
                                        },
                                        posType: 'DELIVERY',
                                        mapOptions: { zoom: 14 },
                                        codOnly: apaczka_only_cod,
                                        operatorMarkers: true,
                                        countryCodes: shipping_country_code,
                                        initialAddress: initial_map_address,
                                        operators: operators,
                                        codeSearch: true
                                    }
                                );

                                let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                                if (typeof map_modal != 'undefined' && map_modal !== null) {
                                    map_modal.style.display = 'flex';
                                }

                            }
                        }
                    }
                }
            }
        }

        if (target.classList.contains('wc-block-components-checkout-place-order-button')
            || target.classList.contains('wc-block-checkout__actions_row')
            || target.classList.contains('wc-block-components-button__text')
            || target.closest('.wc-block-components-checkout-place-order-button')) {

            let reactjs_input = document.getElementById('apaczka-point');
            let reactjs_input_lalue = false;
            if (typeof reactjs_input != 'undefined' && reactjs_input !== null) {
                reactjs_input_lalue = reactjs_input.value;
                if (!reactjs_input_lalue) {
                    apaczka_pl_open_modal();
                }
            }
        }

    });


    $(document).ready(function () {

        // console.log("wcSettings");
        // console.log(wcSettings );
        let apaczka_geowidget_modal       = document.createElement( 'div' );
        let modal_html                    = '<div ' +
            'class="apaczka_pl_geowidget_modal"' + ' style="display:none;"' +
            ' id="apaczka_pl_geowidget_modal_dynamic" style="display: none">' +
            '<div class="apaczka_pl_geowidget_modal_inner">' +
            '<span id="apaczka_pl_geowidget_modal_cross">&times;</span>' +
            '<div id="apaczka_pl_geowidget_modal_inner_content"></div>' +
            '</div>' +
            '</div>';
        apaczka_geowidget_modal.innerHTML = modal_html;
        document.body.appendChild( apaczka_geowidget_modal );

        apaczka_wait_fo_element( '#shipping-city' ).then(
            function (city_input) {
                $(city_input).on(
                    'keyup',
                    function () {
                        initial_map_address = $(this).val();
                    }
                );
            }
        );

        apaczka_wait_fo_element( '#apaczka_pl_geowidget_block' ).then(
            function (map_button) {
                $(map_button).on(
                    'click',
                    function (e) {
                        let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                        if ( typeof map_modal != 'undefined' && map_modal !== null ) {
                            map_modal.style.display = 'flex';
                        }
                    }
                );
            }
        );


        let modal = document.createElement('div');
        modal.innerHTML =
            '<div id="apaczka_pl_checkout_validation_modal" style="' +
            'display: none;' +
            'position: fixed;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'background-color: rgba( 0, 0, 0, 0.5 );' +
            'justify-content: center;' +
            'align-items: center;' +
            'z-index: 1000;">' +
            '<div style="' +
            'background-color: white;' +
            'width: 90%;' +
            'max-width: 300px;' +
            'padding: 20px;' +
            'position: relative;' +
            'text-align: center;' +
            'border-radius: 10px;' +
            'box-shadow: 0px 4px 10px rgba( 0, 0, 0, 0.1 );">' +
            '<span id="apaczka_pl_close_modal_cross" style="' +
            'position: absolute;' +
            'top: 10px;' +
            'right: 15px;' +
            'font-size: 20px;' +
            'cursor: pointer;">&times;</span>' +
            '<div style="margin:20px 0; font-size:18px;">' +
            apaczka_block.alert_text +
            '</div>' +
            '<button id="apaczka_pl_close_modal_button" style="' +
            'padding: 10px 20px;' +
            'background-color: #007BFF;' +
            'color: white;' +
            'border: none;' +
            'border-radius: 5px;' +
            'cursor: pointer;' +
            'font-size: 16px;">' +
            'Ok' +
            '</button>' +
            '</div>' +
            '</div>';

        document.body.appendChild(modal);
        document.getElementById('apaczka_pl_close_modal_cross').addEventListener('click', apaczka_pl_close_modal);
        document.getElementById('apaczka_pl_close_modal_button').addEventListener('click', apaczka_pl_close_modal);

    });

})(jQuery);


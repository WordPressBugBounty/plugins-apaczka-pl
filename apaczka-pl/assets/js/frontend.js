(function ($) {

    $( document ).ready(
        function () {

            var country_code_apaczka = 'PL';
            var initial_map_address  = '';

            console.log( 'Apaczka PL 2.0: classic checkout' );

            let apaczka_geowidget_modal;
            let cod_only       = false;
            let is_cod_only    = false;
            let operatorsArray = [];


            window.apaczka_mp_map_callback = function (point) {

                console.log( point );
                console.log( 'point code:', point.code );
                console.log( 'point operator:', point.operator );

                $( '#selected-parcel-machine' ).removeClass( 'apaczka-hidden' );
                if ( 'brand' in point ) {
                    let point_brand = point.brand + ': ' + point.code;
                    $( '#selected-parcel-machine-id' ).html( point_brand );
                } else {
                    $( '#selected-parcel-machine-id' ).html( point.code );
                }

                let visible_point_desc = '';
                if ('description' in point) {
                    visible_point_desc += point.description;
                }
                if ('street' in point) {
                    visible_point_desc += '<br>' + point.street;
                }
                if ('city' in point) {
                    visible_point_desc += '<br>' + point.city;
                }
                if ('postalCode' in point) {
                    visible_point_desc += '<br>' + point.postalCode;
                }

                $( '#selected-parcel-machine-desc' ).html( visible_point_desc );

                $( '#apm_name' ).val( point.description );
                $( '#apm_city' ).val( point.city );
                $( '#apm_street' ).val( point.street );
                $( '#apm_postal_code' ).val( point.postalCode );
                $( '#apm_country_code' ).val( country_code_apaczka );
                $( '#apm_supplier' ).val( point.operator );
                $( '#apm_access_point_id' ).val( point.code );
                $( '#apm_foreign_access_point_id' ).val( point.code );

            }

            function apaczka_pl_create_operator_obj(operatorId, operatorName) {
                operatorName = operatorName.toUpperCase();
                return {
                    operator: operatorName,
                    price: null
                };
            }

            function apaczka_pl_wait_fo_element(selector) {
                return new Promise(
                    function (resolve) {
                        if (document.querySelector( selector )) {
                            return resolve( document.querySelector( selector ) );
                        }

                        const observer = new MutationObserver(
                            function (mutations) {
                                if (document.querySelector( selector )) {
                                    resolve( document.querySelector( selector ) );
                                    observer.disconnect();
                                }
                            }
                        );

                        observer.observe(
                            document.body,
                            {
                                childList: true,
                                subtree: true
                            }
                        );
                    }
                );
            }

            function apaczka_pl_get_chosen_shipping_method() {
                let data    = {};
                let method  = $( 'input[name^="shipping_method"]:checked' ).val();
                let postfix = '';
                if ('undefined' == typeof method || null === method ) {
                    method = $( 'input[name^="shipping_method"]' ).val();
                }
                if (typeof method != 'undefined' && method !== null) {
                    if (method.indexOf( ':' ) > -1) {
                        let arr = method.split( ':' );
                        method  = arr[0];
                        postfix = arr[1];
                    }
                }
                data.method      = method;
                data.instance_id = postfix;

                return data;
            }

            function apaczka_pl_get_initial_map_address() {

                let country_code        = '';
                let initial_map_address = '';

                let shipping_country_input = $( '#shipping_country' );

                if (typeof shipping_country_input != 'undefined' && shipping_country_input !== null) {
                    let country_code_shipping = $( shipping_country_input ).val();
                    if (typeof country_code_shipping != 'undefined' && country_code_shipping !== null) {
                        country_code = $( '#shipping_city' ).val();
                    } else {
                        let billing_country = $( '#billing_country' );
                        if (typeof billing_country != 'undefined' && billing_country !== null) {
                            country_code_billing = $( billing_country ).val();
                            if (typeof country_code_billing != 'undefined' && country_code_billing !== null) {
                                country_code = $( '#billing_city' ).val();
                            }
                        }
                    }
                }

                let city = $( '#billing_city' ).val();
                if (typeof city != 'undefined' && city !== null) {
                    initial_map_address = city;
                } else {
                    let city_2 = $( '#shipping_city' ).val();
                    if (typeof city_2 != 'undefined' && city_2 !== null) {
                        initial_map_address = city_2;
                    }
                }

                return initial_map_address;
            }

            let shipping_methods_config = apaczka_checkout.map_config;
            console.log( 'shipping_methods_config:' );
            console.log( shipping_methods_config );
            let shipping_method_data = apaczka_pl_get_chosen_shipping_method();
            if ( 'instance_id' in shipping_method_data ) {
                let instance_id = shipping_method_data.instance_id;
                console.log( 'instance_id:' );
                console.log( instance_id );
                let config_by_instance_id = shipping_methods_config[instance_id];
                if (typeof config_by_instance_id != 'undefined' && config_by_instance_id !== null) {
                    operatorsArray = config_by_instance_id.geowidget_supplier;
                    is_cod_only    = config_by_instance_id.geowidget_only_cod;
                }
            }

            apaczka_pl_wait_fo_element( '#billing_city' ).then(
                function (billing_city) {
                    $(billing_city).on(
                        'keyup',
                        function () {
                            initial_map_address = $(this).val();
                        }
                    );
                }
            );

            apaczka_pl_wait_fo_element( '#shipping_city' ).then(
                function (shipping_city) {
                    $(shipping_city).on(
                        'keyup',
                        function () {
                            initial_map_address = $(this).val();
                        }
                    );
                }
            );

            $( document.body ).on(
                'updated_checkout update_checkout',
                function () {

                    let shipping_method_data = apaczka_pl_get_chosen_shipping_method();
                    if ( 'instance_id' in shipping_method_data ) {
                        let instance_id = shipping_method_data.instance_id;
                        // console.log('instance_id:');
                        // console.log(instance_id);
                        let map_button            = document.getElementById( "apaczka_pl_geowidget_classic" );
                        if ( typeof map_button != 'undefined' && map_button !== null) {
                            let config_by_instance_id = shipping_methods_config[instance_id];
                            if (typeof config_by_instance_id != 'undefined' && config_by_instance_id !== null) {
                                operatorsArray = config_by_instance_id.geowidget_supplier;
                                is_cod_only = config_by_instance_id.geowidget_only_cod;
                                //console.log('show button');
                                $(map_button).removeClass('apaczka-hidden');

                            } else {
                                //console.log('Apaczka PL, classic checkout: no config for selected shipping method');
                                $(map_button).addClass('apaczka-hidden');
                                $('#selected-parcel-machine').addClass('apaczka-hidden');
                                $('#selected-parcel-machine-id').html('');
                                $('#selected-parcel-machine-desc').html('');
                            }
                        }

                    }
                }
            );

            if ('' === initial_map_address || typeof initial_map_address == 'undefined' || initial_map_address === null) {
                initial_map_address = apaczka_pl_get_initial_map_address();
            }

            if ( is_cod_only && 'yes' === is_cod_only ) {
                cod_only = true;
            }

            apaczka_geowidget_modal           = document.createElement( 'div' );
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

            $( '#shipping_country' ).on(
                'change',
                function () {
                    apaczkaShippingDataObject = { 'shipping_country': $( this ).val() };
                    localStorage.setItem( 'apaczkaShippingData', JSON.stringify( apaczkaShippingDataObject ) );
                }
            );

            $( '#billing_country' ).on(
                'change',
                function () {
                    apaczkaShippingDataObject = { 'shipping_country': $( this ).val() };
                    localStorage.setItem( 'apaczkaShippingData', JSON.stringify( apaczkaShippingDataObject ) );
                }
            );

            document.addEventListener(
                'change',
                function (e) {
                    e          = e || window.event;
                    var target = e.target || e.srcElement;
                    if ( target.classList.contains( 'shipping_method' ) ) {
                        const parent = document.getElementById( "shipping_method" );
                        if ( parent && parent.contains( target ) ) {
                            //console.log( "Change shipping option" );
                            $( '#selected-parcel-machine' ).addClass( 'apaczka-hidden' );
                            $( '#selected-parcel-machine-id' ).html( '' );
                            $( '#selected-parcel-machine-desc' ).html( '' );

                            let input_value = target.value;
                            if (typeof input_value != 'undefined' && input_value !== null) {
                                let instance_id = null;
                                let method_data = null;
                                method_data     = input_value.split( ":" );
                                instance_id     = method_data[method_data.length - 1];

                                //console.log( 'Change shipping input instance_id:' );
                                //console.log( instance_id );
                                let config_by_instance_id = shipping_methods_config[instance_id];
                                let map_button            = document.getElementById( "apaczka_pl_geowidget_classic" );
                                if (typeof config_by_instance_id != 'undefined' && config_by_instance_id !== null) {
                                    operatorsArray = config_by_instance_id.geowidget_supplier;
                                    is_cod_only    = config_by_instance_id.geowidget_only_cod;
                                    if ( typeof map_button != 'undefined' && map_button !== null) {
                                        $( map_button ).removeClass( 'apaczka-hidden' );
                                    }
                                } else {
                                    $( map_button ).addClass( 'apaczka-hidden' );
                                }
                            }
                        }
                    }
                }
            );

            document.addEventListener(
                'click',
                function (e) {
                    e          = e || window.event;
                    var target = e.target || e.srcElement;
                    if (target.hasAttribute( 'id' ) && 'apaczka_pl_geowidget_classic' === target.getAttribute( 'id' ) ) {

                        e.preventDefault();

                        let apaczkaShippingData = localStorage.getItem( 'apaczkaShippingData' );
                        if ( apaczkaShippingData !== null) {
                            let apaczkaShippingDataObject = JSON.parse( apaczkaShippingData );

                            if ( 'shipping_country' in apaczkaShippingDataObject ) {
                                country_code_apaczka = apaczkaShippingDataObject.shipping_country;
                            }

                        } else {
                            let shipping_country_input = $( '#shipping_country' );
                            if (typeof shipping_country_input != 'undefined' && shipping_country_input !== null) {
                                let country_code_shipping = $( shipping_country_input ).val();
                                if (typeof country_code_shipping != 'undefined' && country_code_shipping !== null) {
                                    country_code_apaczka = country_code_shipping;
                                } else {
                                    let billing_country = $( '#billing_country' );
                                    if (typeof billing_country != 'undefined' && billing_country !== null) {
                                        country_code_billing = $( billing_country ).val();
                                        if (typeof country_code_billing != 'undefined' && country_code_billing !== null) {
                                            country_code_apaczka = country_code_billing;
                                        }
                                    }
                                }
                            }
                        }

                        if ('' === initial_map_address || typeof initial_map_address == 'undefined' || initial_map_address === null) {
                            initial_map_address = apaczka_pl_get_initial_map_address();
                        }

                        console.log( 'apaczka_pl_country_code_before_map_init: ', country_code_apaczka );
                        console.log( 'apaczka_pl_map_initial_address: ', initial_map_address );

                        let operators = operatorsArray.map(
                            function (operator) {
                                return apaczka_pl_create_operator_obj( 'operators-' + operator, operator );
                            }
                        ).filter( Boolean );
                        operators     = operators.length ? operators : null;

                        //console.log( 'operators before map init: ' );
                        //console.log( operators );

                        BPWidget.init(
                            document.getElementById( 'apaczka_pl_geowidget_modal_inner_content' ),
                            {
                                callback: function (point) {
                                    window.apaczka_mp_map_callback( point );
                                    let map_modal           = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                                    map_modal.style.display = 'none';
                                },
                                language: apaczka_checkout.lang,
                                posType: 'DELIVERY',
                                mapOptions: { zoom: 14 },
                                codOnly: cod_only,
                                operatorMarkers: true,
                                countryCodes: country_code_apaczka,
                                initialAddress: initial_map_address,
                                operators: operators,
                                codeSearch: true
                            }
                        );

                        let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                        if ( typeof map_modal != 'undefined' && map_modal !== null ) {
                            map_modal.style.display = 'flex';
                        }

                    }

                },
                false
            );

            $( '#apaczka_pl_geowidget_modal_cross' ).on(
                'click',
                function () {

                    let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                    if (typeof map_modal != 'undefined' && map_modal !== null) {
                        map_modal.style.display = 'none';
                    }
                }
            );



        }
    );

})( jQuery );


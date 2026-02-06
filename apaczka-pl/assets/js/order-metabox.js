(function ($) {

    $(document).ready(function () {

        let apaczka_geowidget_modal = document.createElement('div');
        let modal_html = '<div ' +
            'class="apaczka_pl_geowidget_modal"' + ' style="display:none;"' +
            ' id="apaczka_pl_geowidget_modal_dynamic" style="display: none">' +
            '<div class="apaczka_pl_geowidget_modal_inner">' +
            '<span id="apaczka_pl_geowidget_modal_cross">&times;</span>' +
            '<div id="apaczka_pl_geowidget_modal_inner_content"></div>' +
            '</div>' +
            '</div>';
        apaczka_geowidget_modal.innerHTML = modal_html;
        document.body.appendChild(apaczka_geowidget_modal);


        let apaczka_parcel_type_handle = $('#_apaczka\\[package_properties\\]\\[parcel_type\\]');
        let apaczka_parcel_depth = $('#_apaczka\\[package_properties\\]\\[package_depth\\]');
        let apaczka_parcel_width = $('#_apaczka\\[package_properties\\]\\[package_width\\]');
        let apaczka_parcel_height = $('#_apaczka\\[package_properties\\]\\[package_height\\]');

        let sender_zip_code_order = $('input[name="_apaczka[sender][postal_code]"]');
        if (typeof sender_zip_code_order != 'undefined') {
            $(sender_zip_code_order).mask("99-999", {placeholder: "XX-XXX"});
        }

        let iban_order = $('input[name="_apaczka[sender][bank_account_number]"]');
        if (typeof iban_order != 'undefined') {
            $(iban_order).mask('99 9999 9999 9999 9999 9999 9999', {
                placeholder: '__ ____ ____ ____ ____ ____ ____'
            });
        }

        let sender_phone_number_order = $('input[name="_apaczka[sender][phone]"]');
        /*
        if(typeof sender_phone_number_order != 'undefined' ) {
            $(sender_phone_number_order).mask("999999999",{placeholder:" "});
        }
        */


        var apaczka_calculate_selected_service = $('input[name="apaczka_calculate_radio"]:checked').val();
        var apaczka_dispath_point_handler_to_validate = false;

        let map_country_code = 'PL';
        let receiver_country_code_field = $('#_apaczka\\[receiver\\]\\[country_code\\]');
        if (typeof receiver_country_code_field != 'undefined' && receiver_country_code_field !== null) {
            let receiver_country_code = $(receiver_country_code_field).val();
            if (typeof receiver_country_code != 'undefined' && receiver_country_code !== null) {
                map_country_code = receiver_country_code;
            }
        }

        let receiver_city_for_map = '';
        let receiver_city_field = $('#_apaczka\\[receiver\\]\\[city\\]');
        if (typeof receiver_city_field != 'undefined' && receiver_city_field !== null) {
            let receiver_city = $(receiver_city_field).val();
            if (typeof receiver_city != 'undefined' && receiver_city !== null) {
                receiver_city_for_map = receiver_city;
            }
        }

        //console.log('map_country_code');
        //console.log(map_country_code);
        //console.log('map_city');
        //console.log(receiver_city_for_map);

        function createOperator(operatorId, operatorName) {
            operatorName = operatorName.toUpperCase();
            return {
                operator: operatorName,
                price: null
            };
        }


        function changeParcelTypeActions(type) {
            switch (type) {
                case 'europalette':
                    apaczka_parcel_width.val(120);
                    apaczka_parcel_depth.val(80);
                    apaczka_parcel_depth.prop('readonly', true);
                    apaczka_parcel_width.prop('readonly', true);

                    if (apaczka_parcel_height.val() > 220) {
                        apaczka_parcel_height.val(220);
                    }

                    apaczka_parcel_height.prop('max', 220);
                    break;
                case 'palette_60x80':
                    apaczka_parcel_width.val(60);
                    apaczka_parcel_depth.val(80);
                    apaczka_parcel_depth.prop('readonly', true);
                    apaczka_parcel_width.prop('readonly', true);

                    if (apaczka_parcel_height.val() > 220) {
                        apaczka_parcel_height.val(220)
                    }

                    apaczka_parcel_height.prop('max', 220);
                    break;
                case 'palette_120x100':
                    apaczka_parcel_depth.val(100);
                    apaczka_parcel_width.val(120);
                    apaczka_parcel_depth.prop('readonly', true);
                    apaczka_parcel_width.prop('readonly', true);

                    if (apaczka_parcel_height.val() > 220) {
                        apaczka_parcel_height.val(220)
                    }


                    apaczka_parcel_height.prop('max', 220);
                    break;
                case 'palette_120x120':
                    apaczka_parcel_depth.val(120);
                    apaczka_parcel_width.val(120);
                    apaczka_parcel_depth.prop('readonly', true);
                    apaczka_parcel_width.prop('readonly', true);

                    if (apaczka_parcel_height.val() > 220) {
                        apaczka_parcel_height.val(220)
                    }


                    apaczka_parcel_height.prop('max', 220);
                    break;
                default:
                    apaczka_parcel_depth.prop('readonly', false);
                    apaczka_parcel_width.prop('readonly', false);
                    apaczka_parcel_height.removeAttr('max')
            }
        }

        function changeShippingMethodTriggers(method) {
            if ('SELF' === method) {
                $("label[data-pickup_courier='2']").remove();
                $("label[data-pickup_courier='0']").show();
                $("label[data-pickup_courier='1']").show();
                $("label[data-service_id='41']").remove();
                $("label[data-service_id='14']").remove();
                $("label[data-service_id='13']").remove();
                $("label[data-service_id='50']").remove();
                $("label[data-service_id='26']").remove();
                $("label[data-service_id='43']").remove();
                $("label[data-service_id='162']").remove();
                $("label[data-service_id='160']").remove();
                $("label[data-service_id='165']").remove();
                $("label[data-service_id='40']").remove();
                $("label[data-service_id='164']").remove();
                $("label[data-service_id='66']").remove();
                $("label[data-service_id='65']").remove();

            } else {
                $("label[data-service_id='65']").show();
                $("label[data-service_id='66']").show();
                $("label[data-service_id='164']").show();
                $("label[data-service_id='40']").show();
                $("label[data-service_id='165']").show();
                $("label[data-service_id='160']").show();
                $("label[data-service_id='162']").show();
                $("label[data-service_id='43']").show();
                $("label[data-service_id='26']").show();
                $("label[data-service_id='50']").show();
                $("label[data-service_id='41']").show();
                $("label[data-service_id='14']").show();
                $("label[data-service_id='13']").show();
                $("label[data-pickup_courier='2']").show();
                $("label[data-pickup_courier='0']").show();
                $("label[data-pickup_courier='1']").show();
            }
        }

        function fillSenderFormByTemplate(templateSlug) {
            let apaczka_sender_templates = apaczka_order_metabox.sender_templates;
            //console.log('apaczka_sender_templates');
            //console.log(apaczka_sender_templates);
            for (const [key, value] of Object.entries(apaczka_sender_templates)) {
                if (key === templateSlug) {
                    for (const [key2, value2] of Object.entries(value.options)) {
                        key2_new = key2.replace("apaczka_woocommerce_settings_general_sender_", "");
                        $('#' + '_apaczka\\[sender\\]\\[' + key2_new + '\\]').val(value2)
                    }
                }
            }
        }

        function fillPackagePropertiesFormByTemplate(templateSlug) {
            let apaczka_package_properties_templates = apaczka_order_metabox.package_properties_templates;
            //console.log('apaczka_package_properties_templates');
            //console.log(apaczka_package_properties_templates);
            for (const [key, value] of Object.entries(apaczka_package_properties_templates)) {
                if (key === templateSlug) {
                    for (const [key2, value2] of Object.entries(value.options)) {
                        key2_new = key2.replace("apaczka_woocommerce_settings_general_", "");
                        $('#' + '_apaczka\\[package_properties\\]\\[' + key2_new + '\\]').val(value2)
                    }
                }
            }

            $('#_apaczka\\[package_properties\\]\\[parcel_type\\]').trigger('change');

        }

        const PocztaKurier48 = 160;
        const PocztaKurier48Punkty = 162;
        const PocztexPunktDrzwi = 65;
        const PocztexPunktPunkt = 66;
        const AllegroSMARTKurier48Punkty = 164;
        const AllegroSMARTPocztaKurier48 = 165;
        const AllegroSMARTPaczkomatInPost = 40;
        const PaczkomatInPost = 41;
        const PaczkomatInPostInternational = 43;
        const PaczkomatInPostInternationalDrzwiPunkt = 45;
        const PaczkomatInPostInternationalFR = 46;
        const UPSAPPunktDrzwi = 13;
        const UPSAPPunktDrzwiFR = 16;
        const UPSAPPunktPunkt = 14;
        const DPD_kurier = 21;
        const AllegroSMARTPocztex = 67;
        const AllegroSMARTPocztexPunkty = 68;
        const InPostPaczkomatDrzwi = 43;
        const PocztexDrzwiPunkt = 64;
        const AllegroSMARTDPDPickup = 20;
        const DPDCourierEurope = 22;
        const DPDPickupEurope = 29;
        const FedexInternationalEconomy = 153;
        const UPSstandard = 5;
        const UPSexpressSaver = 6;
		const DPDPickupPunktPunkt = 26;
        const DPDPickupPunktDzrwi = 30;


        /**
         * /**
         *  * UPS Access Point (service id: 14,15, 16)
         * DPD Pickup (service id: 23, 26)
         * ORLEN Paczka  (service id: 50)
         * Paczkomaty InPost  (service id: 41)
         * Poczta Polska Ekspres24 Punkty  (service id: 163)
         * DHL POP  (service id: 86)
         * Poczta Polska Kurier48 Punkty  (service id: 162)
         * DHL_PARCEL
         * DPD
         * INPOST
         * POCZTA
         * UPS
         */


        function serviceIdToApmSupplierId(serviceId) {
            switch (serviceId) {
                case 14:
                case 15:
                case 16:
                    return 'UPS';
                case 20:
                case 23:
                case 26:
                case 29:
                    return 'DPD';
                case 50:
                case 53:
                    return 'RUCH';
                case 40:
                case 41:
                case 45:
                case 46:
                    return 'INPOST';
                case 163:
                    return 'POCZTA';
                case 64:
                    return 'POCZTA';
                case 66:
                    return 'POCZTA';
                case 162:
                    return 'POCZTA';
                case 86:
                    return 'DHL';
                case 68:
                    return 'POCZTA';
                default:
                    return null
            }
        }

        function is_cod_amount_defined() {
            return parseInt($('#_apaczka\\[additional_options\\]\\[cod_amount\\]').val()) > 0
        }

        function apaczka_pl_add_border() {
            const elements = document.querySelectorAll("#apaczka_calculate_radio > .apaczka-calculate-item > .apaczka-calculate-item-price-wrapper > input[type='radio']");
            if (elements) {

                elements.forEach( (element) => {
                    if (element.checked) {
                        element.closest(".apaczka-calculate-item").classList.toggle("selected");
                        element.setAttribute("checked", "checked");
                    }
                    document.querySelectorAll("#apaczka_calculate_radio > .apaczka-calculate-item > .apaczka-calculate-item-price-wrapper > input[type='radio']").forEach((element) => {
                        if (element.checked === false) {
                            element.closest(".apaczka-calculate-item").classList.remove("selected");
                            element.removeAttribute("checked");
                        }
                    })
                });
            }
        }


        /**
         *DHL_PARCEL DHL
         * DPD DPD
         * INPOST INPOST
         * PWR Orlen Paczka
         * POCZTA Poczta Polska
         * UPS UPS
         */

        function handleCalculateDynamicFields(selectedService) {

            apaczka_pl_add_border();

            let shipping_method = $('#_apaczka\\[package_properties\\]\\[shipping_method\\]').val();
            let method = null;

            let debug = serviceIdToApmSupplierId(selectedService);
            console.log('Apaczka PL: serviceIdToApmSupplierId:');
            console.log(debug);

            if (serviceIdToApmSupplierId(selectedService) !== null) {
                $('#apaczka_delivery_point_id_wrapper').removeClass('apaczka-hidden');
            } else {
                $('#apaczka_delivery_point_id_wrapper').addClass('apaczka-hidden');
            }           

            if ((selectedService === PocztaKurier48
                || selectedService === PocztaKurier48Punkty
                || selectedService === AllegroSMARTKurier48Punkty
                || selectedService === AllegroSMARTPocztaKurier48
                || selectedService === PocztexPunktDrzwi
                || selectedService === PocztexPunktPunkt
                || selectedService === AllegroSMARTPocztex
                || selectedService === AllegroSMARTPocztexPunkty
            )
            ) {
                method = 'kurier48';

            }

            if (selectedService === AllegroSMARTPaczkomatInPost
                || selectedService === PaczkomatInPost
                || selectedService === InPostPaczkomatDrzwi
                || selectedService === PaczkomatInPostInternational
                || selectedService === PaczkomatInPostInternationalFR
                || selectedService === PaczkomatInPostInternationalDrzwiPunkt

            ) {
                method = 'inpost';
            }

            if (selectedService === UPSAPPunktPunkt
                || selectedService === UPSAPPunktDrzwi
                //|| selectedService === UPSAPPunktDrzwiFR
                //|| selectedService === UPSexpressSaver
                //|| selectedService === UPSstandard
            ) {
                method = 'ups';

            }

            if (selectedService === AllegroSMARTDPDPickup
                || selectedService === DPDPickupPunktPunkt
                || selectedService === DPDPickupPunktDzrwi
                //|| selectedService === DPDCourierEurope
                //|| selectedService === DPDPickupEurope
            ) {
                method = 'dpd';
            }

            /*if ( selectedService === FedexInternationalEconomy
            ) {
                method = 'fedex';

            }*/

            if ('POINT' === shipping_method) {
                if (selectedService === DPD_kurier) {
                    method = 'dpd';

                }
            }


            console.log('selectedService ' + selectedService);
            console.log('method ' + method);
            console.log('shipping_method ' + shipping_method);

            if ('kurier48' === method) {
                $('#dispath_point_kurier48_wrapper').removeClass('apaczka-hidden');
                $('#dispath_point_ups_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_dpd_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_inpost_wrapper').addClass('apaczka-hidden');

                $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val($('#_apaczka\\[package_properties\\]\\[dispath_point_kurier48\\]').val());
                apaczka_dispath_point_handler_to_validate = $('#_apaczka\\[package_properties\\]\\[dispath_point_kurier48\\]');


            }

            if ('inpost' === method) {
                $('#dispath_point_kurier48_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_ups_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_dpd_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_inpost_wrapper').removeClass('apaczka-hidden');

                $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val($('#_apaczka\\[package_properties\\]\\[dispath_point_inpost\\]').val());
                apaczka_dispath_point_handler_to_validate = $('#_apaczka\\[package_properties\\]\\[dispath_point_inpost\\]');

                if ('COURIER' === shipping_method) {
                    $('#dispath_point_inpost_wrapper').addClass('apaczka-hidden');
                    apaczka_dispath_point_handler_to_validate = false;
                } else {
                    $('#dispath_point_inpost_wrapper').removeClass('apaczka-hidden');
                    apaczka_dispath_point_handler_to_validate = $('#_apaczka\\[package_properties\\]\\[dispath_point_inpost\\]');
                }
            }

            if ('ups' === method) {
                $('#dispath_point_kurier48_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_ups_wrapper').removeClass('apaczka-hidden');
                $('#dispath_point_inpost_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_dpd_wrapper').addClass('apaczka-hidden');

                $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val($('#_apaczka\\[package_properties\\]\\[dispath_point_ups\\]').val())
                apaczka_dispath_point_handler_to_validate = $('#_apaczka\\[package_properties\\]\\[dispath_point_ups\\]');

            }

            if ('dpd' === method) {
                $('#dispath_point_kurier48_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_ups_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_inpost_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_dpd_wrapper').removeClass('apaczka-hidden');

                $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val($('#_apaczka_dispath_point_dpd').val());
                apaczka_dispath_point_handler_to_validate = $('#_apaczka_dispath_point_dpd');

            } else {
                $('#dispath_point_dpd_wrapper').addClass('apaczka-hidden');
            }

            if (null === method) {
                $('#dispath_point_kurier48_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_ups_wrapper').addClass('apaczka-hidden');
                $('#dispath_point_inpost_wrapper').addClass('apaczka-hidden');
                apaczka_dispath_point_handler_to_validate = false;
            }
        }


        $('body #woocommerce-order-downloads .buttons .select2-container').css("width", "100% !important");

        $('#apaczka_calculate_price_btn').click(function (e) {
            var observer = new MutationObserver(function (mutations) {
                if ($("#apaczka_calculate_radio").length) {
                    $("#apaczka_calculate_radio > .apaczka-calculate-item:first-child").click();
                    $("#apaczka_calculate_radio > .apaczka-calculate-item:first-child").click();
                    const valOfFirstItem = $("#apaczka_calculate_radio > .apaczka-calculate-item > .apaczka-calculate-item-price-wrapper > input[type='radio']:checked").val();
                    console.log("valOfFirstItem", valOfFirstItem);
                    apaczka_calculate_selected_service = valOfFirstItem;
                    handleCalculateDynamicFields(parseInt(valOfFirstItem));
                    observer.disconnect();
                }
            });

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });


        $('#_apaczka\\[package_properties\\]\\[shipping_method\\]').change(function (e) {
            if ($('#apaczka-calculate-wrapper').html() !== '') {
                $('#apaczka_calculate_price_btn').click();
                return false
            }
        });

        $("#apaczka_calculate_radio > .apaczka-calculate-item > input[type='radio']").change(function (e) {
            //console.log("change", e);
        });

        document.addEventListener('click', function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (target.hasAttribute('id') && target.getAttribute('id') === 'apaczka_alert_modal_close_button') {
                // hide cancel package alert modal.
                $("#apaczka_alert_modal").removeClass("active");
            }

            if ( 'apaczka_pl_geowidget_modal_cross' === target.getAttribute( 'id' ) ) {
                e.preventDefault();
                let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'none';
                }
            }

            if (target.classList.contains('apaczka_calculate_radio')) {
                if (typeof (target.value) !== 'undefined') {
                    let id = +target.value;
                    if (id === 50 || id === 86) {
                        $('#deliver_to_any_shipping_point').show();
                    } else {
                        $('#deliver_to_any_shipping_point').hide();
                    }
                }
            }

        }, false);


        $("#apaczka_load_sender_settings_btn").click(function (e) {
            e.preventDefault();
            let selectedTemplateSlug = $('#_apaczka\\[sender_template\\]').val();
            fillSenderFormByTemplate(selectedTemplateSlug)
        });


        $("#apaczka_load_package_properties_settings_btn").click(function (e) {
            e.preventDefault();
            let selectedTemplateSlug = $('#_apaczka\\[package_properties\\]\\[selected_template\\]').val();

            fillPackagePropertiesFormByTemplate(selectedTemplateSlug)
        });


        $(".apaczka_calculate_price").click(function () {
            if (!$(this).closest("form")[0].checkValidity()) {
                $(this).closest("form")[0].reportValidity();
                return false;
            }
            $(this).attr('disabled', true);
            // $(this).parent().find(".spinner_courier").hide();
            // $(this).parent().find(".spinner").hide();
            // $(this).parent().find(".spinner_calculate").addClass('is-active');
            $('#apaczka_pl_preloader').css('display', 'inline-block');
            $('.apaczka_send').css('display', 'none');

            $('div').each(
                function () {
                    var id = $(this).attr('id');
                    if (id && id.startsWith('dispath_point_')) {
                        $(this).addClass('apaczka-hidden');
                    }
                    if (id && id.startsWith('apaczka_delivery_point_id_wrapper')) {
                        $(this).addClass('apaczka-hidden');
                    }
                }
            );
            $("#apaczka-calculate-wrapper").html('');

            var data = {
                action: 'apaczka',
                order_id: $('#apaczka_pl_wc_order_id').val(),
                apaczka_action: 'calculate',
                security: apaczka_ajax_nonce,
                apaczka: {
                    sender: {},
                    receiver: {},
                    package_properties: {},
                    additional_options: {},
                }
            };

            var package_properties = $('input[id^="_apaczka[package_properties]"], select[id^="_apaczka[package_properties]"]');
            var sender = $('input[id^="_apaczka[sender]"]');
            var receiver = $('input[id^="_apaczka[receiver]"]');
            var additional_options = $('input[id^="_apaczka[additional_options]"]');
            var is_residential_sender = $('select[id="_apaczka[sender][is_residential]"]').val();
            var is_residential_receiver = $('select[id="_apaczka[receiver][is_residential]"]').val();

            sender.each(function () {
                data.apaczka.sender[$(this).data('key')] = $(this).val()
            });
            data.apaczka.sender['is_residential'] = is_residential_sender;

            receiver.each(function () {
                data.apaczka.receiver[$(this).data('key')] = $(this).val()
            });
            data.apaczka.receiver['is_residential'] = is_residential_receiver;

            package_properties.each(function () {
                data.apaczka.package_properties[$(this).data('key')] = $(this).val()
            });

            additional_options.each(function () {
                data.apaczka.additional_options[$(this).data('key')] = $(this).val()
            });

            $('#_apaczka\\[package_properties\\]\\[dispath_point_inpost\\]').click(function (e) {
                const field = $(this);
                e.preventDefault();

                console.log('alsendo_order_metabox: dispath_point_inpost_click');
                BPWidget.init(
                    document.getElementById('apaczka_pl_geowidget_modal_inner_content'),
                    {
                        callback: function (point) {
                            // console.log(point);.
                            field.val(point.code);
                            $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val(point.code);
                            let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                            map_modal.style.display = 'none';
                        },
                        posType: 'DELIVERY',
                        mapOptions: {zoom: 12},
                        codOnly: false,
                        operatorMarkers: true,
                        countryCodes: map_country_code,
                        initialAddress: receiver_city_for_map,
                        operators: [{operator: 'INPOST'}],
                        codeSearch: true
                    }
                );

                let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'flex';
                }
            });

            $('#_apaczka\\[package_properties\\]\\[dispath_point_kurier48\\]').click(function (e) {
                const field = $(this);
                e.preventDefault();

                console.log('alsendo_order_metabox: dispath_point_kurier48_click');
                BPWidget.init(
                    document.getElementById('apaczka_pl_geowidget_modal_inner_content'),
                    {
                        callback: function (point) {
                            // console.log(point);
                            field.val(point.code);
                            $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val(point.code);
                            let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                            map_modal.style.display = 'none';
                        },
                        posType: 'DELIVERY',
                        mapOptions: {zoom: 12},
                        codOnly: false,
                        operatorMarkers: true,
                        countryCodes: map_country_code,
                        initialAddress: receiver_city_for_map,
                        operators: [{operator: 'POCZTA'}],
                        codeSearch: true
                    }
                );

                let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'flex';
                }
            });

            $('#_apaczka\\[package_properties\\]\\[dispath_point_ups\\]').click(function (e) {
                const field = $(this);
                e.preventDefault();

                console.log('alsendo_order_metabox: dispath_point_ups_click');
                BPWidget.init(
                    document.getElementById('apaczka_pl_geowidget_modal_inner_content'),
                    {
                        callback: function (point) {
                            // console.log(point);
                            field.val(point.code);
                            $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val(point.code);
                            let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                            map_modal.style.display = 'none';
                        },
                        posType: 'DELIVERY',
                        mapOptions: {zoom: 12},
                        codOnly: false,
                        operatorMarkers: true,
                        countryCodes: map_country_code,
                        initialAddress: receiver_city_for_map,
                        operators: [{operator: 'UPS'}],
                        codeSearch: true
                    }
                );

                let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'flex';
                }

            });

            $('#_apaczka_dispath_point_dpd').click(function (e) {
                const field = $(this);
                e.preventDefault();

                console.log('alsendo_order_metabox: dispath_point_dpd_click');
                BPWidget.init(
                    document.getElementById('apaczka_pl_geowidget_modal_inner_content'),
                    {
                        callback: function (point) {
                            // console.log(point);
                            field.val(point.code);
                            $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val(point.code);
                            let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                            map_modal.style.display = 'none';
                        },
                        posType: 'DELIVERY',
                        mapOptions: {zoom: 12},
                        codOnly: false,
                        operatorMarkers: true,
                        countryCodes: map_country_code,
                        initialAddress: receiver_city_for_map,
                        operators: [{operator: 'DPD'}],
                        codeSearch: true
                    }
                );

                let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'flex';
                }
            });

            $('#_apaczka\\[delivery_point_id\\]').click(function (e) {
                let field = $(this);
                e.preventDefault();
                let cod_amount_defined = is_cod_amount_defined();
                let is_cod_only        = false;
                if ( cod_amount_defined ) {
                    is_cod_only = true;
                }


                console.log('apaczka_calculate_selected_service:');
                console.log(apaczka_calculate_selected_service);

                let operatorsArray = [];
                operatorsArray = [serviceIdToApmSupplierId( parseInt( apaczka_calculate_selected_service ) )];

                var operators = operatorsArray.map(
                    function (operator) {
                        return createOperator('operators - ' + operator, operator);
                    }
                ).filter(Boolean);
                operators = operators.length ? operators : null;

                console.log('operators');
                console.log(operators);

                let shipping_country = document.getElementById("_apaczka[receiver][country_code]").value;

                BPWidget.init(
                    document.getElementById('apaczka_pl_geowidget_modal_inner_content'),
                    {
                        callback: function (point) {
                            // console.log(point);
                            console.log(point.code);
                            field.val(point.code);
                            // $('#_apaczka_apm_access_point_id').val(record.foreign_access_point_id);
                            $('input[id=_apaczka_apm_access_point_id]').each(
                                function (ind, elem) {
                                    $(elem).val(point.code);
                                }
                            );

                            // $('#_apaczka_apm_supplier').val(record.supplier);
                            $('input[id=_apaczka_apm_supplier]').each(
                                function (ind, elem) {
                                    $(elem).val(point.operator);
                                }
                            );

                            // $('#_apaczka_apm_name').val(record.name);
                            $('input[id=_apaczka_apm_name]').each(
                                function (ind, elem) {
                                    $(elem).val(point.description);
                                }
                            );

                            // $('#_apaczka_apm_foreign_access_point_id').val(record.foreign_access_point_id);
                            $('input[id=_apaczka_apm_foreign_access_point_id]').each(
                                function (ind, elem) {
                                    $(elem).val(point.code);
                                }
                            );

                            // $('#_apaczka_apm_street').val(record.street);
                            $('input[id=_apaczka_apm_street]').each(
                                function (ind, elem) {
                                    $(elem).val(point.street);
                                }
                            );

                            // $('#_apaczka_apm_city').val(record.city);
                            $('input[id=_apaczka_apm_city]').each(
                                function (ind, elem) {
                                    $(elem).val(point.city);
                                }
                            );

                            // $('#_apaczka_apm_postal_code').val(record.postal_code);
                            $('input[id=_apaczka_apm_postal_code]').each(
                                function (ind, elem) {
                                    $(elem).val(point.postalCode);
                                }
                            );

                            // $('#_apaczka_apm_country_code').val(record.country_code);
                            $('input[id=_apaczka_apm_country_code]').each(
                                function (ind, elem) {
                                    $(elem).val('PL');
                                }
                            );

                            let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                            map_modal.style.display = 'none';
                        },
                        posType: 'DELIVERY',
                        mapOptions: {zoom: 12},
                        codOnly: is_cod_only,
                        operatorMarkers: true,
                        countryCodes: shipping_country,
                        initialAddress: receiver_city_for_map,
                        operators: operators,
                        codeSearch: true
                    }
                );

                let map_modal = document.getElementById('apaczka_pl_geowidget_modal_dynamic');
                if (typeof map_modal != 'undefined' && map_modal !== null) {
                    map_modal.style.display = 'flex';
                }
            });

            $.post(ajaxurl, data, function (response) {

                $('#apaczka_pl_preloader').css('display', 'none');
                $('.apaczka_calculate_price').attr('disabled', false);


                if (response != 0) {
                    response = JSON.parse(response);
                    console.log(response.status);
                    //console.log(response);
                    if (response.status === 'ok') {
                        $('.apaczka_send').css('display', 'block');
                        $('#apaczka_error').html('');
                        $("#apaczka-calculate-wrapper").html($.parseHTML(response.calculate_html));
                        $("#apaczka_send").prop("disabled", false);
                        //$('.apaczka_set_order_completed-wrapper').removeClass('apaczka-hidden');
                        changeShippingMethodTriggers($('#_apaczka\\[package_properties\\]\\[shipping_method\\]').val())

                        // $('.apaczka-calculate-item[data-item="0"]').click();
                    } else {
                        console.log(response.status);
                        console.log(response.error_messages);

                        $("#apaczka-calculate-wrapper").html('');
                        $('#apaczka_error').html(response.error_messages);
                        $("#apaczka_send").prop("disabled", true);
                        //$('.apaczka_set_order_completed-wrapper').addClass('apaczka-hidden');

                    }
                    $(this).parent().find(".spinner").removeClass('is-active');
                    $(this).parent().find(".spinner_calculate").show();
                    $('.apaczka_calculate_price').attr('disabled', false);

                    return false;
                } else {
                    //console.log('Invalid response.');
                    $('#apaczka_error').html('Invalid response.');
                }


            });

            return false;
        });


        $(document).on("click", '.apaczka_calculate_radio', function (event) {
            apaczka_calculate_selected_service = $('input[name="apaczka_calculate_radio"]:checked').val();
            handleCalculateDynamicFields(parseInt(apaczka_calculate_selected_service))
        });

        $(document).on("click", '#apaczka_get_waybill', function (event) {
            event.preventDefault();
            let apaczka_order_created_id = $('#apaczka_pl_apaczka_order_created').val();
            if (typeof apaczka_order_created_id != 'undefined' && apaczka_order_created_id !== null) {
                apaczka_waybill_id = apaczka_order_created_id;
                let apaczka_get_waybill_link = document.location.toString() + '&apaczka_get_waybill=' + apaczka_waybill_id;
                window.location.href = apaczka_get_waybill_link;
            }
        });


        $("#apaczka_cancel").click(function () {

            const cancelled_only_on_apaczka_pl = new Array('260', '220', '250', '230', '240', '150');

            let service_id = $('#apaczka_choosed_carrier_id').attr('data-id');
            let service_name = $('#apaczka_choosed_carrier_id').text();

            if (service_id) {
                if ($.inArray(service_id, cancelled_only_on_apaczka_pl) !== -1) {
                    $('#apaczka_alert_modal').addClass('active');
                    return false;
                }
            }

            $(this).attr('disabled', true);
            $(this).parent().find(".spinner_courier").hide();
            $(this).parent().find(".spinner").hide();
            $(this).parent().find(".spinner_calculate").addClass('is-active');

            var data = {
                action: 'apaczka',
                order_id: $('#apaczka_pl_wc_order_id').val(),
                apaczka_action: 'cancel_package',
                security: apaczka_ajax_nonce,
            };

            $.post(ajaxurl, data, function (response) {
                if (response != 0) {
                    response = JSON.parse(response);
                    console.log(response.status);
                    if (response.status === 'ok') {
                        window.location.reload();
                    } else {
                        console.log(response.status);
                        console.log(response.error_messages);
                        $('#apaczka_error').html(response.error_messages);
                        $('#apaczka_cancel').attr('disabled', false);

                    }
                    $(this).parent().find(".spinner").removeClass('is-active');
                    $(this).parent().find(".spinner_calculate").show();


                    return false;
                } else {
                    $('#apaczka_cancel').attr('disabled', false);
                    $('#apaczka_error').html('Invalid response.');
                }


            });

        });

        $(document).on("click", '#apaczka_download_turn_in', function (event) {
            var data = {
                action: 'apaczka',
                order_id: $('#apaczka_pl_wc_order_id').val(),
                apaczka_action: 'download_turn_in',
                security: apaczka_ajax_nonce,
            };

            $.post(ajaxurl, data, function (response) {
                if (response != 0) {
                    response = JSON.parse(response);
                    console.log(response.status);
                    if (response.status === 'ok') {
                        $('#apaczka_error').html('');
                        var win = window.open();
                        win.document.write('<iframe src="data:application/pdf;base64,' + response.base64 + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                    } else {
                        console.log(response.status);
                        console.log(response.error_messages);


                        $('#apaczka_error').html(response.error_messages);
                    }
                    $(this).parent().find(".spinner").removeClass('is-active');
                    $(this).parent().find(".spinner_calculate").show();
                    $('.apaczka_calculate_price').attr('disabled', false);

                    return false;
                } else {
                    $('#apaczka_error').html('Invalid response.');
                }


            });


            return false;
        });

        $("#apaczka_send").click(function () {

            if (false !== apaczka_dispath_point_handler_to_validate) {
                if ('' === apaczka_dispath_point_handler_to_validate.val()) {
                    alert("Punkt nadania nie może być pusty.");
                    return false;
                }
            }

            let $delivery_point_id;
            if ($('#apaczka_delivery_point_id_wrapper').hasClass('apaczka-hidden')) {
                $delivery_point_id = ''
            } else {
                $delivery_point_id = $('#_apaczka\\[delivery_point_id\\]').val();
                if ('' === $delivery_point_id) {
                    alert("Punkt odbioru nie może być pusty.");
                    return false;
                }
            }


            if (!$(this).closest("form")[0].checkValidity()) {
                $(this).closest("form")[0].reportValidity();
                return false;
            }

            $(this).attr('disabled', true);
            $(this).parent().find(".spinner_courier").hide();
            $(this).parent().find(".spinner").hide();
            $(this).parent().find(".spinner_calculate").addClass('is-active');


            var data = {
                action: 'apaczka',
                order_id: $('#apaczka_pl_wc_order_id').val(),
                apaczka_action: 'create_package',
                security: apaczka_ajax_nonce,
                //apaczka_order_status_completed: false,
                apaczka: {
                    sender: {},
                    receiver: {},
                    package_properties: {},
                    additional_options: {},
                    delivery_point: {},
                    delivery_point_id: $delivery_point_id,
                    selected_service: apaczka_calculate_selected_service,
                }
            };

            var package_properties = $('input[id^="_apaczka[package_properties]"], select[id^="_apaczka[package_properties]"]');
            var sender = $('input[id^="_apaczka[sender]"]');


            var additional_options = $('input[id^="_apaczka[additional_options]"]');
            var receiver = $('input[id^="_apaczka[receiver]"]');
            var delivery_point = $('input[name^="_apaczka[delivery_point]"]');
            var is_residential_sender = $('select[id="_apaczka[sender][is_residential]"]').val();
            var is_residential_receiver = $('select[id="_apaczka[receiver][is_residential]"]').val();

            receiver.each(function () {
                data.apaczka.receiver[$(this).data('key')] = $(this).val()
            });
            data.apaczka.receiver['is_residential'] = is_residential_receiver;

            sender.each(function () {
                data.apaczka.sender[$(this).data('key')] = $(this).val()
            });
            data.apaczka.sender['is_residential'] = is_residential_sender;

            data.apaczka.sender['apm_foreign_access_point_id'] = $('#_apaczka\\[sender\\]\\[apm_foreign_access_point_id\\]').val();
            // fix #25653
            if (apaczka_calculate_selected_service === '42') {
                data.apaczka.sender['apm_foreign_access_point_id'] = '';
            }

            // fix #25629
            let shipping_method = $('#_apaczka\\[package_properties\\]\\[shipping_method\\]').val();
            if (apaczka_calculate_selected_service === '41' && 'COURIER' === shipping_method) {
                data.apaczka.sender['apm_foreign_access_point_id'] = '';
            }

            package_properties.each(function () {
                data.apaczka.package_properties[$(this).data('key')] = $(this).val();
            });

            additional_options.each(function () {
                data.apaczka.additional_options[$(this).data('key')] = $(this).val();
            });

            delivery_point.each(function () {
                data.apaczka.delivery_point[$(this).data('key')] = $(this).val();
            });

            console.log(delivery_point);

            //data.apaczka_order_status_completed = $('input[name="apaczka_set_order_completed"]').is(':checked');

            $.post(ajaxurl, data, function (response) {
                if (response != 0) {
                    response = JSON.parse(response);
                    if (response.status === 'ok') {
                        window.location.reload();
                    } else {
                        console.log(response.status);
                        console.log(response.error_messages);
                        $('#apaczka_error').html(response.error_messages);
                        $('.apaczka_send').attr('disabled', false);

                    }
                    $(this).parent().find(".spinner").removeClass('is-active');
                    $(this).parent().find(".spinner_calculate").show();


                    return false;
                } else {
                    //console.log('Invalid response.');
                    $('#apaczka_error').html('Invalid response.');
                    $('.apaczka_send').attr('disabled', false);
                }
            });


            return false;
        });
    });
})(jQuery);
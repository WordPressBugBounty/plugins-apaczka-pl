(function ($) {

	let apaczka_parcel_type_handle = '';
	let apaczka_parcel_depth       = '';
	let apaczka_parcel_width       = '';
	let apaczka_parcel_height      = '';

	let map_sender_country         = 'PL';
	let map_sender_initial_address = '';

	function changeParcelTypeActions(type) {
		switch (type) {
			case 'europalette':
				apaczka_parcel_width.val( 120 );
				apaczka_parcel_depth.val( 80 );
				apaczka_parcel_depth.prop( 'readonly', true );
				apaczka_parcel_width.prop( 'readonly', true );

				if (apaczka_parcel_height.val() > 220) {
					apaczka_parcel_height.val( 220 );
				}

				apaczka_parcel_height.prop( 'max', 220 );
				break;
			case 'palette_60x80':
				apaczka_parcel_width.val( 60 );
				apaczka_parcel_depth.val( 80 );
				apaczka_parcel_depth.prop( 'readonly', true );
				apaczka_parcel_width.prop( 'readonly', true );

				if (apaczka_parcel_height.val() > 220) {
					apaczka_parcel_height.val( 220 )
				}

				apaczka_parcel_height.prop( 'max', 220 );
				break;
			case 'palette_120x100':
				apaczka_parcel_depth.val( 100 );
				apaczka_parcel_width.val( 120 );
				apaczka_parcel_depth.prop( 'readonly', true );
				apaczka_parcel_width.prop( 'readonly', true );

				if (apaczka_parcel_height.val() > 220) {
					apaczka_parcel_height.val( 220 )
				}

				apaczka_parcel_height.prop( 'max', 220 );
				break;
			case 'palette_120x120':
				apaczka_parcel_depth.val( 120 );
				apaczka_parcel_width.val( 120 );
				apaczka_parcel_depth.prop( 'readonly', true );
				apaczka_parcel_width.prop( 'readonly', true );

				if (apaczka_parcel_height.val() > 220) {
					apaczka_parcel_height.val( 220 )
				}

				apaczka_parcel_height.prop( 'max', 220 );
				break;
			default:
				apaczka_parcel_depth.prop( 'readonly', false );
				apaczka_parcel_width.prop( 'readonly', false );
				apaczka_parcel_height.removeAttr( 'max' )
		}
	}

	function validateShippingPointSelected() {

		const PocztaKurier48              = 160;
		const PocztaKurier48Punkty        = 162;
		const AllegroSMARTKurier48Punkty  = 164;
		const AllegroSMARTPocztaKurier48  = 165;
		const AllegroSMARTPaczkomatInPost = 40;
		const PaczkomatInPost             = 41;
		const UPSAPPunktDrzwi             = 13;
		const UPSAPPunktPunkt             = 14;
		const DPD_kurier                  = 21;

		let selectedService              = parseInt( $( '#apaczka_woocommerce_settings_general_service' ).val() );
		let dispathPointInpostSelected   = $( '#apaczka_woocommerce_settings_general_dispath_point_inpost' ).val() !== '';
		let dispathPointKurier48Selected = $( '#apaczka_woocommerce_settings_general_dispath_point_kurier48' ).val() !== '';
		let dispathPointUpsSelected      = $( '#apaczka_woocommerce_settings_general_dispath_point_ups' ).val() !== '';
		let dispathPointDPDSelected      = $( '#apaczka_woocommerce_settings_general_dispath_point_dpd' ).val() !== '';

		let error = null;

		if ((selectedService === PocztaKurier48
				|| selectedService === PocztaKurier48Punkty
				|| selectedService === AllegroSMARTKurier48Punkty
				|| selectedService === AllegroSMARTPocztaKurier48
			) &&
			! dispathPointKurier48Selected
		) {
			error = '#apaczka_woocommerce_settings_general_dispath_point_kurier48';
		}

		if ((selectedService === AllegroSMARTPaczkomatInPost
				|| selectedService === PaczkomatInPost
			) &&
			! dispathPointInpostSelected
		) {
			error = '#apaczka_woocommerce_settings_general_dispath_point_inpost';
		}

		if ((selectedService === UPSAPPunktPunkt
				|| selectedService === UPSAPPunktPunkt
			) &&
			! dispathPointUpsSelected
		) {
			error = '#apaczka_woocommerce_settings_general_dispath_point_ups';
		}

		if (error !== null) {
			$( error ).addClass( 'apaczka_missing_field' );

			if (error !== '#apaczka_woocommerce_settings_general_dispath_point_ups') {
				$( '#apaczka_woocommerce_settings_general_dispath_point_ups' ).removeClass( 'apaczka_missing_field' );
			}
			if (error !== '#apaczka_woocommerce_settings_general_dispath_point_inpost') {
				$( '#apaczka_woocommerce_settings_general_dispath_point_inpost' ).removeClass( 'apaczka_missing_field' );
			}
			if (error !== '#apaczka_woocommerce_settings_general_dispath_point_kurier48') {
				$( '#apaczka_woocommerce_settings_general_dispath_point_kurier48' ).removeClass( 'apaczka_missing_field' );
			}
			if (error !== '#apaczka_woocommerce_settings_general_dispath_point_dpd') {
				$( '#apaczka_woocommerce_settings_general_dispath_point_dpd' ).removeClass( 'apaczka_missing_field' );
			}

			$( '.button-primary.woocommerce-save-button' ).prop( 'disabled', 'disabled' );
		} else {
			$( '#apaczka_woocommerce_settings_general_dispath_point_kurier48' ).removeClass( 'apaczka_missing_field' );
			$( '#apaczka_woocommerce_settings_general_dispath_point_ups' ).removeClass( 'apaczka_missing_field' );
			$( '#apaczka_woocommerce_settings_general_dispath_point_inpost' ).removeClass( 'apaczka_missing_field' );
			$( '#apaczka_woocommerce_settings_general_dispath_point_dpd' ).removeClass( 'apaczka_missing_field' );
			$( '.button-primary.woocommerce-save-button' ).prop( 'disabled', '' );
		}

	}

	$( document ).ready(
		function () {

			if ($( '#apaczka_woocommerce_settings_general_parcel_type' ).length) {
				apaczka_parcel_type_handle = $( '#apaczka_woocommerce_settings_general_parcel_type' );
				apaczka_parcel_depth       = $( '#apaczka_woocommerce_settings_general_package_depth' );
				apaczka_parcel_width       = $( '#apaczka_woocommerce_settings_general_package_width' );
				apaczka_parcel_height      = $( '#apaczka_woocommerce_settings_general_package_height' );

				changeParcelTypeActions( apaczka_parcel_type_handle.val() );

				apaczka_parcel_type_handle.change(
					function (e) {
						changeParcelTypeActions( $( this ).val() )
					}
				);

			}

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

			map_sender_initial_address = $( '#apaczka_woocommerce_settings_general_sender_city' ).val();
			$( '#apaczka_woocommerce_settings_general_sender_city' ).on(
				'keyup',
				function () {
					map_sender_initial_address = $( this ).val();
				}
			);

			//validation postal code
			let sender_zip_code = $( 'input[name="apaczka_woocommerce_settings_general_sender_postal_code"]' );
			if (typeof sender_zip_code != 'undefined') {
				$( sender_zip_code ).mask( "99-999", {placeholder: "XX-XXX"} );
			}

			let iban = $( 'input[name="apaczka_woocommerce_settings_general_sender_bank_account_number"]' );
			if (typeof iban != 'undefined') {
				$( iban ).mask(
					'99 9999 9999 9999 9999 9999 9999',
					{
						placeholder: '__ ____ ____ ____ ____ ____ ____'
					}
				);
			}

			let sender_phone_number = $( 'input[name="apaczka_woocommerce_settings_general_sender_phone"]' );
			/*
			if(typeof sender_phone_number != 'undefined' ) {
			$(sender_phone_number).mask("999999999",{placeholder:" "});
			}
			*/

			$( "#apaczka_woocommerce_settings_general_service" ).change(
				function (e) {
					validateShippingPointSelected()
				}
			);
			$( "#apaczka_woocommerce_settings_general_dispath_point_ups" ).change(
				function (e) {
					validateShippingPointSelected();
				}
			);
			$( "#apaczka_woocommerce_settings_general_dispath_point_kurier48" ).change(
				function (e) {
					validateShippingPointSelected();
				}
			);
			$( "#apaczka_woocommerce_settings_general_dispath_point_inpost" ).change(
				function (e) {
					validateShippingPointSelected();
				}
			);
			$( "#apaczka_woocommerce_settings_general_dispath_point_dpd" ).change(
				function (e) {
					validateShippingPointSelected();
				}
			);
		}
	);

	document.addEventListener(
		'click',
		function (e) {
			e          = e || window.event;
			var target = e.target || e.srcElement;
			if ( target.hasAttribute( 'id' ) ) {

				if ( 'apaczka_pl_geowidget_modal_cross' === target.getAttribute( 'id' ) ) {
					e.preventDefault();
					let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
					if (typeof map_modal != 'undefined' && map_modal !== null) {
						map_modal.style.display = 'none';
					}
				}

				if ( 'apaczka_woocommerce_settings_general_dispath_point_dpd' === target.getAttribute( 'id' )
				|| 'apaczka_woocommerce_settings_general_dispath_point_ups' === target.getAttribute( 'id' )
				|| 'apaczka_woocommerce_settings_general_dispath_point_kurier48' === target.getAttribute( 'id' )
				|| 'apaczka_woocommerce_settings_general_dispath_point_inpost' === target.getAttribute( 'id' )
				) {

					const field = target;
					e.preventDefault();
					console.log( 'admin: ' + target.getAttribute( 'id' ) );
					console.log( map_sender_initial_address );
					let operators = '';

					if ( 'apaczka_woocommerce_settings_general_dispath_point_dpd' === target.getAttribute( 'id' ) ) {
						operators = [{ operator: 'DPD' }];
					}
					if ( 'apaczka_woocommerce_settings_general_dispath_point_ups' === target.getAttribute( 'id' ) ) {
						operators = [{ operator: 'UPS' }];
					}
					if ( 'apaczka_woocommerce_settings_general_dispath_point_kurier48' === target.getAttribute( 'id' ) ) {
						operators = [{ operator: 'POCZTA' }];
					}
					if ( 'apaczka_woocommerce_settings_general_dispath_point_inpost' === target.getAttribute( 'id' ) ) {
						operators = [{ operator: 'INPOST' }];
					}

					BPWidget.init(
						document.getElementById( 'apaczka_pl_geowidget_modal_inner_content' ),
						{
							callback: function (point) {
								console.log( point );
								field.value             = point.code;
								let map_modal           = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
								map_modal.style.display = 'none';
							},
							language: apaczka_admin.lang,
							posType: 'DELIVERY',
							mapOptions: { zoom: 12 },
							codOnly: false,
							operatorMarkers: true,
							countryCodes: map_sender_country,
							initialAddress: map_sender_initial_address,
							operators: operators,
							codeSearch: true,
							is_for_sender: true
						}
					);

					let map_modal = document.getElementById( 'apaczka_pl_geowidget_modal_dynamic' );
					if (typeof map_modal != 'undefined' && map_modal !== null) {
							map_modal.style.display = 'flex';
					}
				}

			}

		},
		false
	);

})( jQuery );
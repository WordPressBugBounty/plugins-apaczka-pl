import { useEffect, useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
const { ExperimentalOrderMeta } = wc.blocksCheckout;

export const Block = ( { checkoutExtensionData, extensions } ) => {

	let isApaczkaPlShippingMethod     = false;
	let selectedShippingInstanceID = null;

	const [apaczkaPlDeliveryPoint, setApaczkaPlDeliveryPoint] = useState( "" );
	const { setExtensionData }                          = checkoutExtensionData;
	const validationErrorId                             = 'apaczka-pl-delivery-point-error';
	const { setValidationErrors, clearValidationError } = useDispatch(
		'wc/store/validation'
	);

	// Get current shipping options.
	let shippingRates = useSelect(
		(select) => {
			const store            = select( 'wc/store/cart' );
			return store.getShippingRates();
		}
	);

	// State to track pickup selection with both store and DOM monitoring.
	const [isPickupSelected, setIsPickupSelected] = useState(false);

	// Get pickup selection status from store.
	const storePickupSelected = useSelect(
		(select) => {
			const checkoutStore = select('wc/store/checkout');
			return checkoutStore.prefersCollection();
		},
		[] // Dependencies array - will re-run when store changes.
	);

	// Update local state when store changes.
	useEffect(() => {
		setIsPickupSelected(storePickupSelected);
	}, [storePickupSelected]);

	// DOM listener for immediate Ship/Pickup changes.
	useEffect(() => {
		const handleShippingMethodChange = () => {
			const container = document.getElementById('shipping-method');
			if (!container) return;

			const allOptions = container.querySelectorAll('.wc-block-checkout__shipping-method-option');
			const selectedOption = container.querySelector('.wc-block-checkout__shipping-method-option--selected');

			if (selectedOption && allOptions.length > 0) {
				// Find the index of the selected option
				const selectedIndex = Array.from(allOptions).indexOf(selectedOption);
				const isPickup = selectedIndex === 1; // Ship = 0, Pickup = 1

				console.log('Selected shipping method index:', selectedIndex);
				console.log('isPickup shipping method:', isPickup);

				if (isPickup) {
					clearValidationError(validationErrorId);
				}
				setIsPickupSelected(isPickup);
			}
		};

		// Initial check.
		handleShippingMethodChange();

		// Listen for clicks on shipping method container.
		const container = document.getElementById('shipping-method');
		if (container) {
			container.addEventListener('click', (event) => {
				// Small delay to allow DOM to update.
				setTimeout(handleShippingMethodChange, 100);
			});

			// Also listen for any changes in the container
			const observer = new MutationObserver(() => {
				handleShippingMethodChange();
			});

			observer.observe(container, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class']
			});

			return () => {
				observer.disconnect();
			};
		}
	}, []);

	function useApaczkaPlConfiguredMethods() {
		if (window.apaczka_block && window.apaczka_block.map_config) {
			return window.apaczka_block.map_config;
		}
		return [];
	}

	if (typeof shippingRates != 'undefined' && shippingRates !== null) {
		let firstObjKey = shippingRates[Object.keys( shippingRates )[0]];
		if (typeof firstObjKey != 'undefined' && firstObjKey !== null) {
			if ( firstObjKey.hasOwnProperty( 'shipping_rates' ) ) {
				const shippingRatesArray           = firstObjKey.shipping_rates;
				const shippingRatesExcludingPickup = [];
				const configured_shipping_methods = useApaczkaPlConfiguredMethods();
				if (typeof shippingRatesArray != 'undefined' && shippingRatesArray !== null) {
					for (let method of shippingRatesArray) {
						if (method.method_id === 'pickup_location') {
							continue;
						}
						if (method.selected === true) {
							selectedShippingInstanceID   = method.instance_id;
							let selectedShippingMethodID = method.method_id;
							let ship_method_data = configured_shipping_methods[selectedShippingInstanceID];
							if (typeof ship_method_data != 'undefined' && ship_method_data !== null) {
								isApaczkaPlShippingMethod = true;
							}
						}
						shippingRatesExcludingPickup.push( method );
					}


					if ( ! selectedShippingInstanceID && shippingRatesExcludingPickup.length > 0 ) {
						const shipping_section = document.getElementsByClassName( 'wc-block-components-shipping-rates-control' )[0];
						if (typeof shipping_section != 'undefined' && shipping_section !== null) {
							const checkedRadioControl = shipping_section.querySelector( 'input[name^="radio-control-"]:checked' );
							if (typeof checkedRadioControl != 'undefined' && checkedRadioControl !== null) {
								let shipping_method_id = checkedRadioControl.getAttribute( 'id' );
								if (typeof shipping_method_id != 'undefined' && shipping_method_id !== null) {
									let shipping_method_data = shipping_method_id.split( ":" );

									selectedShippingInstanceID = shipping_method_data[shipping_method_data.length - 1];

									let selectedShippingMethodRadioID = shipping_method_data[0];
									let ship_method_data = configured_shipping_methods[selectedShippingInstanceID];
									if (typeof ship_method_data != 'undefined' && ship_method_data !== null) {
										isApaczkaPlShippingMethod = true;
									}
								}
							}
						}
					}
				}
			}
		}
	}

	// Effect to handle validation whenever relevant values change.
	useEffect(
		() => {
			// Set extension data.
			setExtensionData( "apaczka_pl", "apaczka-point", apaczkaPlDeliveryPoint );
			// Validation logic.
			if ( apaczkaPlDeliveryPoint || ! isApaczkaPlShippingMethod || isPickupSelected ) {
				clearValidationError( validationErrorId );
			} else {
				setValidationErrors(
					{
						[validationErrorId]: {
							message: __( 'Parcel locker must be choosen.', 'apaczka-pl' ),
							hidden: true,
						},
					} );
			}
		},
		[apaczkaPlDeliveryPoint, isPickupSelected, isApaczkaPlShippingMethod, setExtensionData, clearValidationError, setValidationErrors]
	);


	// Change Delivery Point input value.
	const handleDeliveryPointChange = (event) => {
		const selectedId            = event.target.value;
		setApaczkaPlDeliveryPoint( selectedId );
	};

	return (
		<>
			{isApaczkaPlShippingMethod && ! isPickupSelected && (
				<>
					<button className="button alt apaczka_pl_geowidget_block" id="apaczka_pl_geowidget_block">
						{__( 'Select point', 'apaczka-pl' )}
					</button>
					<div id="apaczka_selected_point_data_wrap" className="apaczka_selected_point_data_wrap"
						style={{display: 'none'}}>
					</div>
					<ExperimentalOrderMeta>
						<PointLockerInput
							apaczkaPlDeliveryPoint = {apaczkaPlDeliveryPoint}
							handleDeliveryPointChange = {handleDeliveryPointChange}
						/>						
					</ExperimentalOrderMeta>
				</>
			)}
		</>
	);
};

function PointLockerInput({ handleDeliveryPointChange, apaczkaPlDeliveryPoint }) {
	return (
		<div className="apaczka-delivery-point-wrap" style={{ display: 'none' }}>
			<input
				value    = {apaczkaPlDeliveryPoint}
				type     = "text"
				id       = "apaczka-point"
				onChange = {handleDeliveryPointChange}
				required
			/>
		</div>
	);
}


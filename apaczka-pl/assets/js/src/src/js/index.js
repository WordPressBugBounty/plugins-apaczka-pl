/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

const render = () => {};

registerPlugin( 'apaczka_pl_block', {
	render,
	scope: 'woocommerce-checkout',
} );

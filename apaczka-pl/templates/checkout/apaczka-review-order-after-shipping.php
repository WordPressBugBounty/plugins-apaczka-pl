<?php

use Inspire_Labs\Apaczka_Woocommerce\Plugin;

$parcel_machine_selected = false;
$selected                = '';


?>
<tr class="apaczka-parcel-machine">
	<th class="apaczka-parcel-machine-label">
		<?php esc_html__( 'Select point', 'apaczka-pl' ); ?>
	</th>
	<td class="apaczka-parcel-machine-select">
		<?php if ( defined( 'DOING_AJAX' ) && true === DOING_AJAX ) : ?>
			<input
                type="button"
                class="button alt"
                name="apaczka_pl_geowidget_classic"
                id="apaczka_pl_geowidget_classic"
                value="<?php echo esc_html__( 'Select point', 'apaczka-pl' ); ?>"
                data-value="<?php echo esc_html__( 'Select point', 'apaczka-pl' ); ?>"
			>

			<div id="selected-parcel-machine" class="apaczka-hidden">
				<div><span class="font-height-600">
				<?php echo esc_html__( 'Selected Parcel Locker:', 'apaczka-pl' ); ?>
				</span></div>
				<span class="italic" id="selected-parcel-machine-id"></span>
				<span class="italic" id="selected-parcel-machine-desc"></span>
			</div>

			<input type="hidden" id="apm_access_point_id" name="apm_access_point_id"/>
			<input type="hidden" id="apm_supplier" name="apm_supplier"/>
			<input type="hidden" id="apm_name" name="apm_name"/>
			<input type="hidden" id="apm_foreign_access_point_id" name="apm_foreign_access_point_id"/>
			<input type="hidden" id="apm_street" name="apm_street"/>
			<input type="hidden" id="apm_city" name="apm_city"/>
			<input type="hidden" id="apm_postal_code" name="apm_postal_code"/>
			<input type="hidden" id="apm_country_code" name="apm_country_code"/>


		<?php else : ?>

		<?php endif ?>


	</td>
</tr>

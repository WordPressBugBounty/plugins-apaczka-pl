<?php

namespace Inspire_Labs\Apaczka_Woocommerce;

use Exception;
use Inspire_Labs\Apaczka_Woocommerce\Global_Settings_Integration;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Web_Api_V2
 */
class Web_Api_V2 {

	/**
	 * @var self
	 */
	protected static $instance;

	/**
	 * API_URL
	 */
	const API_URL = 'https://www.apaczka.pl/api/v2/';

	/**
	 * SIGN_ALGORITHM
	 */
	const SIGN_ALGORITHM = 'sha256';

	/**
	 * EXPIRES
	 */
	const EXPIRES = '+20min';

	/**
	 * SECONDS_24H
	 */
	const SECONDS_24H = 86400;

	/**
	 * SERVICE_STRUCTURE_CACHE_OPTION
	 */
	const SERVICE_STRUCTURE_CACHE_OPTION = Plugin::APP_PREFIX . '_SC_CACHE';

	/**
	 * SERVICE_STRUCTURE_CACHE_TIMESTAMP_OPTION
	 */
	const SERVICE_STRUCTURE_CACHE_TIMESTAMP_OPTION
		= Plugin::APP_PREFIX . '_SC_CACHE_TIMESTAMP';


	/**
	 * App id
	 *
	 * @var false|mixed|null
	 */
	public $app_id;

	/**
	 *  App secret
	 *
	 * @var false|mixed|null
	 */
	public $app_secret;

	/**
	 * Cache period
	 *
	 * @var float|int
	 */
	protected $cache_period = DAY_IN_SECONDS;


	/**
	 * Contstructor
	 */
	public function __construct() {
		$this->app_id     = trim( Plugin::get_option( 'app_id' ) );
		$this->app_secret = trim( Plugin::get_option( 'app_secret' ) );
	}

	/**
	 * WP remote post
	 *
	 * @param string $route $route.
	 * @param mixed  $data $data.
	 *
	 * @throws Exception Exception.
	 */
	private function wp_remote_post( $route, $data = null ) {

		$current_plugin_version = apaczka()->get_plugin_version();

		$result = wp_remote_post(
			self::API_URL . $route,
			array(
				'body'      => http_build_query( $this->buildRequest( $route, $data ) ),
				'method'    => 'POST',
				'sslverify' => true,
				'timeout'   => 30,
				'headers'   => array(
					'plugin-source' => 'apaczka-woo-2.0-version: ' . $current_plugin_version,
				),
			)
		);

		if ( ! $result || $result instanceof WP_Error ) {
			$error_msg = $result->get_error_message();
			throw new Exception( esc_html( $error_msg ) );
		}

		return wp_remote_retrieve_body( $result );
	}

	/**
	 * Request
	 *
	 * @param string $route $route.
	 * @param mixed  $data $data.
	 *
	 * @return mixed
	 */
	private function request( $route, $data = null ) {

		if ( empty( $this->app_id ) || empty( $this->app_secret ) ) {
			return false;
		}

		try {
			ob_start();
			var_dump( $data );
			$debug_dump = ob_get_clean();

			$response = $this->wp_remote_post( $route . '/', $data );

		} catch ( Exception $e ) {

			if ( defined( 'WOOCOMMERCE_APACZKA_DEBUG' ) ) {
				$debug_extra_info = '<br>Submitted data:<br><pre>' . $debug_dump . '</pre>';
			} else {
				$debug_extra_info = '';
			}

			( new Alerts() )->add_error(
				$this->prepare_error_message(
					sanitize_text_field( $route ),
					'APACZKA.PL: ' . $e->getMessage() . $debug_extra_info
				),
				$route
			);

			return false;
		}

		$response_decoded = json_decode( $response );
		ob_start();
		var_dump( $response );
		$raw_response = ob_get_clean();

		ob_start();
		var_dump( $this->buildRequest( $route, $data ) );
		$raw_request_data = ob_get_clean();

		if ( ! is_object( $response_decoded )
			|| ! property_exists( $response_decoded, 'status' )
			|| ! property_exists( $response_decoded, 'message' )
			|| ! property_exists( $response_decoded, 'response' ) ) {

			if ( defined( 'WOOCOMMERCE_APACZKA_DEBUG' ) ) {
				$debug_extra_info = '<br>Raw response: <br>' . $raw_response . '<br>Submitted data:<br><pre>' . $debug_dump . '</pre>';
			} else {
				$debug_extra_info = '';
			}

			( new Alerts() )->add_error(
				$this->prepare_error_message(
					$route,
					'Response cannot be decoded' . $debug_extra_info
				),
				$route
			);

			return false;
		}

		$status = (int) $response_decoded->status;

		if ( 200 !== $status ) {

			if ( defined( 'WOOCOMMERCE_APACZKA_DEBUG' ) ) {
				$debug_extra_info = '<br>Submitted data:<br><pre>'
									. $debug_dump
									. '</pre><br>Raw request:<br>'
									. $raw_request_data;

				( new Alerts() )->add_error(
					$this->prepare_error_message(
						$route,
						sprintf(
							'Response status %s. Message: %s',
							$status,
							$response_decoded->message . $debug_extra_info
						)
					),
					$route
				);
			} else {
				$error_message = $this->parse_api_error_message( $response_decoded->message );
				( new Alerts() )->add_error( 'Apaczka.pl, error during sending request to ' . $route . ': ' . $error_message, $route );
			}

			if ( function_exists( 'wc_get_logger' ) ) {
				$logger = wc_get_logger();

				$logger->log(
					'debug',
					'SOME_ERROR_ON_REQUEST',
					array(
						'source'             => 'apaczka-api-status-log',
						'additional_context' => array(
							'expires_value_min'       => self::EXPIRES,
							'expires_value_timestamp' => strtotime( self::EXPIRES ),
							'current_timestamp'       => time(),
							'timestamp_diff'          => ( strtotime( self::EXPIRES ) - time() ),
						),
						'route'              => $route,
						'error'              => $response_decoded->message,
						'request_data'       => $data,
					)
				);
			}

			return false;
		}

		return $response_decoded->response;
	}

	/**
	 * Prepare error message
	 *
	 * @param string $route $route.
	 * @param string $message $message.
	 *
	 * @return string
	 */
	public function prepare_error_message( $route, $message ): string {
		return sprintf(
			'[%s] [route: %s] %s',
			gmdate( 'Y-m-d H:i:s' ) . ' UTC',
			$route,
			$message
		);
	}


	/**
	 * Build request
	 *
	 * @param string $route $route.
	 * @param array  $data $data.
	 * @return array
	 */
	private function buildRequest( $route, $data = array() ) {
		$data    = json_encode( $data );
		$expires = strtotime( self::EXPIRES );

		$system = 'WooCommerce APIv2 iLabs';

		return array(
			'app_id'    => $this->app_id,
			'request'   => $data,
			'expires'   => $expires,
			'signature' => $this->getSignature(
				$this->stringToSign(
					$this->app_id,
					$route,
					$data,
					$expires
				),
				$this->app_secret
			),
		);
	}

	/**
	 * Get order
	 *
	 * @param mixed $id $id.
	 * @return false|mixed
	 */
	public function order( $id ) {
		return $this->request( __FUNCTION__ . '/' . $id );
	}

	/**
	 * Get orders
	 *
	 * @param int $page $page.
	 * @param int $limit $limit.
	 * @return false|mixed
	 */
	public function orders( $page = 1, $limit = 10 ) {
		return $this->request(
			__FUNCTION__,
			array(
				'page'  => $page,
				'limit' => $limit,
			)
		);
	}

	/**
	 * Get waybill
	 *
	 * @param mixed $id $id.
	 * @return false|mixed
	 */
	public function waybill( $id ) {
		return $this->request( __FUNCTION__ . '/' . $id );
	}

	/**
	 * Pickup hours
	 *
	 * @param mixed $postal_code $postal_code.
	 * @param mixed $service_id $service_id.
	 * @return false|mixed
	 */
	public function pickup_hours( $postal_code, $service_id = false ) {
		return $this->request(
			__FUNCTION__,
			array(
				'postal_code' => $postal_code,
				'service_id'  => $service_id,
			)
		);
	}

	/**
	 * Order valuation
	 *
	 * @param $order
	 * @return false|mixed
	 */
	public function order_valuation( $order ) {
		return $this->request(
			__FUNCTION__,
			array(
				'order' => $order,
			)
		);
	}

	/**
	 * Send order
	 *
	 * @param $order
	 * @return false|mixed
	 */
	public function order_send( $order ) {
		return $this->request(
			__FUNCTION__,
			array(
				'order'  => $order,
				'system' => 'WooCommerce APIv2 iLabs',
			)
		);
	}

	/**
	 * Cancel order
	 *
	 * @param mixed $id $id.
	 * @return false|mixed
	 */
	public function cancel_order( $id ) {
		return $this->request( __FUNCTION__ . '/' . $id );
	}

	/**
	 * Turn in
	 *
	 * @param array $order_ids $order_ids.
	 * @return false|mixed
	 */
	public function turn_in( $order_ids = array() ) {
		return $this->request(
			__FUNCTION__,
			array(
				'order_ids' => $order_ids,
			)
		);
	}

	/**
	 * Service structure
	 *
	 * @param boolean $forced $forced.
	 *
	 * @return false|mixed|null
	 */
	public function service_structure( $forced = false ) {
		if ( $forced || ( defined( 'APACZKA_DISABLE_CACHE' ) || time()
													- (int) get_option( self::SERVICE_STRUCTURE_CACHE_TIMESTAMP_OPTION )
													> self::SECONDS_24H )
		) {

			if ( $forced ) {
				delete_option( 'apaczka_pl_api_returned_error' );
			}

			$maybe_timeout = get_option( 'apaczka_pl_api_returned_error' );
			$now           = time();
			if ( $maybe_timeout && $maybe_timeout > $now ) {
				return false;
			} else {
				delete_option( 'apaczka_pl_api_returned_error' );
			}

			$service_structure = $this->request( __FUNCTION__ );

			if ( ! is_object( $service_structure )
				|| ! property_exists( $service_structure, 'services' )
				|| ! property_exists( $service_structure, 'options' )
				|| ! property_exists( $service_structure, 'package_type' )
				|| ! property_exists( $service_structure, 'points_type' ) ) {

				if ( defined( 'WOOCOMMERCE_APACZKA_DEBUG' ) ) {
					( new Alerts() )->add_error(
						$this->prepare_error_message(
							__FUNCTION__,
							'Apaczka.pl: service_structure object cannot be parsed!'
						)
					);
				}

				( new Alerts() )->add_error(
					'Apaczka.pl: ' . esc_html__(
						'Unable to get the site structure from API. Make sure credentials are correct.',
						'apaczka-pl'
					)
				);

				$current_timestamp = time();
				$timeout           = $current_timestamp + 300;
				update_option( 'apaczka_pl_api_returned_error', $timeout );

				return false;
			}

			update_option(
				self::SERVICE_STRUCTURE_CACHE_OPTION,
				$service_structure
			);
			update_option(
				self::SERVICE_STRUCTURE_CACHE_TIMESTAMP_OPTION,
				time()
			);

			( new Service_Structure_Helper() )
				->update_options_by_service_structure( $service_structure );
			( new Alerts() )->clean_errors();

		} else {
			$service_structure = get_option( self::SERVICE_STRUCTURE_CACHE_OPTION );
		}


		return $service_structure;
	}

	/**
	 * Points
	 *
	 * @param mixed $type $type.
	 * @return false|mixed
	 */
	public function points( $type = null ) {
		return $this->request( __FUNCTION__ . '/' . $type . '/' );
	}

	/**
	 * Register customer
	 *
	 * @param $customer
	 * @return false|mixed
	 */
	public function customer_register( $customer ) {
		return $this->request(
			__FUNCTION__,
			array(
				'customer' => $customer,
			)
		);
	}


	/**
	 * Get signature
	 *
	 * @param $string
	 * @param $key
	 *
	 * @return string
	 */
	public function getSignature( $string, $key ) {
		return hash_hmac( self::SIGN_ALGORITHM, $string, $key );
	}


	/**
	 * String to sign
	 *
	 * @param $appId
	 * @param $route
	 * @param $data
	 * @param $system
	 * @param $expires
	 *
	 * @return string
	 */
	public function stringToSign( $appId, $route, $data, $expires ) {
		return sprintf( '%s:%s:%s:%s', $appId, $route, $data, $expires );
	}


	/**
	 * Translate error
	 *
	 * @param string $error $error.
	 * @return mixed
	 */
	public function translate_error( $error ) {
		$errors = array(
			'receiver_email' => __(
				'Recipient e-mail',
				'apaczka-pl'
			),
		);

		if ( isset( $errors[ $error ] ) ) {
			return $errors[ $error ];
		}

		return $error;
	}

	/**
	 * Authorization error
	 *
	 * @param $message
	 * @param $status
	 * @return void
	 */
	private function authorizationError( $message, $status ) {
		$errors = $this->translate_error( $message );

		$alerts = new Alerts();
		$alerts->add_error(
			'Apaczka_pl: '
							. ( is_string( $errors ) ? $errors
			: serialize( $errors ) . $message . ' ( ' . $status . ' )' )
		);
	}


	/**
	 * Validate phone
	 *
	 * @param string $phone $phone.
	 * @return string|true|null
	 */
	public function validate_phone( $phone ) {

		if ( $this->getCountry() === EasyPack_API::COUNTRY_UK ) {
			if ( preg_match( '/\A\d{10}\z/', $phone ) ) {
				return true;
			} else {
				return __(
					'Invalid phone number. Valid phone number must contains 10 digits.',
					'apaczka-pl'
				);
			}
		}
		if ( $this->getCountry() === EasyPack_API::COUNTRY_PL ) {
			if ( preg_match( '/\A[1-9]\d{8}\z/', $phone ) ) {
				return true;
			} else {
				return __(
					'Invalid phone number. Valid phone number must contains 9 digits and must not begins with 0.',
					'apaczka-pl'
				);
			}
		}

		return esc_html__( 'Invalid phone number.', 'apaczka-pl' );
	}


	/**
	 * Add to log
	 *
	 * @param string $method
	 * @param string $url
	 * @param array  $request
	 * @param array  $response
	 */
	public function addToLog( $method, $url, $request, $response ) {
		$file = APACZKA_PL_PLUGIN_DIR
				. DIRECTORY_SEPARATOR
				. 'log-apaczka-pl.txt';

		$line
			= sprintf(
				"******************\n\n%s\n%s\nURL:%s\nREQUEST:\n%s\nRESPONSE:\n%s\n",
				$method,
				gmdate( 'Y-m-d H:i:s', time() ),
				$url,
				preg_replace( '/[\x00-\x1F\x7F]/u', '', serialize( $request ) ),
				// remove non printable characters.
				preg_replace( '/[\x00-\x1F\x7F]/u', '', serialize( $response ) )
			);

		file_put_contents( $file, $line, FILE_APPEND );
	}

	/**
	 * Parse return
	 *
	 * @param $return
	 * @return mixed
	 */
	public function parse_return( $return ) {
		$ret = json_decode( json_encode( $return ), true );

		return $ret;
	}

	/**
	 * Parse error message from API
	 *
	 * @param mixed $error_message $error_message.
	 * @return mixed
	 */
	public function parse_api_error_message( $error_message ) {
		// Check if the message contains "must be between".
		if ( is_string( $error_message ) ) {
			if ( strpos( $error_message, 'must be between' ) !== false ) {

				$too_long_data = '';

				if ( strpos( $error_message, 'receiver.buildingNumber' ) !== false ) {
					$too_long_data = esc_html__( 'Receiver building number', 'apaczka-pl' );
				}

				if ( strpos( $error_message, 'sender.buildingNumber' ) !== false ) {
					$too_long_data = esc_html__( 'Sender building number', 'apaczka-pl' );
				}

				if ( strpos( $error_message, 'receiver.street' ) !== false ) {
					$too_long_data = esc_html__( 'Receiver street', 'apaczka-pl' );
				}

				if ( strpos( $error_message, 'sender.street' ) !== false ) {
					$too_long_data = esc_html__( 'Sender street', 'apaczka-pl' );
				}

				// Extract the numeric values.
				preg_match_all( '/\d+/', $error_message, $numbers );
				$min = $numbers[0][0] ?? 0;
				$max = $numbers[0][1] ?? 0;

				// Construct the user-friendly message.
				return $too_long_data . ' ' . esc_html__( 'must be between', 'apaczka-pl' ) . ' ' . $min . esc_html__( ' and', 'apaczka-pl' ) . ' ' . $max . esc_html__( ' symbols', 'apaczka-pl' );
			}
		}

		return $error_message;
	}
}

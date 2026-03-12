=== Apaczka: integracja z WooCommerce ===
Contributors: inspirelabs
Tags: apaczka, woocommerce, dpd, dhl, inpost
Requires at least: 5.3
Tested up to: 6.9
Stable tag: 1.4.2
Requires PHP: 7.2
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Zarządzaj wysyłkami różnych kurierów w jednym miejscu

== Description ==

Prowadzisz sklep WooCommerce i szukasz jednego miejsca do obsługi wysyłek bez ręcznego wprowadzania danych? Wybierz wtyczkę, która umożliwia integrację sklepu WooCommerce z platformą wysyłkową Apaczka. Pozwala ona na tworzenie, zarządzanie i obsługę przesyłek kurierskich bezpośrednio z poziomu panelu administracyjnego WordPress.

###Apaczka umożliwia:

* obsługę wielu firm kurierskich w ramach jednego konta,
* jedną umowę i jedno rozliczenie zamiast wielu kontraktów,
* realizację przesyłek krajowych i międzynarodowych,
* wysyłki do punktów odbioru i automatów paczkowych,
* dostęp do stawek wynegocjowanych w ramach platformy,
* wsparcie operacyjne w obsłudze przesyłek.


**Uwaga! Wtyczka nie wymaga podpisywania umów bezpośrednio z firmami kurierskimi. Wszystkie nadania realizowane są w ramach konta Apaczka.**

###Co otrzymasz dzięki wtyczce Apaczka i WooCommerce?

* tworzenie przesyłek kurierskich na podstawie zamówień WooCommerce
* generowanie i pobieranie etykiet/listów przewozowych
* obsługa punktów odbioru (PUDO) w procesie zamówienia
* zapisywanie szablonów przesyłek
* książka adresowa nadawców i odbiorców
* podgląd statusu przesyłki w zamówieniu
* możliwość anulowania nadania
* obsługa wielu przewoźników w ramach jednego konta Apaczka

###Dlaczego Apaczka, a nie zwykła integracja kurierska?

Apaczka nie jest tylko kolejnym narzędziem do nadawania paczek. To dojrzała platforma logistyczna, która:

* oferuje to samo rozwiązanie dla małych sklepów i dużych e-commerce,
* udostępnia stabilne API wykorzystywane przez ERP, WMS i integratory,
* pozwala łączyć różne modele pracy: wtyczka, integrator, API,
* zapewnia jedno wsparcie techniczne i operacyjne dla wszystkich przesyłek.

Dzięki temu sklep może rozpocząć pracę od prostej integracji WooCommerce, a w miarę rozwoju przejść na bardziej zaawansowane scenariusze bez zmiany platformy logistycznej.

###Jakimi kurierami wyślesz zamówienia?

* InPost
* DPD
* UPS
* GLS
* DHL
* Orlen Paczka
* FeDex
* Poczta Polska
* Pocztex
* Ambro Express
* Rhenus Logistics
* HellMann
* Geis
* WAWA Kurier
* Raben


###Jak działa wtyczka Apaczka?

* Zainstaluj i aktywuj wtyczkę Apaczka
* Załóż darmowe konto w serwisie [Apaczka.pl](https://konto.apaczka.pl/rejestracja).
* Wygeneruj klucz API w panelu Apaczka.
* Wprowadź dane API w ustawieniach WooCommerce.
* Twórz i zarządzaj przesyłkami bezpośrednio z poziomu zamówień.

Dowiedz się więcej: [integracja Apaczka z WooCommerce](https://www.apaczka.pl/integracje/woocommerce/)

== Installation	 ==

Zainstaluj wtyczkę w panelu administracyjnym Wordpress:

1. Pobierz wtyczkę
2. Przejdź do zakładki Wtyczki > Dodaj nową a następnie wskaż pobrany plik instalacyjny.
3. Po zainstalowaniu wtyczki włącz moduł.
4. Ustawienia wtyczki dostępne są w zakładce WooCommerce > Ustawienia > Apaczka.
5. Załóż darmowe konto w serwisie [Apaczka.pl](https://konto.apaczka.pl/rejestracja).
6. Wygeneruj klucz API w panelu Apaczka.
7. Wprowadź dane API w ustawieniach WooCommerce, uzupełnij całą konfigurację według własnych preferencji


== Frequently Asked Questions ==

= Czy potrzebuję konta w Apaczka.pl, żeby korzystać z wtyczki? =

Tak. Zarejestruj się bezpłatnie na [Apaczka.pl](https://panel.apaczka.pl/rejestracja).

== Screenshots ==

1.
2.
3.
4.
5.
6.
7.
8.

== Changelog ==

= 1.4.2 =
* Feat: new plugin description

= 1.4.1 =
* Fix: icons of the services
* Fix: DHL on map
* Feat: map ver. 8.7

= 1.4.0 =
* Feat: support of GLS services

= 1.3.9 =
* Fix: map enqueue script if virtual products in cart

= 1.3.8 =
* Fix: International methods names
* Feat: additional mode to output map button

= 1.3.7 =
* Fix: DPD dispatch point

= 1.3.6 =
* Fix: checkout blocks validation
* Fix: map files enqueue
* Feat: integration with Woocommerce Subsrciptions

= 1.3.5 =
* Fix: address line data to API

= 1.3.4 =
* Fix: InPost International on the map

= 1.3.3 =
* Fix: list of available operators on the map

= 1.3.2 =
* Fix: logo and delivery point for Inpost International
* Feat: new map based on Bliskapaczka.pl API

= 1.3.1 =
* Fix: translations

= 1.3.0 =
* Fix: pickup date

= 1.2.9 =
* Fix: shipping method Orlen "Drzwi-Punkt"

= 1.2.8 =
* Fix: double slash in some endpoint paths

= 1.2.7 =
* Fix: double slash in some paths

= 1.2.6 =
* Fix: Company name if field "Shipping company" is not empty

= 1.2.5 =
* Fix: param "expires" value

= 1.2.4 =
* Fix: select delivery points if Courier method

= 1.2.3 =
* Fix: creating waybill
* Fix: sender phone number validation when create parcel

= 1.2.2 =
* Feat: enable foreign locations
* Fix: Checkout Blocks validation

= 1.2.1 =
* Feat: new setting "Default way to send a parcel"

= 1.2.0 =
* Update logo

= 1.1.9 =
* Fix integration with Woocommerce Blocks Checkout

= 1.1.8 =
* Integration with Woocommerce Blocks Checkout

= 1.1.7 =
* Fix error on adding packages

= 1.1.6 =
* Enqueue script of map only on Checkout page

= 1.1.5 =
* Fix sender name

= 1.1.4 =
* Integration with HPOS
* Fix error messages

= 1.1.3 =
* Add new fields and settings

= 1.1.2 =
* Fix error for international shipments

= 1.1.1 =
* Fix error for InPost shipment

= 1.1.0 =
* Change order status if shipment created or cancelled
* Fix button to avoid accidently create double shipments
* Auto complete fields for COD orders

= 1.0.9 =
* Fix check is Woocommerce enabled

= 1.0.8 =
* Hours format and 'is_zebra' param fixes

= 1.0.7 =
* Several fixes

= 1.0.6 =
* Appearance refactoring and fixes

= 1.0.5 =
* PHP version compatibility fix

= 1.0.4 =
* minor fixes

= 1.0.3 =
* minor fixes

= 1.0.2 =
* minor fixes

= 1.0.1 =
* minor fixes

= 1.0 =
* Pierwsze wydanie!

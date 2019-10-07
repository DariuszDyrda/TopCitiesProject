import * as countries from 'i18n-iso-countries';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getCountryIsoCode(country) {
    return countries.getAlpha2Code(country, 'en');
}
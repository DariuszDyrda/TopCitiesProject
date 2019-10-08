import * as countries from 'i18n-iso-countries';
import * as axios from 'axios';
import { API, PARAMS } from '../consts/api';
import { CONFIG } from '../consts/config';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getCountryIsoCode(country) {
    return countries.getAlpha2Code(country, 'en');
}

export async function fetchCities(countryCode) {
    let cities = [];
    async function getPage(page = 1) {
        const response = await axios.get(API.CITIES_POLLUTION_BASE_URL, {
            params: {
              country: countryCode,
              parameter: PARAMS.parameter,
              order_by: 'city',
              limit: 1000,
              page: page
            },
            responseEncoding: 'UTF-8'
          })
          .then(res => {
            return res.data
          })
          .catch(err => {
            console.log(err);
          });
          if(page === 1) {
              cities = [...response.results];
          }
          else if(page > 1) {
            cities = cities.concat(response.results)
          }
          if(response.meta.limit * page < response.meta.found) {
              await getPage(++response.meta.page);
          }
    }
    await getPage();
    cities = getAvaragePollutionForEveryCity(cities);
    return getXCitiesWithMaxPollution(cities, CONFIG.MAX_POLLUTED_CITIES);
}

function getAvaragePollutionForEveryCity(data) {
    let array = data.map(element => ({ city: element.city, measurements: element.measurements, count: 1}));

    for(let i = 0; i < array.length-1; ++i) {
        if(array[i].city === array[i+1].city) {
            array[i].count++;
            array[i].measurements[0].value += array[i+1].measurements[0].value;
            array.splice(i+1, 1);
            --i;
        }
    }
    array.forEach(element => { element.measurements[0].value = element.measurements[0].value / element.count});
    return array;
}

function getXCitiesWithMaxPollution(cities, x) {
    cities.sort((a, b) => (b.measurements[0].value - a.measurements[0].value));
    return cities.slice(0, x);
}
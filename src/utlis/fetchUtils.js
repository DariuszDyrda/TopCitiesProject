import * as countries from 'i18n-iso-countries';
import * as axios from 'axios';
import { API, POLLUTION_PARAMS } from '../consts/api';
import { MAX_POLLUTED_CITIES } from '../consts/config';
import { findCityByQuery } from './geocode'
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
              parameter: POLLUTION_PARAMS.parameter,
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

    return getXCitiesWithMaxPollution(cities, MAX_POLLUTED_CITIES);
}

// function getAvaragePollutionForEveryCity(array) {
//     for(let i = 0; i < array.length-1; ++i) {
//         if(array[i].city === array[i+1].city) {
//             array[i].count++;
//             array[i].measurements[0].value += array[i+1].measurements[0].value;
//             array.splice(i+1, 1);
//             --i;
//         }
//     }
//     array.forEach(element => { element.measurements[0].value = element.measurements[0].value / element.count});
//     return array;
// }

async function getXCitiesWithMaxPollution(cities, x) {
    cities.sort((a, b) => (b.measurements[0].value - a.measurements[0].value));

    let topCities = [];
    
    do {
        let city = await getCitysName(cities.shift());
        if(!topCities.find(element => element.city === city.city)) {
            topCities.push(city);
        }
    } while(topCities.length < x)
    
    return topCities;
}

async function getCitysName(element) {
    let query;
    let city;
    if(element.coordinates) {
        query = `${element.coordinates.latitude}, ${element.coordinates.longitude}`;
        city = await findCityByQuery(query);
    }
    if(!city) {
        query = element.city;
        city = await findCityByQuery(query);
    }

    return { city, measurements: element.measurements }
}
import * as countries from 'i18n-iso-countries';
import * as axios from 'axios';
import { API, POLLUTION_PARAMS, DESCRIPTION_PARAMS } from '../consts/api';
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

async function getXCitiesWithMaxPollution(cities, x) {
    cities.sort((a, b) => (b.measurements[0].value - a.measurements[0].value));

    let topCities = [];
    
    do {
        let place = await getCitysName(cities.shift());
        if(!topCities.find(element => element.city === place.city)) {
            topCities.push(place);
        }
    } while(topCities.length < x)
    
    return topCities;
}

async function getCitysName(element) {
    let query;
    let place;
    if(element.coordinates) {
        query = `${element.coordinates.latitude}, ${element.coordinates.longitude}`;
        place = await findCityByQuery(query);
    }
    if(!place || !place.city || !place.country) {
        query = element.city;
        place = await findCityByQuery(query);
    }

    return { ...place, measurements: element.measurements }
}

// Wikipedia description fetch
export const getDescription = async (city, country) => {
    let retryCounter = 2;
    function fetchDescription(title) {
      return axios.get(API.WIKIPEDIA_BASE_URL, {
        params: {
          ...DESCRIPTION_PARAMS,
          titles: title
        }
      })
        .then(res => {
          const pages = res.data.query.pages;
          const data = pages[Object.keys(pages)[0]].extract;
          if(!data) {
            throw new Error("No description");
          }
          return data;
        })
        .catch(err => {
          if(retryCounter < 1) {
            return err;
          }
          let name = city;
          if(retryCounter < 2) {
            name = splitBilingualName(name);
          }
          retryCounter--;
          return fetchDescription(name);
        }) 
    }
    return fetchDescription(`${city}, ${country}`);
  }

const splitBilingualName = (name) => {
    let splitChars = ['/', '(', '-'];
    let splittedWord;
    do {
      splittedWord = name.split(splitChars.shift());
    } while(splittedWord.length < 2 && splitChars.length > 0)
    return splittedWord[0].trim();
  }
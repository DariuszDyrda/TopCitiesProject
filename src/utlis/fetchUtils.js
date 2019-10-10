import * as countries from 'i18n-iso-countries';
import * as axios from 'axios';
import deburr from 'lodash/deburr';
import { API, POLLUTION_PARAMS, DESCRIPTION_PARAMS } from '../consts/api';
import { MAX_POLLUTED_CITIES, GEOCODE_LANGUAGE } from '../consts/config';
import { findCityByQuery } from './geocode'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export async function dataFetching(inputValue, dispatch) {
  function getCountryIsoCode(country) {
    return countries.getAlpha2Code(deburr(country), GEOCODE_LANGUAGE);
  }
  async function fetchCities(country) {
    const countryCode = getCountryIsoCode(country);

    const getCities = async function(pageNo = 1) {
      const response = await axios.get(API.CITIES_POLLUTION_BASE_URL, {
                params: {
                  country: countryCode,
                  parameter: POLLUTION_PARAMS.parameter,
                  order_by: 'city',
                  limit: 1000,
                  page: pageNo
                },
                responseEncoding: 'UTF-8'
              })
              .then(res => {
                return res.data.results;
              })
      return response;
      }

    const getAllCities = async function(pageNo = 1) {
      const results = await getCities(pageNo);
      if (results.length>0) {
        return results.concat(await getAllCities(pageNo+1));
      } else {
        return results;
      }
    };
    return getAllCities();
  }
  
  async function getXCitiesWithMaxPollution(cities, x) {
    cities.sort((a, b) => (b.measurements[0].value - a.measurements[0].value));

    let topCities = [];
    
    do {
      try {
        let place = await getCitysName(cities.shift());
        if(!topCities.find(element => element.city === place.city)) {
          topCities.push(place);
        }
      }
      catch(e) {
        if(!(e.message === 'No name')) {
          dispatch({ type: 'SET_ERROR', payload: e });
          return;
        }
      }
    } while(topCities.length < x)
    
    return topCities;
  }

  async function getCitysName(element) {
    let query;
    let retryCounter = 2;
    if(element.coordinates) {
      query = `${element.coordinates.latitude}, ${element.coordinates.longitude}`;
    }
    const fetch_retry = (query, n) => findCityByQuery(query).catch(function(error) {
      if (n === 1) {
        throw error;
      }
      query = element.city;
      return fetch_retry(query, n - 1);
  });
    return await fetch_retry(query, retryCounter);
  }

  try {
    let result = await fetchCities(inputValue);
    let topCities = getXCitiesWithMaxPollution(result, MAX_POLLUTED_CITIES);
    return topCities;
  }
  catch(e) {
    dispatch({ type: 'SET_ERROR', payload: e });
  }
}

// Wikipedia description fetch -------------------------------------------------------
export async function descryptionFetching(city, country, dispatch) {
  const splitBilingualName = (name) => {
    // some cities returned by Opencage are in bilingual format, so they havee to be splited before wikipedia request (for example "Llangréu/Langreo")
    let splitChars = ['/', '(', '-'];
    let splittedWord;
    do {
      splittedWord = name.split(splitChars.shift());
    } while(splittedWord.length < 2 && splitChars.length > 0)
    return splittedWord[0].trim();
  }

  const getDescription = async (city, country) => {
    let retryCounter = 2;
    //when description is empty it will try to fetch with different title, up to 3 times
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
            if(err.message === "No description") {
              throw err;
            }
            dispatch({ type: 'SET_ERROR', payload: err})
            throw err;
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
  return getDescription(city, country);
}

  export const clearDescriptionText = (description) => {
    const stringsToRemove = [' (listen)', ' see also other names'];
    stringsToRemove.forEach(string => {
      description = description.replace(string, "");
    })
    return description;
  }
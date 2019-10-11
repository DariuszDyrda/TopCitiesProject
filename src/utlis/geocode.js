import * as opencage from 'opencage-api-client';
import { GEOCODE_LANGUAGE } from '../consts/config';
import { strings } from '../consts/strings';

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

export async function findCityByQuery(query) {
    return opencage.geocode({key: OPENCAGE_API_KEY, q: query, language: GEOCODE_LANGUAGE})
        .then(res => {
            let city = (res.results[0].components.city || res.results[0].components.town || res.results[0].components.village || undefined)
            let country = res.results[0].components.country || undefined;
            if(!city || !country) {
                throw new Error(strings.NO_NAME_ERROR);
            }
            return { city, country };
        })
}
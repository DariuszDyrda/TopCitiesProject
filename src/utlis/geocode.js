import * as opencage from 'opencage-api-client';
import { OPENCAGE_API_KEY } from '../consts/api.secret';
import { GEOCODE_LANGUAGE } from '../consts/config';

export async function findCityByQuery(query) {
    return opencage.geocode({key: OPENCAGE_API_KEY, q: query, language: GEOCODE_LANGUAGE})
        .then(res => {
            return (res.results[0].components.city || res.results[0].components.town || res.results[0].components.village || undefined);
        })
        .catch(err => {
            console.log(err);
        })
}
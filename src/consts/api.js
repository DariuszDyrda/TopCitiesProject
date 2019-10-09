export const API = {
    CITIES_POLLUTION_BASE_URL: 'https://api.openaq.org/v1/latest',
    WIKIPEDIA_BASE_URL: 'https://en.wikipedia.org/w/api.php'
}

export const POLLUTION_PARAMS = {
    parameter: 'pm25',
}

export const DESCRIPTION_PARAMS = {
    format:'json',
    action: 'query',
    prop: 'extracts',
    exintro: true,
    explaintext: true,
    redirects: 1,
    origin: '*',
}
# Top cities - recruitment task

React app fetching data about top 10 most polluted cities in given country (based on the latest measurements available for given place), alongside with their descriptions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* npm

### Installing

1. Clone this repo
2. Create .env file with your OpenCage API key

```
cd top-cities
touch .env
echo "REACT_APP_OPENCAGE_API_KEY='YOUR_API_KEY_GOES_HERE'" > .env
```
3. Inside top-cities folder run:
```
npm install
```
4. Start the app with:
```
npm start
```
6. Visit [localhost:3000](http://localhost:3000)


## Build with

### APIs:

* [OpenAQ](https://docs.openaq.org/) - data about pollution
* [MediaWiki](https://www.mediawiki.org/wiki/API:Query) - Wikipedia articles
* [OpenCage API](https://opencagedata.com/api) - data from OpenAQ were not always accurate, so I decited to use geocoder to determine city by it's coordinates.

Example of bad OpenAQ result (name instead of city and wrong character encoding):
![Image](openaq_error.png)

### Other tools:

* React (with Hooks)
* Redux with Redux-persist - for keeping input value persistant and also for global error handling
* Lodash - for handling diacritical chars
* Downshift - autocomplete functionality
* i18n-iso-countries - for converting input country into ISO code while making API request
* Axios
* Material UI


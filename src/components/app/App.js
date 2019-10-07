import React from 'react';
import { getCountryIsoCode } from '../../utlis/countryISO';
import * as axios from 'axios';
import { Form } from '../form/Form';
import { DataList } from '../dataList/DataList';
import './App.css';
import { API } from '../../consts/api';

function App() {
  async function handleSubmit(inputValue, e) {
    e.preventDefault();
    const countryCode = getCountryIsoCode(inputValue.trim());
    const data = await axios.get(API.CITIES_POLLUTION_BASE_URL, {
      params: {
        country: countryCode,
        parameter: 'pm25',
      }
    })
    .then(res => res.data.results)
    .catch(err => {
      console.log(err);
    });
    
    const sorted = data.sort((a, b) => (b.measurements[0].value - a.measurements[0].value)).map(element => ({city: element.location, value: element.measurements[0].value}));
    console.log(sorted.slice(0, 10));
  }

  return (
    <div className="App">
        <Form handleSubmit={handleSubmit}/>
        <DataList />
    </div>
  );
}

export default App;

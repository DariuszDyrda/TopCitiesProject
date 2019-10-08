import React, { useState } from 'react';
import { getCountryIsoCode, fetchCities } from '../../utlis/fetchUtils';
import { Form } from '../form/Form';
import { DataList } from '../dataList/DataList';
import './App.css';

function App() {
  const [cities, setCities] = useState([]);
  async function handleSubmit(inputValue, e) {
    e.preventDefault();
    const countryCode = getCountryIsoCode(inputValue.trim());
    setCities(await fetchCities(countryCode));
  }

  return (
    <div className="App">
        <Form handleSubmit={handleSubmit}/>
        <DataList cities={cities} />
    </div>
  );
}

export default App;

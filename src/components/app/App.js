import React, { useState } from 'react';
import { fetchCities } from '../../utlis/fetchUtils';
import { Form } from '../form/Form';
import { DataList } from '../dataList/DataList';
import './App.css';

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(inputValue, e) {
    setIsLoading(true);
    e.preventDefault();
    setCities(await fetchCities(inputValue.trim()));
    setIsLoading(false);
  }
    return (
      <div className="App">
          <Form handleSubmit={handleSubmit}/>
          <DataList cities={cities} isLoading={isLoading} />
      </div>
    );
  }

export default App;

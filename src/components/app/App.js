import React, { useState } from 'react';
import { fetchCities } from '../../utlis/fetchUtils';
import { Form } from '../form/Form';
import { DataList } from '../dataList/DataList';
import './App.css';
import { CustomSnackBar } from '../CustomSnackBar/CustomSnackBar';

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(inputValue, e) {
    setIsLoading(true);
    e.preventDefault();
    let cities = await fetchCities(inputValue.trim());
    if(cities) {
      setCities(cities);
    }
    else {
      setMessage("Connection error!")
      setOpen(true);
    }
    setIsLoading(false);
  }
    return (
      <div className="App">
          <CustomSnackBar open={open} setOpen={setOpen} message={message} />
          <Form handleSubmit={handleSubmit}/>
          <DataList cities={cities} isLoading={isLoading} />
      </div>
    );
  }

export default App;

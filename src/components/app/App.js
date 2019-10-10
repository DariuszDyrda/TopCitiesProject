import React, { useState, useEffect } from 'react';
import { dataFetching } from '../../utlis/fetchUtils';
import { Form } from '../form/Form';
import { DataList } from '../dataList/DataList';
import './App.css';
import { CustomSnackBar } from '../CustomSnackBar/CustomSnackBar';
import { useSelector, useDispatch } from 'react-redux';

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const error = useSelector(state => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if(error.message) {
      setMessage(error.message);
      setOpen(true);
    }
  }, [error]);

  async function handleSubmit(inputValue, event) {
    setIsLoading(true);
    event.preventDefault();
    let cities = await dataFetching(inputValue.trim(), dispatch);
    if(cities) {
      setCities(cities);
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

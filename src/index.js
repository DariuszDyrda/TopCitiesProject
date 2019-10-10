import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import './index.css';
import App from './components/app/App';

const rootReducer = (state = { inputValue: "", error: null }, action) => {
    switch(action.type) {
        case 'CHANGE_INPUT_VALUE': {
            return { ...state, inputValue: action.payload }
        }
        case 'SET_ERROR': {
            return { ...state, error: action.payload }
        }
        default:
            return state;
    }
}


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['inputValue'],
  }
  
const persistedReducer = persistReducer(persistConfig, rootReducer)
  
let store = createStore(persistedReducer)
let persistor = persistStore(store)


ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>), document.getElementById('root'));


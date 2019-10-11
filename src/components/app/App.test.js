import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import App from './App';

let initialState = {inputValue: ""}
let mockStore = configureStore();

it('renders without crashing', () => {
  let store = mockStore(initialState)
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><App /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

import React from "react";
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { Form } from "./Form";

describe("Form component", () => {
  let initialState = {inputValue: ""}
  let mockStore = configureStore();
  const handleSubmit = jest.fn();
  it("should call handle submit on submit", async () => {
    let store = mockStore(initialState)
    const { getByTestId } = render(<Provider store={store} ><Form handleSubmit={handleSubmit}></Form></Provider>)

    fireEvent.submit(getByTestId('form'));

    expect(handleSubmit).toBeCalled();
  });
})
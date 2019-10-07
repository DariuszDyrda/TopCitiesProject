import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { strings } from '../../consts/strings';

export const Form = (props) => {
    const [country, setCountry] = useState("");

    return (
        <form noValidate autoComplete="off">
            <TextField 
            placeholder={ strings.COUNTRY_INPUT_PLACEHOLDER } 
            onChange={(e) => setCountry(e.target.value)} 
            value={country}
            variant="outlined"/>
            <Button variant="contained" type='submit' color="primary">{ strings.FORM_BUTTON_TEXT }</Button>
        </form>
    )
}
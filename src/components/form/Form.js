import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Input from './Input';
import { strings } from '../../consts/strings';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        width: "50%",
        margin: "0 auto"
    },
}))

export const Form = (props) => {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    return (
        <div className={classes.root}>
            <Input setInputValue={setInputValue} setButtonDisabled={setButtonDisabled}/>
            <Button disabled={buttonDisabled} variant="contained" type='submit' color="primary">{ strings.FORM_BUTTON_TEXT }</Button>
        </div>
    )
}
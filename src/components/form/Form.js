import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Input from './Input';
import { strings } from '../../consts/strings';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        width: '100%',
        margin: "0 auto",
    },
}))

export const Form = (props) => {
    const [inputValue, setInputValue] = useState(null);

    const classes = useStyles();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    return (
        <form noValidate autoComplete="off" onSubmit={() => {}} className={classes.root}>
            <Input setInputValue={setInputValue} setButtonDisabled={setButtonDisabled}/>
            <Button disabled={buttonDisabled} variant="contained" type='submit' color="primary">{ strings.FORM_BUTTON_TEXT }</Button>
        </form>
    )
}

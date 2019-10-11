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
        marginBottom: '3px',
        marginTop: '30px',
    },
}))

export const Form = (props) => {
    const [inputValue, setInputValue] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const classes = useStyles();

    return (
        <form data-testid={'form'} noValidate autoComplete="off" onSubmit={props.handleSubmit.bind(this, inputValue)} className={classes.root}>
            <Input setInputValue={setInputValue} setButtonDisabled={setButtonDisabled} />
            <Button disabled={buttonDisabled} variant="contained" type='submit' color="primary">{ strings.FORM_BUTTON_TEXT }</Button>
        </form>
    )
}

Form.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
}
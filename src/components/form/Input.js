import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { renderInput, renderSuggestion, getSuggestions, checkIfValueMatchesSuggestions } from './autocompleteUtils';
import { strings } from '../../consts/strings';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
}));


export default function Input(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Downshift id="downshift-options">
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          openMenu,
          selectedItem,
          selectItem,
        }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onChange: event => {
              selectItem(event.target.value);
              props.setButtonDisabled(true);
              if (event.target.value === '') {
                clearSelection();
              }
            },
            onSelect: event => {
              if(checkIfValueMatchesSuggestions(event.target.value)) {
                props.setInputValue(event.target.value);
                props.setButtonDisabled(false);
              }
            },
            onFocus: openMenu,
            placeholder: strings.COUNTRY_INPUT_PLACEHOLDER,
          });

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                label: strings.COUNTRY_INPUT_LABEL,
                InputLabelProps: getLabelProps({ shrink: true }),
                InputProps: { onBlur, onChange, onFocus },
                inputProps,
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue, { showEmpty: true }).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    </div>
  );
}

Input.propTypes = {
  setInputValue: PropTypes.func.isRequired,
  setButtonDisabled: PropTypes.func.isRequired,
}
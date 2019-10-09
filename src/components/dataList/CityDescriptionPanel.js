import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as axios from 'axios';
import { API, DESCRIPTION_PARAMS } from '../../consts/api';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    progress: {
      
    }
  }));

export const CityDescriptionPanel = (props) => {
    const classes = useStyles();
    const [description, setDescription] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const fetchDescription = async (event, expanded) => {
      if(expanded && !description) {
        let data;
        try {
          data = await getDescription(`${props.name}, ${props.country}`);
        }
        catch(e) {
          data = e.message;
        }
        setDescription(data);
        setIsFetching(false);
      }
    }

    const getDescription = async title => {
      let retryCounter = 2;
      function fetchDescription(name) {
        return axios.get(API.WIKIPEDIA_BASE_URL, {
          params: {
            ...DESCRIPTION_PARAMS,
            titles: name
          }
        })
          .then(res => {
            const pages = res.data.query.pages;
            const data = pages[Object.keys(pages)[0]].extract;
            if(!data) {
              throw new Error("No description");
            }
            return data;
          })
          .catch(err => {
            if(retryCounter < 1) {
              return err;
            }
            let name = props.name;
            if(retryCounter < 2) {
              name = splitBilingualName(name);
            }
            retryCounter--;
            return fetchDescription(name);
          }) 
      }
      return fetchDescription(title);
    }

    const splitBilingualName = (name) => {
      let splitChars = ['/', '(', '-'];
      let splittedWord;
      do {
        splittedWord = name.split(splitChars.shift());
      } while(splittedWord.length < 2 && splitChars.length > 0)
      return splittedWord[0].trim();
    }

    return (
        <ExpansionPanel TransitionProps={{ unmountOnExit: true }} onChange={fetchDescription}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{props.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        {isFetching ? (<CircularProgress className={classes.progress} />) : (
          <Typography>
              {description}
          </Typography>)}
        </ExpansionPanelDetails>
      </ExpansionPanel >
    )
}

CityDescriptionPanel.propTypes = {
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
}
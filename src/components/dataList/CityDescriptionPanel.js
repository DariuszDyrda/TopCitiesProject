import React, { useState } from 'react';
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
          data = await getDescriptions(props.name);
        }
        catch(e) {
          console.log(e);
          let name = props.name.split("/")[0].trim();
          data = await getDescriptions(name);
        }
        setDescription(data);
        setIsFetching(false);
      }
    }

    const getDescriptions = async name => {
      return axios.get(API.WIKIPEDIA_BASE_URL, {
        params: {
          ...DESCRIPTION_PARAMS,
          titles: name
        }
      })
        .then(res => {
          const data = res.data.query.pages[Object.keys(res.data.query.pages)[0]].extract;
          if(!data) {
            throw new Error("No description");
          }
          return data;
        })
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
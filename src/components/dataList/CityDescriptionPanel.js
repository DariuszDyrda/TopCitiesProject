import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { descryptionFetching, clearDescriptionText } from '../../utlis/fetchUtils';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    progress: {
      margin: '0 auto',
    }
  }));

export const CityDescriptionPanel = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const handlePanelClick = async (event, expanded) => {
      if(expanded && !description) {
        setIsFetching(true);
        let data;
        try {
          data = await descryptionFetching(props.name, props.country, dispatch);
          data = clearDescriptionText(data);
        }
        catch(e) {
          data = e.message;
        }
        setDescription(data);
        setIsFetching(false);
      }
    }

    return (
        <ExpansionPanel TransitionProps={{ unmountOnExit: true }} onChange={handlePanelClick}>
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
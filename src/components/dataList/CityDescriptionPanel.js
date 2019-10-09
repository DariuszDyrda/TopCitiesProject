import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';;

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
        setIsFetching(true);
        let promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(setDescription("This is a description for " + props.name));
          }, 3000)
        })
        await promise;
        setIsFetching(false);
      }
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
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CityDescriptionPanel } from './CityDescriptionPanel';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        marginTop: '8px',
        marginBottom: '20px',
    },
}))

export const DataList = (props) => {
    const classes = useStyles();
    const panels = props.cities.map((element, i) => {
        return (
                <CityDescriptionPanel name={element.city} country={element.country} measurements={element.measurements} key={i} />
        )
        

    })

    if(props.isLoading) {
        return (
            <LinearProgress />
        )
      }
      else {
        return (
            <div className={classes.root}>
                {panels}
            </div>
        )
    }
}

DataList.propTypes = {
    cities: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
}
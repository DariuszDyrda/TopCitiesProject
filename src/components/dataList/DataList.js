import React from 'react';
import PropTypes from 'prop-types';
import { CityDescriptionPanel } from './CityDescriptionPanel';
import LinearProgress from '@material-ui/core/LinearProgress';


export const DataList = (props) => {
    const panels = props.cities.map((element, i) => {
        return (
            <CityDescriptionPanel name={element.city} country={element.country} key={i} />
        )
    })

    if(props.isLoading) {
        return (
            <LinearProgress />
        )
      }
      else {
        return (
            <div>
                {panels}
            </div>
        )
    }
}

DataList.propTypes = {
    cities: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
}
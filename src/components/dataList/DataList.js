import React from 'react';
import PropTypes from 'prop-types';
import { CityDescriptionPanel } from './CityDescriptionPanel';

export const DataList = (props) => {
    const panels = props.cities.map((element, i) => {
        return (
            <CityDescriptionPanel name={element.city} key={i} />
        )
    })
    return (
        <div>
            {panels}
        </div>
    )
}

DataList.propTypes = {
    cities: PropTypes.array.isRequired,
}
import React from 'react';
import Autocomplete from "react-google-autocomplete";

/**
* Component that uses Google's Autocomplete address API
* @param {} onSelected
* @param {} id
*/
const AutoComplete = ({ onSelected, id }) => {
    return (
        <div className="form-group">
            <Autocomplete
                apiKey={process.env.REACT_APP_PLACES_API_KEY}
                style={{ width: "90%" }}
                onPlaceSelected={(place) => {
                    onSelected(place.formatted_address, id);
                }}
                options={{
                    types: ["address"],
                    componentRestrictions: { country: "us" },
                }}
                placeholder="Please enter an address"
                className="form-control"
            />
        </div>
    );
};

export default AutoComplete;
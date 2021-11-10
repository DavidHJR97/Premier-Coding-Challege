import React from 'react';

/**
* Component that renders list of addresses.
* @param {[]} data
* @param {""} startPoint
* @param {""} endPoint
*/
const List = ({ data, startPoint, endPoint }) => {
    return (
        <div>
            <label>List of addresses</label>
            <p className="list-group-item">Start point: {startPoint}</p>
            <ul className="list-group">
                {data.map((el, i) => {
                    return (
                        <li key={i} className="list-group-item">{el.address}  <span style={{ fontWeight: 'bold' }}>{el.distance} miles</span></li>
                    )
                })}
            </ul>
            <br />
            <p className="list-group-item">End point: {endPoint}</p>
        </div >
    );
};

export default List;
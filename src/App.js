import './App.css';
import AutoComplete from './AutoComplete';
import { useState } from 'react';
import axios from 'axios';
import List from './List';
import Loader from "react-loader-spinner";

function App() {
  const [addresses, setAddress] = useState([])
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * function that handles form submission
   * @param {*} e
   * @returns
   */
  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    setResult(await getDistance(addresses));
    setLoading(false);
  }

  /**
   * Recursive function to calculate the distance between the addresses
   * @param {[]} distances
   * @param {[]} routeDistances
   * @param {} index
   * @returns list of ordered address for best route
   */
  async function calculateShortestDistance(distances, routeDistances, index) {
    let counter = index;
    let results = [];
    if (index < 5) {
      let params = `origins=${addresses[routeDistances[index].index]}&destinations=`;
      for (let i = 1; i < distances.length; i++) {
        params += "|" + addresses[distances[i].index]
      }

      let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
      let finalApiURL = `${ApiURL}${encodeURI(params)}&unitSystem=google.maps.UnitSystem.IMPERIAL&key=${process.env.REACT_APP_PLACES_API_KEY}`;

      try {
        let response = await axios.get(finalApiURL);
        response.data.rows[0].elements.forEach((element, i) => {
          results.push({
            "index": addresses.indexOf(addresses[distances[i + 1].index]),
            "address": addresses[distances[i + 1].index],
            "distance": ((element.distance.value / 1000) / 1.609).toFixed(1)
          })
        });
      } catch (error) {
        console.error(error);
      }

      results.sort((a, b) => {
        return a.distance - b.distance;
      });

      routeDistances[++counter] = results[0]
      ++index;

      await calculateShortestDistance(results, routeDistances, counter);
    }

    return routeDistances
  }

  /**
  * Gets the first address closes to the start point, calls recursive function
  * @param {[]} addresses
  * @returns list of ordered address for best route
  */
  async function getDistance(addresses) {
    let distances = [];
    let routeDistances = [];
    let params = `origins=${addresses[0]}&destinations=`

    for (let i = 2; i < addresses.length; i++) {
      params += "|" + addresses[i];
    }

    let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    let finalApiURL = `${ApiURL}${encodeURI(params)}&unitSystem=google.maps.UnitSystem.IMPERIAL&key=${process.env.REACT_APP_PLACES_API_KEY}`;

    try {
      let response = await axios.get(finalApiURL);
      response.data.rows[0].elements.forEach((element, i) => {
        distances.push({ "index": i + 2, "address": addresses[i + 2], "distance": ((element.distance.value / 1000) / 1.609).toFixed(1) })
      });

    } catch (error) {
      console.error(error);
    }

    distances.sort((a, b) => {
      return a.distance - b.distance;
    });

    routeDistances[0] = distances[0];

    return await calculateShortestDistance(distances, routeDistances, 0)
  }

  /**
* Adds address selected to list
* @param {""} address
* @param {} index
* @returns sets the list of addresses selected
*/
  function addAddress(address, index) {
    if (!addresses[index]) {
      addresses.push(address);
      return;
    }

    addresses.splice(index, 1);
    addresses[index] = address
    setAddress(addresses)
  }

  return (
    <div className="container" style={{ opacity: loading && .1 }}>
      <div className="row">
        <div className="col">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <label>Please enter the start point</label>
              <AutoComplete onSelected={addAddress} id={0} />
            </div>
            <div className="form-group">
              <label>Please enter the end point</label>
              <AutoComplete onSelected={addAddress} id={1} />
            </div>
            <br />
            <div className="form-group">
              <AutoComplete onSelected={addAddress} id={2} />
              <AutoComplete onSelected={addAddress} id={3} />
              <AutoComplete onSelected={addAddress} id={4} />
              <AutoComplete onSelected={addAddress} id={5} />
              <AutoComplete onSelected={addAddress} id={6} />
              <AutoComplete onSelected={addAddress} id={7} />
            </div>
            <br />
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
          <br />
        </div>
        {
          loading &&
          <div className="col">
            <Loader
              type="TailSpin"
              color="#000"
              height={100}
              width={100}
              visible={loading}
            />
          </div>
        }
        <div className="col">
          {result.length > 0 && <List data={result} startPoint={addresses[0]} endPoint={addresses[1]} />}
        </div>
      </div>
    </div >
  );
}

export default App;
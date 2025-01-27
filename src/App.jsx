import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [address, setAddress] = useState("");
    const [currentCoordinates, setCurrentCoordinates] = useState({});
    const [currentMarker, setCurrentMarker] = useState(null);
    const [nearByMarkers, setNearByMarkers] = useState(null);

    const mapContainerRef = useRef(null);
    const [searchRadius, setSearchRadius] = useState(1);
    const [olaMap, setOlaMap] = useState({});
    const [map, setMap] = useState(null);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };
    const handleSearchRadiusChange = (e) => {
        setSearchRadius(e.target.value);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `https://api.olamaps.io/places/v1/geocode?address=${address}&language=English&api_key=ozc9oLGoyBiJlMnqNARSrv2oJTTq6chGxUqrwYvG`
            );
            if (currentMarker) {
                currentMarker.remove();
            }
            const coordinates =
                response.data.geocodingResults[0].geometry.location;
            console.log(coordinates);
            setCurrentCoordinates(coordinates);
            map.setCenter(coordinates);
            map.setZoom(17);
            const newMarker = olaMap
                .addMarker({
                    offset: [0, 6],
                    anchor: "bottom",
                    color: "red",
                    draggable: true,
                })
                .setLngLat([coordinates.lng, coordinates.lat])
                .addTo(map);
            setCurrentMarker(newMarker);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNearBySearch = async (e) => {
        e.preventDefault();
        console.log(currentCoordinates.lat, currentCoordinates.lng);
        try {
            const response = await axios.get(`https://api.olamaps.io/places/v1/nearbysearch/advanced?location=${currentCoordinates.lat,currentCoordinates.lng}&types=gym&radius=${searchRadius}&withCentroid=true&rankBy=popular&limit=5&api_key=ozc9oLGoyBiJlMnqNARSrv2oJTTq6chGxUqrwYvG`);
            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (window.OlaMaps) {
            const olaMaps = new window.OlaMaps({
                apiKey: "ozc9oLGoyBiJlMnqNARSrv2oJTTq6chGxUqrwYvG", // Replace with your API key
            });
            setOlaMap(olaMaps);
            console.log(olaMap);
            try {
                const myMap = olaMaps.init({
                    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json",
                    container: "map",
                    center: [77.61648476788898, 12.931423492103944],
                    zoom: 15,
                });
                setMap(myMap);
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        } else {
            console.error(
                "OlaMaps SDK not loaded. Make sure the script is included in index.html."
            );
        }
    }, []);

    return (
        <>
            <div id="container">
                <div id="inputs">
                    <form onSubmit={handleAddressSubmit}>
                        <h2>Enter your address</h2>
                        <input value={address} onChange={handleAddressChange} />
                        <button>Go to location</button>
                    </form>
                    <form onSubmit={handleNearBySearch}>
                        <h2>Select your radius</h2>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={searchRadius}
                            onChange={handleSearchRadiusChange}
                        />
                        <select>
                            <option>gym</option>
                            <option>sports</option>
                        </select>
                    </form>
                </div>
                <div id="map" />
            </div>
        </>
    );
}

export default App;

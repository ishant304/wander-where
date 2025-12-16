import { useContext, useEffect, useRef, useState } from "react"
import { SearchContext } from "./SearchContext"
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { faBus, faCar, faLocationDot, faMapPin, faMotorcycle, faPlane, faRoute, faShip, faTrain } from "@fortawesome/free-solid-svg-icons";
import { tealMarkerIcon } from "./utils/mapIcons";

function Trip() {

  const { selectedPlace, setSelectedPlace } = useContext(SearchContext)
  const [destinationInput, setDestinationInput] = useState('')
  const [departureInput, setDepartureInput] = useState('')
  const [activeInput, setActiveInput] = useState(null)
  const [destError, setDestError] = useState(null)
  const [depError, setDepError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [checkbox, setCheckbox] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [locations, setLocations] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([])
  const [tripDetails, setTripDetails] = useState({
    startLocation: '',
    endLocation: '',
    travelers: 1,
    tripType: '',
    duration: 3,
    transportation: '',
    accommodation: 'hotel',
    mealPreference: 'all'
  });
  const startFirstRender = useRef(true);
  const endFirstRender = useRef(true);


  async function handleDepartureInput(e) {

    const value = e.target.value;
    setDepartureInput(value)

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(value + ' India')}&limit=5&lang=en`;

    let rawData = await fetch(url)
    let data = await rawData.json()

    const filteredData = data.features.filter(unit => unit?.properties?.countrycode === "IN");

    setSuggestions(filteredData.splice(0, 3))

    setDepError(false)
    setActiveInput("departure")

  }

  async function handleDestinationInput(e) {

    const value = e.target.value;
    setDestinationInput(value)


    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(value + ' India')}&limit=5&lang=en`;

    let rawData = await fetch(url)
    let data = await rawData.json()

    const filteredData = data.features.filter(unit => unit?.properties?.countrycode === "IN"
    );

    setSuggestions(filteredData.splice(0, 3))

    setDestError(false)
    setActiveInput("destination")

  }

  function getCurrentLocation(e) {

    setCheckbox(e.target.checked)
    if (e.target.checked) {

      setDepartureInput("Current location")
      setTripDetails({ ...tripDetails, startLocation: "Current location" })

    }
    if (!e.target.checked) {

      setDepartureInput("")
      setTripDetails({ ...tripDetails, startLocation: "" })
    }

  }

  function geolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude);
          const lng = Number(position.coords.longitude);
          resolve([lat, lng]);
        },
        () => {
          resolve(null);
        }
      );
    });
  }


  async function geocoding(location) {
    const rawData = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location + ",india")}&key=0b37e65606bf435f95a9915069d9e07f`)

    const data = await rawData.json()

    let coords = [Number(data.results[0].geometry.lat), Number(data.results[0].geometry.lng)]

    return coords;

  }

  useEffect(() => {
    if (selectedPlace) {
      setTripDetails({ ...tripDetails, endLocation: selectedPlace.properties.name })
      setDestinationInput(selectedPlace.properties.name)
    }
  }, [])

  useEffect(() => {

    if (startFirstRender.current) {
      startFirstRender.current = false;
      return;
    }

    async function updateGeocoding() {

      let coords = await geocoding(tripDetails.startLocation)

      setLocations((prev) => [
        {
          id: "start",
          name: tripDetails.startLocation,
          coords: coords
        }, ...prev.filter(loc => loc.id != "start")
      ])
    }

    async function updateGeolocation() {
      let coords = await geolocation()

      setLocations((prev) => [
        {
          id: "start",
          name: tripDetails.startLocation,
          coords: coords
        }, ...prev.filter(loc => loc.id != "start")
      ])
    }

    if (checkbox) {
      updateGeolocation()
    }

    else if (tripDetails.startLocation == "") {
      setLocations((prev) => [
        ...prev.filter(loc => loc.id != "start")
      ])
    }

    else {
      updateGeocoding();
    }

  }, [tripDetails.startLocation])

  useEffect(() => {

    if (endFirstRender.current) {
      endFirstRender.current = false;
      return;
    }

    async function updateLocations() {

      let coords = await geocoding(tripDetails.endLocation)

      setLocations((prev) => [
        ...prev.filter(loc => loc.id != "end"),
        {
          id: "end",
          name: tripDetails.endLocation,
          coords: coords
        }
      ])

    }

    if (tripDetails.endLocation == "") {
      setLocations((prev) => [
        ...prev.filter(loc => loc.id != "end")
      ])
    }

    else {
      updateLocations()
    }

  }, [tripDetails.endLocation])

  useEffect(() => {
    return () => {
      setSelectedPlace(null);
    };
  }, []);

  useEffect(() => {

    if (locations.length < 2) {
      setPolylineCoords([])
      return;
    }

    async function fetchRoute() {

      setPolylineCoords([])

      // let coordinates = locations.map(loc => [
      //   loc.coords[1], loc.coords[0]
      // ])

      // const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
      // const key = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhiMTRlYmYxMGYzZjQ4OWRiZWQ5YjZjMGY5MDVjZDk5IiwiaCI6Im11cm11cjY0In0="

      // const rawData = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Authorization": key,
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     coordinates,
      //     radiuses: Array(coordinates.length).fill(3000),
      //   })
      // })

      // const data = await rawData.json()

      // console.log(data);

      // const coords = data.features[0].geometry.coordinates.map(
      //   ([lng, lat]) => [lat, lng]
      // )


      const coordinates = locations
        .map(loc => `${loc.coords[1]},${loc.coords[0]}`)
        .join(";");

      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&alternatives=true&steps=true`;


      const rawData = await fetch(url);
      const data = await rawData.json();

      console.log(data);

      if (!data.routes || data.routes.length === 0) {
        setPolylineCoords([]);
        return;
      }

      const bestRoute = pickBestDrivableRoute(data.routes);

      const coords = bestRoute.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

    console.log(bestRoute);
    

      setPolylineCoords(coords);

    }

    fetchRoute()

  }, [locations])


  function pickBestDrivableRoute(routes) {
  if (!routes || routes.length === 0) return null;
  if (routes.length === 1) return routes[0];

  let bestRoute = routes[0];
  let minBends = Infinity;

  routes.forEach(route => {
    let bendCount = 0;

    route.legs?.forEach(leg => {
      leg.steps?.forEach(step => {
        const modifier = step.maneuver?.modifier;

        // Count every bend as 1 (ignore severity)
        if (
          modifier === "left" ||
          modifier === "right" ||
          modifier === "slight left" ||
          modifier === "slight right" ||
          modifier === "sharp left" ||
          modifier === "sharp right" ||
          modifier === "uturn"
        ) {
          bendCount++;
        }
      });
    });

    if (bendCount < minBends) {
      minBends = bendCount;
      bestRoute = route;
    }
  });

  return bestRoute;
}


  useEffect(() => {

    window.tripDetails = tripDetails
    window.locations = locations
  }, [tripDetails, locations]);

  function AutoFlyToBounds({ locations }) {
    const map = useMap();

    useEffect(() => {
      if (!locations || locations.length === 0) return;

      const bounds = L.latLngBounds(
        locations
          .map(loc => loc.coords)
          .filter(c => Array.isArray(c) && c.length === 2)
      );

      if (!bounds.isValid()) return;

      map.flyToBounds(bounds, {
        padding: [60, 60],
        maxZoom: 10,
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }, [locations, map]);

    return null;
  }

  const transportIcons = {
    flight: faPlane,
    train: faTrain,
    bus: faBus,
    car: faCar,
    bike: faMotorcycle,
    cruise: faShip,
  };

  return (
    <div>
      <div className="flex flex-row h-[calc(100vh-121px)] w-screen">
        <div className="w-[70px] border-r-teal-200 border flex flex-col">
          <button className={`flex flex-col items-center cursor-pointer hover:text-teal-600 text-3xl pt-8
            ${activeTab == "overview" ? "text-teal-600" : "text-black"}`} onClick={() => setActiveTab("overview")}>
            <FontAwesomeIcon icon={faMap} />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button className={`flex flex-col items-center cursor-pointer hover:text-teal-600 text-3xl pt-8
            ${activeTab == "stops" ? "text-teal-600" : "text-black"}`} onClick={() => setActiveTab("stops")}>
            <FontAwesomeIcon icon={faMapPin} />
            <span className="text-xs mt-1">Stops</span>
          </button>
          <button className={`flex flex-col items-center cursor-pointer hover:text-teal-600 text-3xl pt-8
            ${activeTab == "itineary" ? "text-teal-600" : "text-black"}`} onClick={() => setActiveTab("itineary")}>
            <FontAwesomeIcon icon={faRoute} />
            <span className="text-xs mt-1">Itineary</span>
          </button>
        </div>
        <div className="w-1/5 h-full border border-r-teal-200 overflow-y-auto">


          {activeTab == "overview" && (

            <div>

              <div className="p-6">
                <div className="pt-6 text-2xl font-bold text-gray-800 mb-2">
                  Plan Your {tripDetails.endLocation} Trip
                </div>
                <p className="text-xs text-gray-500 mb-6">Fill in the details to get started</p>

                <div className="space-y-5">
                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faLocationDot} />
                      Starting Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., New Delhi"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed disabled:opacity-80
                        ${depError ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-300 ring-2 ring-red-300"
                          : "border-gray-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-200"} `}
                      value={departureInput}
                      disabled={activeInput == "destination" || checkbox}
                      onChange={(e) => handleDepartureInput(e)} onBlur={() => {
                        if (departureInput.length == 0 || suggestions.length == 0) {
                          setDepError(false);
                          setActiveInput("");
                          setSuggestions([])
                        } else {
                          setDepError(true);
                        }
                      }
                      }
                    />
                    {activeInput == "departure" && departureInput.length > 0 && (
                      <ul className="absolute z-50 w-full mt-[2px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ">
                        {
                          suggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setDepartureInput(item.properties.name);
                                setTripDetails({ ...tripDetails, startLocation: item.properties.name })
                                setSuggestions([]); setActiveInput("");
                                setDepError(false)
                              }}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm flex flex-col"
                            >
                              <span className="font-medium text-gray-900">
                                {item.properties.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(item.properties.state || item.properties.city) + ", India"}
                              </span>
                            </li>
                          ))
                        }
                      </ul>
                    )}
                    <div className="mt-2">
                      <input type="checkbox" id="checkbox" onChange={(e) => getCurrentLocation(e)} value={checkbox} />
                      <label className="items-center ml-2 gap-2 text-sm font-medium text-gray-700" htmlFor="checkbox">Check this to use current location</label>
                    </div>

                  </div>

                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faLocationDot} />
                      Ending Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Goa"
                      disabled={activeInput == "departure"}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed disabled:opacity-80
                        ${destError ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-300 ring-2 ring-red-300"
                          : "border-gray-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-200"} `}
                      value={destinationInput}
                      onChange={(e) => handleDestinationInput(e)}
                      onBlur={() => {
                        if (destinationInput.length == 0 || suggestions.length == 0) {
                          setDestError(false);
                          setActiveInput("");
                          setSuggestions([])
                        } else {
                          setDestError(true);
                        }
                      }
                      }
                    />
                    {activeInput == "destination" && destinationInput.length > 0 && (
                      <ul className="absolute z-50 w-full mt-[2px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ">
                        {suggestions.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setDestinationInput(item.properties.name);
                              setSelectedPlace(item);
                              setTripDetails({ ...tripDetails, endLocation: item.properties.name })
                              setSuggestions([]);
                              setActiveInput("");
                              setDestError(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm flex flex-col"
                          >
                            <span className="font-medium text-gray-900">
                              {item.properties.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(item.properties.state || item.properties.city) + ", India"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Trip Duration
                    </label>

                    <div className="mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="30"
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          value={tripDetails.duration}
                          onChange={(e) => setTripDetails({ ...tripDetails, duration: parseInt(e.target.value) })}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="365"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-center font-semibold"
                            value={tripDetails.duration}
                            onChange={(e) => setTripDetails({ ...tripDetails, duration: parseInt(e.target.value) || 1 })}
                          />
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {tripDetails.duration === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Number of Travelers
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <button
                          key={num}
                          onClick={() => setTripDetails({ ...tripDetails, travelers: num })}
                          className={`py-2 rounded-md text-sm font-medium transition-all ${tripDetails.travelers === num
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {tripDetails.travelers > 6 && (
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm mt-2"
                        value={tripDetails.travelers}
                        onChange={(e) => setTripDetails({ ...tripDetails, travelers: parseInt(e.target.value) || 1 })}
                      />
                    )}
                    <button
                      onClick={() => setTripDetails({ ...tripDetails, travelers: 7 })}
                      className="text-xs text-teal-600 hover:text-teal-700 mt-1"
                    >
                      More than 6? Click here
                    </button>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Primary Transportation
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'flight', label: 'Flight', icon: 'flight' },
                        { value: 'train', label: 'Train', icon: 'train' },
                        { value: 'bus', label: 'Bus', icon: 'bus' },
                        { value: 'car', label: 'Car', icon: 'car' },
                        { value: 'bike', label: 'Bike', icon: 'bike' },
                        { value: 'cruise', label: 'Cruise', icon: 'cruise' }
                      ].map(transport => (
                        <button
                          key={transport.value}
                          onClick={() => setTripDetails({ ...tripDetails, transportation: transport.value })}
                          className={`p-3 rounded-md text-xs font-medium transition-all border-2 flex flex-col items-center gap-1 ${tripDetails.transportation === transport.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <FontAwesomeIcon
                            icon={transportIcons[transport.icon]}
                            className="text-lg"
                          />
                          {transport.label}

                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Accommodation Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'hotel', label: '🏨 Hotel' },
                        { value: 'hostel', label: '🏠 Hostel' },
                        { value: 'resort', label: '🏖️ Resort' },
                        { value: 'airbnb', label: '🏡 Airbnb' }
                      ].map(acc => (
                        <button
                          key={acc.value}
                          onClick={() => setTripDetails({ ...tripDetails, accommodation: acc.value })}
                          className={`p-2 rounded-md text-sm transition-all border ${tripDetails.accommodation === acc.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          {acc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Meal Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'all', label: '🍽️ All Meals' },
                        { value: 'vegetarian', label: '🥗 Vegetarian' },
                        { value: 'vegan', label: '🌱 Vegan' },
                        { value: 'halal', label: '🍖 Halal' }
                      ].map(meal => (
                        <button
                          key={meal.value}
                          onClick={() => setTripDetails({ ...tripDetails, mealPreference: meal.value })}
                          className={`p-2 rounded-md text-xs transition-all border ${tripDetails.mealPreference === meal.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          {meal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Trip Budget Level
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'budget', label: 'Budget', icon: '💰' },
                        { value: 'affordable', label: 'Affordable', icon: '💵' },
                        { value: 'luxury', label: 'Luxury', icon: '✨' },
                        { value: 'ultra-luxury', label: 'Ultra Luxury', icon: '👑' }
                      ].map(type => (
                        <button
                          key={type.value}
                          onClick={() => setTripDetails({ ...tripDetails, tripType: type.value })}
                          className={`p-3 rounded-md text-sm font-medium transition-all border-2 ${tripDetails.tripType === type.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <div className="text-lg mb-1">{type.icon}</div>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}


          {activeTab == "stops" && (
            <div>This is me</div>
          )}
          {activeTab == "itineary" && (
            <div></div>
          )}
        </div>
        <div className="w-4/5 h-full">
          <MapContainer className="h-full w-full"
            style={{ zIndex: 0 }}
            center={[21.1458, 79.0882]}
            zoom={5}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors">
            </TileLayer>
            {
              locations.map(loc => (
                <Marker key={loc.id} position={loc.coords} icon={tealMarkerIcon}>
                  <Tooltip permanent direction="top" offset={[2, -20]}>{loc.name}</Tooltip>
                </Marker>
              ))
            }
            <AutoFlyToBounds locations={locations} />
            {locations.length > 1 && (
              <Polyline
                positions={polylineCoords}
                color="#149b90"
                weight={5}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default Trip

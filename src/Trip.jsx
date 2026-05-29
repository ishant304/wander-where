import { useContext, useEffect, useRef, useState } from "react"
import { SearchContext } from "./SearchContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faMap } from "@fortawesome/free-regular-svg-icons";
import { faBed, faBus, faCar, faCrown, faDrumstickBite, faHandHoldingDollar, faHotel, faLocationDot, faMapPin, faMoneyBill1Wave, faMotorcycle, faPiggyBank, faPlane, faRoute, faSeedling, faTaxi, faTrain, faUmbrellaBeach, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import StopsTab from "./StopsTab";
import Itineary from "./Itineary";
import Map from "./Map";

function Trip() {

  const { selectedPlace, setSelectedPlace } = useContext(SearchContext)
  const [destinationInput, setDestinationInput] = useState('')
  const [departureInput, setDepartureInput] = useState('')
  const [activeInput, setActiveInput] = useState(null)
  const [destError, setDestError] = useState(null)
  const [depError, setDepError] = useState(null)
  const [suggestions2, setSuggestions2] = useState([])
  const [checkbox, setCheckbox] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [locations, setLocations] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([])
  const [route, setRoute] = useState()
  const [popupMessage, setPopupMessage] = useState("")
  const [popup, setPopup] = useState(false)
  const [tripDetails, setTripDetails] = useState({
    startLocation: '',
    endLocation: '',
    travelers: 1,
    tripType: 'budget',
    duration: 3,
    transportation: 'car',
    accommodation: 'hotel',
    mealPreference: 'all'
  });
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [routeModel, setRouteModel] = useState("initial")
  const [departureLoadingSearch, setDepartureLoadingSearch] = useState(false)
  const [departureLoadingError, setDepartureLoadingError] = useState(false)
  const [destinationLoadingSearch, setDestinationLoadingSearch] = useState(false)
  const [destinationLoadingError, setDestinationLoadingError] = useState(false)
  const [suggestionError, setSuggestionError] = useState(false)
  const startFirstRender = useRef(true);
  const endFirstRender = useRef(true);
  const firstRender = useRef(false);
  const destInputFirstChange = useRef(false);
  const routeCache = useRef("");
  const isMountedRef = useRef(false)


  function handleDepartureInput(e) {

    const value = e.target.value;
    setDepartureInput(value)

  }

  useEffect(() => {

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!departureInput.trim() || departureInput === "Current location") {
      setSuggestions2([]);
      return;
    }

    setActiveInput("departure")
    setDepartureLoadingError(false)
    setDepartureLoadingSearch(true)

    const controller = new AbortController();

    const timer = setTimeout(async () => {

      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(departureInput + ' India')}&limit=5&lang=en`;

        let rawData = await fetch(url, { signal: controller.signal })

        if (!rawData.ok) {
          throw new Error("API_failed")
        }

        let data = await rawData.json()

        const filteredData = data.features.filter(unit => unit?.properties?.countrycode === "IN");

        setSuggestions2(filteredData.splice(0, 3))

        setDepError(false)
      }
      catch (err) {
        if (err.name !== "AbortError") {
          setDepartureLoadingError(true)
        }

      }
      finally {
        if (!controller.signal.aborted) {
          setDepartureLoadingSearch(false)
        }
      }

    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort();
    }

  }, [departureInput])

  function handleDestinationInput(e) {

    const value = e.target.value;
    setDestinationInput(value)

  }

  useEffect(() => {

    if (firstRender.current || destInputFirstChange.current) {
      firstRender.current = false;
      destInputFirstChange.current = false;
      return;
    }

    if (!destinationInput.trim()) {
      setSuggestions2([]);
      return;
    }

    setActiveInput("destination")
    setDestinationLoadingError(false)
    setDestinationLoadingSearch(true)

    const controller = new AbortController();

    const timer = setTimeout(async () => {

      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(destinationInput + ' India')}&limit=5&lang=en`;

        let rawData = await fetch(url, {
          signal: controller.signal
        })

        if (!rawData.ok) {
          throw new Error("API_failed")
        }

        let data = await rawData.json()

        const filteredData = data.features.filter(unit => unit?.properties?.countrycode === "IN"
        );

        setSuggestions2(filteredData.splice(0, 3))

        setDestError(false)
      }
      catch (err) {
        if (err.name !== "AbortError") {
          setDestinationLoadingError(true)
        }
      }
      finally {
        if (!controller.signal.aborted) {
          setDestinationLoadingSearch(false)
        }
      }

    }, 300);

    return () => {
      clearTimeout(timer)
      controller.abort();
    }

  }, [destinationInput])

  async function getCurrentLocation(e) {
    const isChecked = e.target.checked;

    if (!isChecked) {
      setCheckbox(false);
      setDepartureInput("");
      setTripDetails(prev => ({ ...prev, startLocation: "" }));
      setLocations(prev => prev.filter(loc => loc.id !== "start"));
      setRoute(null);
      setRouteModel("initial");
      setPolylineCoords([]);
      return;
    }

    const permission = await navigator.permissions.query({ name: "geolocation" });
    if (permission.state === "denied") {
      setCheckbox(false);
      alert("Location access is denied. Please enable it from browser settings.");
      return;
    }

    const coords = await geolocation();
    if (!coords) {
      setCheckbox(false);
      alert("Location access denied.");
      return;
    }

    setRoute(null);
    setRouteModel("initial");
    setPolylineCoords([]);
    setCheckbox(true);
    setDepartureInput("Current location");
    setTripDetails(prev => ({ ...prev, startLocation: "Current location" }));
    setLocations(prev => [
      { id: "start", name: "Current location", coords, day: 1 },
      ...prev.filter(loc => loc.id !== "start")
    ]);
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
    try {
      const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      const rawData = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location + ",india")}&key=${apiKey}`)

      if (!rawData.ok) {
        throw new Error("Failed to fetch geocoding data");
      }

      const data = await rawData.json()

      if (!data.results?.[0]?.geometry) {
        throw new Error(`No coordinates found for: ${location}`);
      }

      let coords = [Number(data.results[0].geometry.lat), Number(data.results[0].geometry.lng)]

      return coords;
    } catch (err) {
      console.error("Geocoding error:", err);
      throw err;
    }
  }

  useEffect(() => {
    if (selectedPlace) {
      setTripDetails({ ...tripDetails, endLocation: selectedPlace.properties.name })
      destInputFirstChange.current = true;
      setDestinationInput(selectedPlace.properties.name)

    }
  }, [])

  useEffect(() => {

    if (startFirstRender.current) {
      startFirstRender.current = false;
      return;
    }

    if (tripDetails.startLocation === "" || checkbox) return;

    setRoute(null);
    setRouteModel("initial");
    setPolylineCoords([]);

    async function updateGeocoding() {
      const coords = await geocoding(tripDetails.startLocation)
      setLocations(prev => [
        { id: "start", name: tripDetails.startLocation, coords, day: 1 },
        ...prev.filter(loc => loc.id !== "start")
      ])
    }

    updateGeocoding();

  }, [tripDetails.startLocation])

  useEffect(() => {

    if (endFirstRender.current) {
      endFirstRender.current = false;
      return;
    }

    async function updateLocations() {
      try {
        const coords = await geocoding(tripDetails.endLocation)

        if (!coords || coords.length !== 2) {
          setPopupMessage("Unable to resolve ending location coordinates");
          setPopup(true);
          setTimeout(() => setPopup(false), 3000);
          return;
        }

        setLocations((prev) => [
          ...prev.filter(loc => loc.id != "end"),
          {
            id: "end",
            name: tripDetails.endLocation,
            coords: coords,
            day: tripDetails.duration
          }
        ])
      } catch (err) {
        setPopupMessage("Failed to resolve ending location");
        setPopup(true);
        setTimeout(() => setPopup(false), 3000);
      }
    }

    if (tripDetails.endLocation == "") {
      setLocations((prev) => [
        ...prev.filter(loc => loc.id != "end")
      ])
      setRoute(null);
      setRouteModel("initial");
      setPolylineCoords([]);
    }

    else {
      setRoute(null);
      setRouteModel("initial");
      setPolylineCoords([]);
      updateLocations()
    }

  }, [tripDetails.endLocation])


  function handleDuration(e) {

    const value = e.target.value

    setLocations(prev =>
      prev.map(place => {
        if (place.id === "start") {
          return { ...place, day: 1 };
        }
        if (place.id.startsWith("stop")) {
          return { ...place, day: Math.floor(1 + value / 2) };
        }
        if (place.id === "end") {
          return { ...place, day: Number(value) };
        }
        return place;
      })
    );

    setTripDetails({ ...tripDetails, duration: parseInt(value) || 1 })

  }


  useEffect(() => {
    return () => {
      setSelectedPlace(null);
    };
  }, []);

  useEffect(() => {

    const start = locations.find(l => l.id === "start")
    const end = locations.find(l => l.id === "end")

    if (!start || !end) {
      setPolylineCoords([])
      return;
    }

    async function fetchRoute(points) {

      const cacheKey = JSON.stringify(points.map(l => l.coords))

      if (routeCache.current === cacheKey) {
        return;
      }

      else {

        setPopup(true)
        setPopupMessage("Route is being generated, please wait...")

        setPolylineCoords([])

        const coordinates = points
          .map(loc => `${loc.coords[1]},${loc.coords[0]}`)
          .join(";");

        try {

          const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&alternatives=true&steps=true`;


          const rawData = await fetch(url);
          if (!rawData.ok) {
            throw new Error("route not fetched");
          }
          const data = await rawData.json();

          if (!data.routes || data.routes.length === 0) {
            setPolylineCoords([]);
            setPopupMessage("No route found")
            setTimeout(() => {
              setPopup(false)
            }, 3000);
            return;
          }

          const bestRoute = pickBestDrivableRoute(data.routes);

          setRoute(bestRoute)

          const coords = bestRoute.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );


          setPolylineCoords(coords);

          routeCache.current = JSON.stringify(points.map(l => l.coords))

          setPopupMessage("Route generated successfully")
          setTimeout(() => {
            setPopup(false)
          }, 3000);


        }
        catch (err) {

          setPopupMessage("Failed to generate route, try again later")
          setTimeout(() => {
            setPopup(false)
          }, 3000);
          setPolylineCoords([])

        }

      }

    }

    if (routeModel == "initial") {
      fetchRoute([start, end])
    }

    if (routeModel == "editing") {
      return;
    }

    if (routeModel == "final") {
      fetchRoute(locations)
    }

  }, [locations, routeModel])


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




  const transportIcons = {
    flight: faPlane,
    train: faTrain,
    bus: faBus,
    car: faCar,
    bike: faMotorcycle,
    sharing: faTaxi,
  };

  return (
    <div>
      <div className="relative flex flex-row h-[calc(100vh-121px)] w-screen">
        {
          popup && (
            <div className={`z-50 absolute bottom-4 right-4 flex items-center gap-3 px-4 py-3 bg-white border border-teal-400 rounded-lg ring-2 ring-teal-200  transition-all duration-500 ${popup ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
              <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
              <span className="sm:text-base text-sm text-gray-600">{popupMessage}</span>
            </div>
          )
        }
        <div className="w-[70px] border-r-teal-200 border flex flex-col">
          <button className={`flex flex-col items-center cursor-pointer hover:text-teal-600 text-3xl pt-8
            ${activeTab == "overview" ? "text-teal-600" : "text-black"}`} onClick={() => setActiveTab("overview")}>
            <FontAwesomeIcon className="hidden sm:block" icon={faMap} />
            <FontAwesomeIcon className="sm:hidden" icon={faCompass} />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button className={`sm:hidden flex flex-col items-center cursor-pointer hover:text-teal-600 text-3xl pt-8
            ${activeTab == "map" ? "text-teal-600" : "text-black"}`} onClick={() => setActiveTab("map")}>
            <FontAwesomeIcon icon={faMap} />
            <span className="text-xs mt-1">Map</span>
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
        <div className="w-full sm:w-3/12 h-full border border-r-teal-200 overflow-y-auto">


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
                        if (departureInput.length == 0 || suggestions2.length == 0) {
                          setDepError(false);
                          setActiveInput("");
                          setSuggestions2([])
                        } else {
                          setDepError(true);
                        }
                      }
                      }
                    />
                    {activeInput === "departure" && departureInput.length > 0 && (
                      <ul className="absolute z-50 w-full mt-[2px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">

                        {departureLoadingSearch &&
                          Array.from({ length: 3 }).map((_, i) => (
                            <li
                              key={i}
                              className="px-4 py-3 flex flex-col gap-2 animate-pulse"
                            >
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </li>
                          ))
                        }

                        {!departureLoadingSearch && departureLoadingError && (
                          <li className="px-4 py-3 text-sm text-gray-500">
                            Unable to load suggestions. Check your connection.
                          </li>
                        )}

                        {!departureLoadingSearch && !departureLoadingError && suggestions2.length === 0 && (
                          <li className="px-4 py-3 text-sm text-gray-500">
                            No results found
                          </li>
                        )}

                        {!departureLoadingSearch && !departureLoadingError &&
                          suggestions2.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setDepartureInput(item.properties.name);
                                setTripDetails({
                                  ...tripDetails,
                                  startLocation: item.properties.name
                                });
                                setSuggestions2([]);
                                setActiveInput("");
                                setDepError(false);
                                firstRender.current = true;
                                setRouteModel("initial");
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
                      <input type="checkbox" id="checkbox" onChange={(e) => getCurrentLocation(e)} checked={checkbox} />
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
                        if (destinationInput.length == 0 || suggestions2.length == 0) {
                          setDestError(false);
                          setActiveInput("");
                          setSuggestions2([])
                        } else {
                          setDestError(true);
                        }
                      }
                      }
                    />
                    {activeInput === "destination" && destinationInput.length > 0 && (
                      <ul className="absolute z-50 w-full mt-[2px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">

                        {destinationLoadingSearch &&
                          Array.from({ length: 3 }).map((_, i) => (
                            <li
                              key={i}
                              className="px-4 py-3 flex flex-col gap-2 animate-pulse"
                            >
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </li>
                          ))
                        }

                        {!destinationLoadingSearch && destinationLoadingError && (
                          <li className="px-4 py-3 text-sm text-gray-500">
                            Unable to load suggestions. Check your connection.
                          </li>
                        )}

                        {!destinationLoadingSearch && !destinationLoadingError && suggestions2.length === 0 && (
                          <li className="px-4 py-3 text-sm text-gray-500">
                            No results found
                          </li>
                        )}

                        {!destinationLoadingSearch && !destinationLoadingError &&
                          suggestions2.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setDestinationInput(item.properties.name);
                                setSelectedPlace(item);
                                setTripDetails({
                                  ...tripDetails,
                                  endLocation: item.properties.name
                                });
                                setSuggestions2([]);
                                setActiveInput("");
                                setDestError(false);
                                firstRender.current = true;
                                setSuggestedPlaces([]);
                                isMountedRef.current = false;
                                setRouteModel("initial");
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
                          onChange={(e) => handleDuration(e)}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="365"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-center font-semibold"
                            value={tripDetails.duration}
                            onChange={(e) => handleDuration(e)}
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
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                      {[
                        { value: 'car', label: 'Car', icon: 'car' },
                        { value: 'flight', label: 'Flight', icon: 'flight' },
                        { value: 'train', label: 'Train', icon: 'train' },
                        { value: 'bus', label: 'Bus', icon: 'bus' },
                        { value: 'bike', label: 'Bike', icon: 'bike' },
                        { value: 'sharing', label: 'Sharing', icon: 'sharing' }
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
                        { value: 'hotel', label: 'Hotel', icon: faHotel },
                        { value: 'hostel', label: 'Hostel', icon: faBed },
                        { value: 'resort', label: 'Resort', icon: faUmbrellaBeach },
                        { value: 'airbnb', label: 'Air Bnd', icon: faAirbnb }
                      ].map(type => (
                        <button
                          key={type.value}
                          onClick={() => setTripDetails({ ...tripDetails, accommodation: type.value })}
                          className={`p-3 rounded-md text-xs font-medium transition-all border-2 flex flex-col items-center gap-1 ${tripDetails.accommodation === type.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <FontAwesomeIcon
                            icon={type.icon}
                            className="text-lg"
                          />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

                      Meal Preference
                    </label>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                      {[
                        { value: 'all', label: 'All Meals', icon: faUtensils },
                        { value: 'veg', label: 'Veg', icon: faSeedling },
                        { value: 'non_veg', label: 'Non-Veg', icon: faDrumstickBite }
                      ].map(meal => (
                        <button
                          key={meal.value}
                          onClick={() => setTripDetails({ ...tripDetails, mealPreference: meal.value })}
                          className={`p-3 rounded-md text-xs font-medium transition-all border-2 flex flex-col items-center gap-1 ${tripDetails.mealPreference === meal.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <FontAwesomeIcon
                            icon={meal.icon}
                            className="text-lg"
                          />
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
                        { value: 'budget', label: 'Budget', icon: faPiggyBank },
                        { value: 'affordable', label: 'Affordable', icon: faHandHoldingDollar },
                        { value: 'luxury', label: 'Luxury', icon: faMoneyBill1Wave },
                        { value: 'ultra_luxury', label: 'Ultra Luxury', icon: faCrown }
                      ].map(type => (
                        <button
                          key={type.value}
                          onClick={() => setTripDetails({ ...tripDetails, tripType: type.value })}
                          className={`p-3 rounded-md text-xs font-medium transition-all border-2 flex flex-col items-center gap-1 ${tripDetails.tripType === type.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <FontAwesomeIcon
                            icon={type.icon}
                            className="text-lg"
                          />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}


          <div className={`w-full h-full sm:hidden ${activeTab === "map" ? "block" : "hidden"}`}>
            <Map locations={locations} polylineCoords={polylineCoords} isActive={activeTab === "map"} />
          </div>


          {activeTab == "stops" && (
            <StopsTab tripDetails={tripDetails} setTripDetails={setTripDetails}
              locations={locations} setLocations={setLocations}
              suggestedPlaces={suggestedPlaces} setSuggestedPlaces={setSuggestedPlaces}
              routeModel={routeModel}
              setRouteModel={setRouteModel}
              isMountedRef = {isMountedRef}
              suggestionError={suggestionError}
              setSuggestionError={setSuggestionError}
            />
          )}
          {activeTab == "itineary" && (
            <div>
              <Itineary tripDetails={tripDetails} locations={locations} route={route} />
            </div>
          )}
        </div>
        <div className="w-3/4 h-full hidden sm:block">
          <Map locations={locations} polylineCoords={polylineCoords} />
        </div>
      </div>
    </div>
  )
}

export default Trip

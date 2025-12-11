import { useContext, useEffect, useState } from "react"
import { SearchContext } from "./SearchContext"
import { MapContainer, TileLayer } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { faBus, faCar, faLocationDot, faMapPin, faMotorcycle, faPlane, faRoute, faShip, faTrain } from "@fortawesome/free-solid-svg-icons";

function Trip() {

  const { selectedPlace, setSelectedPlace } = useContext(SearchContext)
  const [activeTab, setActiveTab] = useState("overview")
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

  const transportIcons = {
    flight: faPlane,
    train: faTrain,
    bus: faBus,
    car: faCar,
    bike: faMotorcycle,
    cruise: faShip,
  };


  useEffect(() => {
    return () => {
      setSelectedPlace(null);
    };
  }, []);

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
                  Plan Your {selectedPlace?.properties?.name} Trip
                </div>
                <p className="text-xs text-gray-500 mb-6">Fill in the details to get started</p>

                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faLocationDot} />
                      Starting Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., New Delhi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      value={tripDetails.startLocation}
                      onChange={(e) => setTripDetails({ ...tripDetails, startLocation: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faLocationDot} />
                      Ending Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Goa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      value={selectedPlace?.properties?.name}
                      onChange={(e) => setTripDetails({ ...tripDetails, endLocation: e.target.value })}
                    />
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
          <MapContainer className="h-full w-full -z-10"
            center={[28.6139, 77.2090]}
            zoom={10}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors">
            </TileLayer>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default Trip

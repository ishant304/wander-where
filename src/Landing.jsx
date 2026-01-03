import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Typewriter from "./Typewriter"
import image from './assets/image.png'
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { SearchContext } from "./SearchContext"

function Landing() {

  const { selectedPlace, setSelectedPlace } = useContext(SearchContext)
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate();
  const isSelectingRef = useRef(false)

  async function handleInput(e) {
    setInput(e.target.value)
  }

  useEffect(() => {

    if(isSelectingRef.current){
      isSelectingRef.current = false;
      return;
    }

    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        input + " India"
      )}&limit=5&lang=en`;

      const resp = await fetch(url);
      const data = await resp.json();

      const filteredData = data.features.filter(
        unit => unit?.properties?.countrycode === "IN"
      );

      setSuggestions(filteredData.slice(0, 3));
      setSelectedPlace(null);
      setError(false);
    }, 300); 

    return () => clearTimeout(timer);

  }, [input])

  function handelClick(e) {
    if (!selectedPlace) {
      e.preventDefault();
      setError(true)
    }
    else {
      navigate('/planyourtrip')
    }
  }


  return (
    <div>
      <div className="flex-row flex min-h-[calc(100vh-121px)]  w-full sm:px-10 px-6 lg:-mt-12 pt-16 lg:pt-0">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
          <div className="flex flex-col justify-center items-center text-3xl sm:text-[40px] leading-normal">
            <h1 className="text-center">Wondering where to go?</h1>
            <h1 className="text-center">Just <span className="text-teal-600">WanderWhere</span> it.</h1>
            <Typewriter />
          </div>
          <div className="text-center my-12 max-w-[700px]">
            From the snowy Himalayas to the beaches of Goa. WanderWhere brings every destination closer. Discover, plan, and customize your perfect itinerary in minutes, all designed with Indian travelers in mind.
          </div>
          <div className="w-full flex flex-col items-center justify-center sm:flex-row gap-4 min-w-[300px] max-w-[500px]">
            <div className="w-full flex-1 relative sm:w-1/2">
              <input className={`peer h-16 w-full outline-none rounded-lg px-4 pt-4 text-slate-700 border
                ${error
                  ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-300 ring-2 ring-red-300"
                  : "border-gray-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
                }`} type="text" value={input} id="place" onChange={(e) => handleInput(e)} />
              <label
                htmlFor="place"
                className={`absolute text-nowrap left-5 bottom-[20px] text-base text-slate-700 transform transition-all duration-300 ease-in-out 
                ${input !== ''
                    ? '-translate-y-3 scale-[0.8] -translate-x-7'
                    : 'translate-y-0 scale-100 text-slate-700'}
                peer-focus:-translate-y-3 peer-focus:scale-[0.8] peer-focus:-translate-x-7`}>
                Where are you planning to go?
              </label>
              {input.length > 0 && (
                <ul className="absolute z-50 w-full mt-[2px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setInput(item.properties.name);
                        setSelectedPlace(item);
                        setSuggestions([]);
                        isSelectingRef.current = true;
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
            <button className="h-16 w-32 rounded-lg bg-gradient-to-r from-[rgb(94,221,189)]  to-[rgb(27,193,199)]" onClick={(e) => handelClick(e)}>Plan
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="text-xs text-red-600 mt-2 hidden">
            <FontAwesomeIcon icon={faCircleXmark} />
            Enter a valid place</div>
          <div className="flex flex-row gap-2 mt-6">
            <p>Not sure where to go?</p>
            <Link to='/exploremap' className="text-teal-600">Explore the map
              <FontAwesomeIcon className="ml-1" icon={faArrowRight} />
            </Link>

          </div>
        </div>
        <div className="w-1/2 hidden lg:flex items-center justify-center">
          <img className="xl:h-2/3 h-1/2 object-contain rounded-[35px]" src={image} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Landing

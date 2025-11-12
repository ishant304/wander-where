import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Typewriter from "./Typewriter"
import image from './assets/image.png'
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router"

function Landing() {

  const [input, setInput] = useState('')
  const navigate = useNavigate();

  function handleInput(e) {
    setInput(e.target.value)
  }



  return (
    <div>
      <div className="flex-row flex h-[calc(100vh-105px)] sm:h-[calc(100vh-121px)] w-full sm:px-10 px-6">
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
              <input className="peer h-16 w-full border border-gray-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none rounded-lg px-4 pt-4 text-slate-700" type="text" id="place" onChange={(e) => handleInput(e)} />
              <label
                htmlFor="place"
                className={`absolute text-nowrap left-5 bottom-[20px] text-base text-slate-700 transform transition-all duration-300 ease-in-out 
                ${input !== ''
                ? '-translate-y-3 scale-[0.8] -translate-x-7'
                : 'translate-y-0 scale-100 text-slate-700'}
                peer-focus:-translate-y-3 peer-focus:scale-[0.8] peer-focus:-translate-x-7`}>
              Where are you planning to go?
              </label>
            </div>
            <button className="h-16 w-32 rounded-lg bg-gradient-to-r from-[rgb(94,221,189)]  to-[rgb(27,193,199)]" onClick={()=>navigate('/planyourtrip')}>Plan
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
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

import { NavLink, useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './assets/logo.png'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { useState } from 'react'


function Header() {

  const navigate = useNavigate();

  const [ham, viewHam] = useState(false)

  function handleHam() {
    if (ham === false)
      viewHam(true)
    else
      viewHam(false)
  }

  return (
    <>
      <div className='bg-teal-100 flex py-5 justify-between px-7 xl:px-28 lg:px-20 z-50 border-b-teal-500 border-b shadow-lg'>
        <div className='flex items-center'>
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-3 bg-transparent border-0 p-0 focus:outline-none'
            aria-label='Go to home'
          >
            <img src={logo} alt="WanderWhere logo" className='h-16 sm:h-20' />
            <h2 className='text-4xl hidden sm:block select-none'>WanderWhere</h2>
          </button>
        </div>
        <div className='flex items-center gap-4 justify-center text-lg sm:gap-10'>
          <NavLink to='/' className='hidden lg:block'>Home</NavLink>
          <NavLink to='/explore' className='hidden lg:block'>Explore</NavLink>
          <NavLink to='/features' className='hidden lg:block'>Features</NavLink>
          <button onClick={() => navigate('/planyourtrip')} className={`whitespace-nowrap rounded-full px-4 py-2 bg-gradient-to-r from-[rgb(94,221,189)]  to-[rgb(27,193,199)] ${ham ? "hidden" : "block"} `}>Plan your trip</button>
          <button className={`text-xl lg:hidden z-20`} onClick={handleHam}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
      <div className={`fixed flex flex-col items-center justify-center z-[15] gap-12 top-0 right-0 h-screen w-1/2 bg-teal-100 shadow-xl transition-transform duration-300 border-l-teal-500 border-l ${ham ? "translate-x-0" : "translate-x-full"}`}>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/explore'>Explore</NavLink>
        <NavLink to='/features'>Features</NavLink>
        <button onClick={() => navigate('/planyourtrip')} className='rounded-full px-3 py-1 bg-gradient-to-r from-[rgb(94,221,189)]  to-[rgb(27,193,199)]'>
          Plan your trip
        </button>
      </div>
    </>
  )
}

export default Header

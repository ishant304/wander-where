import { faClock } from "@fortawesome/free-regular-svg-icons"
import { faArrowRightLong, faCar, faEllipsisH, faHouseCircleCheck, faMapLocationDot, faPlus, faRoad, faRoute, faTriangleExclamation, faUtensils } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useMemo, useState } from "react"

function Itineary({ tripDetails, locations, route }) {

    const [activeTab, setActiveTab] = useState("route")
    const [carMileage, setCarMileage] = useState(15)
    const [bikeMileage, setBikeMileage] = useState(30)

    const itineary = useMemo(() => {

        if (!route || locations.length < 2) return [];

        const tempItineary = Array.from({ length: tripDetails.duration },
            (_, i) => (
                {
                    day: i + 1,
                    stops: [],
                    legs: [],
                    summary: { distance: 0, duration: 0 }
                }
            ))

        locations.forEach((stop, index) => {

            tempItineary[stop.day - 1].stops.push(stop);

            if (route.legs[index]) {
                tempItineary[stop.day - 1].legs.push(route.legs[index])
                tempItineary[stop.day - 1].summary.distance += route.legs[index].distance
                tempItineary[stop.day - 1].summary.duration += route.legs[index].duration
            }

        });

        return tempItineary.filter(place => place.stops.length > 0)

    }, [route])

    const budget = useMemo(() => {

        if (!tripDetails) return null;

        const accommodationType = {
            hotel: {
                budget: 900,
                affordable: 1600,
                luxury: 3500,
                ultra_luxury: 7000
            },
            hostel: {
                budget: 450,
                affordable: 800,
                luxury: 1500,
                ultra_luxury: 1500
            },
            resort: {
                budget: 2000,
                affordable: 3000,
                luxury: 6000,
                ultra_luxury: 12000
            },
            airbnb: {
                budget: 1500,
                affordable: 2500,
                luxury: 5500,
                ultra_luxury: 10000
            }
        }

        const accommodationRate =
            accommodationType[tripDetails.accommodation]?.[
            tripDetails.tripType
            ] ?? 0;

        const rooms =
            tripDetails.accommodation === "hostel"
                ? tripDetails.travelers
                : Math.ceil(tripDetails.travelers / 2);

        const accommodationCost = accommodationRate * tripDetails.duration * rooms;

        const mealType = {
            veg: {
                budget: 400,
                affordable: 600,
                luxury: 1000,
                ultra_luxury: 2000
            },
            non_veg: {
                budget: 600,
                affordable: 800,
                luxury: 1500,
                ultra_luxury: 3000
            },
            all: {
                budget: 500,
                affordable: 700,
                luxury: 1250,
                ultra_luxury: 2500
            }
        }

        const mealRate = mealType[tripDetails.mealPreference][tripDetails.tripType]

        const mealCost = mealRate * tripDetails.duration * tripDetails.travelers;

        const totalDistance = (itineary.reduce(
            (sum, day) => sum + (day.summary?.distance || 0),
            0
        ) / 1000).toFixed(0);

        let transportationCost = 0

        if (tripDetails.transportation == "car") {
            transportationCost = (totalDistance / carMileage * 90).toFixed(0)
        }

        if (tripDetails.transportation == "bike") {
            transportationCost = (totalDistance / bikeMileage * 90).toFixed(0)
        }

        if (tripDetails.transportation == "bus") {
            const busCost = {
                budget: 1.5,
                affordable: 2.5,
                luxury: 3.5,
                ultra_luxury: 5
            }

            const busRate = busCost[tripDetails.tripType]

            transportationCost = Math.round(busRate * totalDistance / 10) * 20 * tripDetails.travelers;
        }

        if (tripDetails.transportation == "train") {

            if (tripDetails.tripType == "budget") {
                const baseFare = 520;
                const thresholdKm = 250;
                const perKmRate = 1.1;

                if (totalDistance <= thresholdKm) {
                    transportationCost = baseFare
                }
                else {
                    transportationCost = Math.round((baseFare + (totalDistance - thresholdKm) * perKmRate) / 10) * 20 * tripDetails.travelers
                }
            }

            if (tripDetails.tripType == "affordable") {
                const baseFare = 750
                const thresholdKm = 250;
                const perKmRate = 1.35

                if (totalDistance <= thresholdKm) {
                    transportationCost = baseFare
                }
                else {
                    transportationCost = Math.round((baseFare + (totalDistance - thresholdKm) * perKmRate) / 10) * 20 * tripDetails.travelers
                }

            }

            if (tripDetails.tripType == "luxury" || tripDetails.tripType == "ultra_luxury") {

                const baseFare = 1250;
                const thresholdKm = 250;
                const perKmRate = 2.15;

                if (totalDistance <= thresholdKm) {
                    transportationCost = baseFare
                }
                else {
                    transportationCost = Math.round((baseFare + (totalDistance - thresholdKm) * perKmRate) / 10) * 20 * tripDetails.travelers
                }

            }

        }

        if (tripDetails.transportation == "flight") {
            const baseFare = 2500;
            const thresholdKm = 300;
            const perKmRate = 4

            if (totalDistance <= thresholdKm) {
                transportationCost = baseFare
            }
            else {
                transportationCost = Math.round((baseFare + (totalDistance - thresholdKm) * perKmRate) / 100) * 200 * tripDetails.travelers
            }
        }

        if (tripDetails.transportation == "sharing") {

            const perKmRate = 2.2;

            transportationCost = Math.round(totalDistance * perKmRate * tripDetails.travelers / 10) * 20
        }

        transportationCost = Number(transportationCost)

        const miscCharges = {
            budget: 100,
            affordable: 200,
            luxury: 500,
            ultra_luxury: 1000
        }

        const miscCost = miscCharges[tripDetails.tripType] * tripDetails.duration * tripDetails.travelers

        const totalCost = accommodationCost + mealCost + transportationCost + miscCost


        return {
            accommodationCost: accommodationCost,
            mealCost: mealCost,
            transportationCost: transportationCost,
            miscCost: miscCost,
            totalCost: totalCost
        }

    }, [tripDetails, itineary, carMileage, bikeMileage])

    useEffect(() => {
        window.itineary = itineary
        window.budget = budget
    }, [itineary, budget])

    return (
        <div>
            <div className="w-full h-16 flex pt-4 ">
                <button onClick={() => setActiveTab("route")} className={`w-1/2 text-center text-xl pb-2 ${activeTab === "route" ? "border-b-[6px] border-teal-600" : ""}`}>
                    Route
                </button>
                <button onClick={() => setActiveTab("budget")} className={`w-1/2 text-center text-xl pb-2 ${activeTab === "budget" ? "border-b-[6px] border-teal-600" : ""}`}>
                    Budget
                </button>
            </div>

            {
                tripDetails.endLocation != "" && tripDetails.startLocation != "" ? (
                    <>
            {
                activeTab === "route" && (
                    <div className="p-4">
                        <div className="pt-3 text-2xl font-bold text-gray-800 mb-2">
                            Your Trip, Day by Day
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Overview of your route, daily plan, and travel flow.</p>
                        <div className="mt-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 -2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                            <div>
                                <h3 className="text-nowrap text-2xl font-black mb-6">Trip Summary</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-md leading-tight  mb-1 font-bold tracking-wide">Total Days</div>
                                        <div className="text-md   mb-1 font-bold tracking-wide leading-tight">{tripDetails.duration} days</div>
                                    </div>
                                    <div>
                                        <div className="text-md leading-tight   mb-1 font-bold tracking-wide">Total Stops</div>
                                        <div className="text-md   mb-1 font-bold tracking-wide leading-tight">{locations.length} stops</div>
                                    </div>
                                    <div>
                                        <div className="text-md   mb-1 font-bold tracking-wide">Distance</div>
                                        <div className="text-md   mb-1 font-bold tracking-wide leading-tight">{(route?.distance / 1000).toFixed(1) + " km"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-md   mb-1 font-bold tracking-wide">Travel Time</div>
                                        <div className="text-md   mb-1 font-bold tracking-wide">{Math.floor(route?.duration / 3600) + " h " + Math.round((route?.duration % 3600) / 60) + " m"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-4 mt-12 flex flex-row relative">
                            <div className="absolute top-4 w-2 bottom-11 bg-teal-600 rounded-full ml-10 -z-10">
                            </div>
                            <div className="w-full">
                                {
                                    itineary.map((item, outerIndex) => (
                                        <div key={item.day} className="flex flex-row items-start">
                                            <div className="min-w-[85px] bg-white rounded-2xl border-4 border-teal-600 px-4 py-3 flex flex-col items-center justify-center mb-4">
                                                <div>
                                                    <p className="text-sm uppercase tracking-wide text-gray-700">
                                                        Day {item.day}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-6 flex flex-col gap-6 w-full">

                                                {item.stops.map((stop, index) => (
                                                    <div key={stop.id} className="flex flex-col gap-3 max-w-full">

                                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">
                                                                {stop.id === "start" ? "Departure" : outerIndex === itineary.length - 1 ? "Destination" : "Stop"}
                                                            </p>
                                                            <h3 className="text-lg font-semibold text-gray-800">
                                                                {stop.name}
                                                            </h3>
                                                        </div>

                                                        {item.legs[index] && (
                                                            <div className="ml-6 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 shadow-inner mb-3">

                                                                <div className="flex items-center gap-4 flex-wrap">

                                                                    <div className="flex items-center gap-2">
                                                                        <FontAwesomeIcon className="text-teal-600" icon={faRoute} />
                                                                        <span>
                                                                            {(item.legs[index].distance / 1000).toFixed(1)} km
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <FontAwesomeIcon className="text-teal-600" icon={faClock} />
                                                                        <span>
                                                                            {Math.floor(item.legs[index].duration / 3600)}h{" "}
                                                                            {Math.round((item.legs[index].duration % 3600) / 60)}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <FontAwesomeIcon className="text-teal-600" icon={faRoad} />
                                                                        <span title={item.legs[index].summary?.replace(",", " &")} className="capitalize truncate max-w-44">
                                                                            {item.legs[index].summary?.replace(",", " &")}
                                                                        </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            {
                activeTab === "budget" && (
                    <div className="p-4">
                        <div className="pt-3 text-2xl font-bold text-gray-800 mb-2">
                            Budget Overview
                        </div>
                        <p className="text-xs text-gray-500 mb-6">A smart cost estimate based on your travel choices.</p>
                        <div className="mt-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2">Estimated Trip Cost</h3>
                                <p className="text-white/80 mb-6">
                                    Calculated from your trip preferences
                                </p>

                                <div className="mb-2">
                                    <div className="text-4xl font-extrabold leading-tight">
                                        ₹{budget.totalCost.toLocaleString()}
                                    </div>
                                    <div className="mt-2 text-sm text-white/80">
                                        ₹{Math.round(budget.totalCost / tripDetails.travelers)} per person ·
                                        ₹{Math.round(budget.totalCost / tripDetails.duration)} per day
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 mb-3 text-lg text-gray-700">What's driving your cost?</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-start gap-4 px-5 py-4 bg-teal-50 border border-teal-100 rounded-2xl hover:bg-teal-100/60 transition w-full">

                                <div className="text-2xl mt-1">
                                    <FontAwesomeIcon
                                        className="text-teal-600"
                                        icon={faHouseCircleCheck}
                                    />
                                </div>

                                <div className="flex-1">

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-slate-900">
                                            Accommodation
                                        </span>

                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                                            {((budget.accommodationCost / budget.totalCost) * 100).toFixed(0)}%
                                        </span>
                                    </div>

                                    <div className="text-sm font-semibold text-slate-800 mt-1">
                                        ₹{budget.accommodationCost.toLocaleString()}
                                    </div>

                                    <div className="text-xs font-bold text-slate-600 mt-1">
                                        <span className="capitalize">{tripDetails.accommodation} </span>· {tripDetails.accommodation == "hostel" ? tripDetails.travelers + " beds" : Math.ceil(tripDetails.travelers / 2) + " rooms"} · {tripDetails.duration} nights
                                    </div>

                                    <div className="text-xs text-slate-500 mt-1">
                                        {tripDetails.accommodation == "hostel" ? `≈ ₹${Math.round(budget.accommodationCost / (tripDetails.travelers * tripDetails.duration)).toLocaleString()} per bed / night` : `≈ ₹${Math.round(budget.accommodationCost / (Math.ceil(tripDetails.travelers / 2) * tripDetails.duration)).toLocaleString()} per room / night`}

                                    </div>

                                </div>
                            </div>


                            <div className="flex items-start gap-4 px-5 py-4 bg-teal-50 border border-teal-100 rounded-2xl hover:bg-teal-100/60 transition w-full">

                                <div className="text-2xl mt-1">
                                    <FontAwesomeIcon className="text-teal-600" icon={faCar} />
                                </div>

                                <div className="flex-1">

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-slate-900">
                                            Transportation
                                        </span>

                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                                            {((budget.transportationCost / budget.totalCost) * 100).toFixed(0)}%
                                        </span>
                                    </div>

                                    <div className="text-sm font-semibold text-slate-800 mt-1">
                                        ₹{budget.transportationCost.toLocaleString()}
                                    </div>

                                    <div className="text-xs font-bold text-slate-600 mt-1">
                                        <span className="capitalize">{tripDetails.transportation} </span>· {(itineary.reduce(
                                            (sum, day) => sum + (day.summary?.distance || 0),
                                            0
                                        ) / 1000).toFixed(0)} km
                                    </div>

                                    <div className="text-xs text-slate-500 mt-1">
                                        {
                                            tripDetails.transportation == "car" ? (
                                                <>
                                                    <p>Car's mileage (default i.e. 15) : </p>
                                                    <input type="number" className="w-12 px-2 py-1 mt-1 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-300" value={carMileage} onChange={(e) => setCarMileage(e.target.value)} />
                                                </>
                                            ) : tripDetails.transportation == "bike" ? (
                                                <>
                                                    <p>Bike's mileage (default i.e. 30) : </p>
                                                    <input type="number" className="w-12 px-2 py-1 mt-1 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-300" value={bikeMileage} onChange={(e) => setBikeMileage(e.target.value)} />
                                                </>
                                            ) : (
                                                <>
                                                    <p>Round Trip cost : {budget.transportationCost.toLocaleString()}</p>
                                                    <p>One Way cost : {(budget.transportationCost / 2).toLocaleString()}</p>
                                                </>
                                            )
                                        }
                                    </div>

                                </div>
                            </div>

                            <div className="flex items-start gap-4 px-5 py-4 bg-teal-50 border border-teal-100 rounded-2xl hover:bg-teal-100/60 transition w-full">

                                <div className="text-2xl mt-1">
                                    <FontAwesomeIcon
                                        className="text-teal-600"
                                        icon={faUtensils}
                                    />
                                </div>

                                <div className="flex-1">

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-slate-900">
                                            Meals
                                        </span>

                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                                            {((budget.mealCost / budget.totalCost) * 100).toFixed(0)}%
                                        </span>
                                    </div>

                                    <div className="text-sm font-semibold text-slate-800 mt-1">
                                        ₹{budget.mealCost.toLocaleString()}
                                    </div>

                                    <div className="text-xs font-bold text-slate-600 mt-1">
                                        <span className="capitalize">{tripDetails.mealPreference} </span> · {tripDetails.duration} days · {tripDetails.travelers} people
                                    </div>

                                    <div className="text-xs text-slate-500 mt-1">
                                        ≈ ₹{Math.round(
                                            budget.mealCost /
                                            (tripDetails.duration * tripDetails.travelers)
                                        ).toLocaleString()} per person / day
                                    </div>

                                </div>
                            </div>



                            <div className="flex items-start gap-4 px-5 py-4 bg-teal-50 border border-teal-100 rounded-2xl hover:bg-teal-100/60 transition w-full">

                                <div className="text-2xl mt-1">
                                    <FontAwesomeIcon
                                        className="text-teal-600"
                                        icon={faEllipsisH}
                                    />
                                </div>

                                <div className="flex-1">

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-slate-900">
                                            Miscellaneous
                                        </span>

                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                                            {((budget.miscCost / budget.totalCost) * 100).toFixed(0)}%
                                        </span>
                                    </div>

                                    <div className="text-sm font-semibold text-slate-800 mt-1">
                                        ₹{budget.miscCost.toLocaleString()}
                                    </div>

                                    <div className="text-xs font-bold text-slate-600 mt-1">
                                        Tickets · Dailt Essentials · Tips
                                    </div>

                                    <div className="text-xs text-slate-500 mt-1">
                                        ≈ ₹{Math.round(
                                            budget.miscCost /
                                            (tripDetails.duration * tripDetails.travelers)
                                        ).toLocaleString()} per person / day
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                )
            }
            </>
                ) : (<>
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 mt-48">

                        <div className="mb-4 rounded-full bg-teal-50 p-4">
                            <FontAwesomeIcon
                                icon={faMapLocationDot}
                                className="text-teal-600 text-3xl"
                            />
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Build your journey
                        </h2>

                        <p className="text-sm text-gray-500 max-w-sm mb-6">
                            Add a starting location and a destination to see the route,
                            timeline, and travel details.
                        </p>

                        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <span>Select places to get started</span>
                        </div>

                    </div>
                </>)
            }



        </div >
    )
}

export default Itineary

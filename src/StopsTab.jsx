import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";
import { faCheck, faLink, faLocationDot, faMagnifyingGlass, faMagnifyingGlassLocation, faMapPin, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react";
import DaysColumn from "./DaysColumn";
import SortableStops from "./SortableStops";
import { arrayMove } from "@dnd-kit/sortable";

function StopsTab({ suggestedPlaces, setSuggestedPlaces, locations, setLocations, routeModel, setRouteModel }) {

  const [activeId, setActiveId] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [searchSuggestion, setSearchSuggestion] = useState()
  const [loadingSuggestedPlaces, setLoadingSuggestedPlaces] = useState(false)
  const [suggestionError, setSuggestionError] = useState(false)
  const retrySuggestionRef = useRef(0)

  async function handleSubmit(e) {
    e.preventDefault();
    const value = searchInput

    if (value.trim() === "") {
      return;
    }

    const rawData = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value + ",india")}&key=0b37e65606bf435f95a9915069d9e07f`)
    const data = await rawData.json()

    console.log(data)

    setSearchSuggestion(data)

    setSearchInput("")

  }

  function handleClick(data) {

    setRouteModel("editing")

    setLocations((prev) => [...prev.filter(place => place.id != "end"), {
      id: `stop${crypto.randomUUID()}`,
      name: `${data.tags.name}`,
      coords: [data.lat, data.lon],
      day: Math.floor(1 + tripDetails.duration / 2)
    }, ...prev.filter(place => place.id == "end")])

  }

  function handleSearchClick() {

    setRouteModel("editing")

    setLocations((prev) => [
      ...prev.filter(place => place.id !== "end"), {
        id: `stop${crypto.randomUUID()}`,
        name: searchSuggestion.results[0].formatted.split(",")[0],
        coords: [searchSuggestion.results[0].geometry.lat, searchSuggestion.results[0].geometry.lng],
        day: Math.floor(1 + tripDetails.duration / 2)
      }, ...prev.filter(place => place.id === "end")
    ])

  }

  function handleGenerateRoute() {

    setRouteModel("final")


  }

  function handleDragEnd(event) {
    const { active, over } = event

    if (over && active.id !== over.id) {

      if (over.id.startsWith("stop") || over.id === "end") {
        setLocations((prev) => {
          const updated = [...prev];

          const activeIndex = updated.findIndex(item => item.id === active.id);
          const overIndex = updated.findIndex(item => item.id === over.id);

          const activeItem = updated[activeIndex]
          const overItem = updated[overIndex]

          if (!activeItem || !overItem) return prev;

          if (activeItem.day === overItem.day) {
            return arrayMove(updated, activeIndex, overIndex)
          }

          activeItem.day = overItem.day;
          return arrayMove(updated, activeIndex, overIndex)
        })
      }

      if (over.id.startsWith("day")) {
        setLocations((prev) => {
          const updated = [...prev]

          const activeItem = updated.find(item => item.id === active.id);

          if (!activeItem) return prev;

          activeItem.day = Number(over.id.replace("day", ""))

          updated.sort((a, b) => a.day - b.day);

          return updated

        })
      }

    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {

    setRouteModel("editing")

  }, [])

  useEffect(() => {

    if (!locations || locations.length === 0 || suggestedPlaces.length > 0) return;

    const fetchPlacesNearDestination = async () => {

      setLoadingSuggestedPlaces(true);
      setSuggestionError(false);

      try {

        const dest = locations.find(loc => loc.id == "end")
        const lat = dest.coords[0]
        const lng = dest.coords[1]

        const query = `[out:json];
(
  node["place"="city"]["population"](around:70000,${lat},${lng});
  node["place"="town"]["population"](around:70000,${lat},${lng});
);
out body;`

        let rawData = await fetch("https://overpass-api.de/api/interpreter", {
          method: "post",
          headers: { "Content-Type": "text/plain" },
          body: query
        })

        if (!rawData.ok) {
          throw new Error("API_failed")
        }

        let data = await rawData.json()

        let tempPlaces = data.elements

        tempPlaces = tempPlaces.filter(place => Number(place.tags.population) % 1000 != 0)

        tempPlaces = tempPlaces.slice(0, 6)

        console.log(tempPlaces)

        setSuggestedPlaces(tempPlaces)
        setLoadingSuggestedPlaces(false)

      }
      catch (err) {
        if (retrySuggestionRef.current < 5) {
          retrySuggestionRef.current += 1
          return fetchPlacesNearDestination()
        }
        else {
          setSuggestionError(true)
          setLoadingSuggestedPlaces(false)
        }
      }



    }

    fetchPlacesNearDestination();

  }, [locations])

  return (
    <div>
      <div className="p-6 h-full">
        <div className="pt-6 text-2xl font-bold text-gray-800 mb-2">
          Add Your Stops
        </div>
        <p className="text-xs text-gray-500 mb-6">Add the places you want to visit</p>

        <p className="mb-3 text-gray-700">Search for Custom Stops</p>
        <div className="relative">
          <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Search for places..." className="w-full px-3 py-2 border rounded-md text-sm border-gray-500" value={searchInput} onChange={((e) => setSearchInput(e.target.value))} />
            <button type="submit" className="absolute top-[6px] right-2"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          </form>
          {
            searchSuggestion?.results?.length > 0 && (
              <div className="w-full rounded-md border-gray-400 border mt-4">
                <div className="p-4">
                  <p className="font-bold text-sm text-gray-700 overflow-hidden text-ellipsis max-w-48 pb-1">{searchSuggestion.results[0].formatted.split(",")[0]}</p>
                  <p className="text-xs text-gray-500 max-w-48 whitespace-nowrap overflow-hidden text-ellipsis underline"><FontAwesomeIcon className="mr-2" icon={faMapPin} />{searchSuggestion.results[0].components.state + ", " + searchSuggestion.results[0].components.country}</p>
                  <p className="text-xs text-gray-500 max-w-48 whitespace-nowrap overflow-hidden text-ellipsis mt-2 underline"><FontAwesomeIcon className="mr-2" icon={faLink} />{searchSuggestion.results[0].annotations.wikidata ? <a target="_blank" href={`https://www.wikidata.org/wiki/${searchSuggestion.results[0].annotations.wikidata}`}>{searchSuggestion.results[0].annotations.wikidata}</a> : "N/A"}</p>
                  {
                    locations.some(loc => loc.name == searchSuggestion.results[0].formatted.split(",")[0]) ? (<button className="w-full py-2 rounded-lg text-xs font-medium bg-teal-200 mt-3 cursor-not-allowed" disabled><FontAwesomeIcon className="mr-2" icon={faCheck} />Added to trip</button>) : (<button className="w-full py-2 rounded-lg text-xs font-medium bg-teal-400 mt-3" onClick={() => handleSearchClick()}>Add to trip</button>)
                  }

                </div>
              </div>
            )
          }
        </div>

        {
          tripDetails.endLocation != "" && tripDetails.startLocation != "" ? (<>

            <div>
              <p className="text-base mb-2 mt-6 text-gray-700">Place to visit near Destination</p>
              <div className={`flex flex-row gap-4 pb-4 whitespace-nowrap ${loadingSuggestedPlaces ? "overflow-hidden" : "overflow-x-auto"} `}>
                {!loadingSuggestedPlaces && suggestedPlaces && suggestedPlaces.filter(item=>item?.tags.name!==tripDetails.endLocation).length > 0 ? (
                  suggestedPlaces.map((place) =>

                    place.tags.name != tripDetails.endLocation && (
                      <div key={place.id}>
                        <div className="w-48 rounded-md border-gray-400 border">
                          <div className="p-4">
                            <p className="font-bold text-sm text-gray-700 overflow-hidden text-ellipsis max-w-48 pb-1">{place.tags.name}</p>
                            <p className="text-xs text-gray-500 max-w-48 whitespace-nowrap overflow-hidden text-ellipsis underline"><FontAwesomeIcon className="mr-2" icon={faWikipediaW} />{place.tags.wikipedia ? <a target="_blank" href={`https://en.wikipedia.org/wiki/${place.tags.wikipedia.slice(3)}`}
                            >{place.tags.name}</a> : "N/A"}</p>
                            <p className="text-xs text-gray-500 max-w-48 whitespace-nowrap overflow-hidden text-ellipsis mt-2 underline"><FontAwesomeIcon className="mr-2" icon={faLink} />{place.tags.wikidata ? <a target="_blank" href={`https://www.wikidata.org/wiki/${place.tags.wikidata}`}>{place.tags.wikidata}</a> : "N/A"}</p>
                            {
                              locations.some(loc => loc.name == place.tags.name) ? (<button className="w-full py-2 rounded-lg text-xs font-medium bg-teal-200 mt-3 cursor-not-allowed" disabled><FontAwesomeIcon className="mr-2" icon={faCheck} />Added to trip</button>) : (<button className="w-full py-2 rounded-lg text-xs font-medium bg-teal-400 mt-3" onClick={() => handleClick(place)}>Add to trip</button>)
                            }

                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : loadingSuggestedPlaces ? (
                  <>
                    {
                      Array.from({ length: 3 }, (_, id) => (<>
                        <div className="overflow-hidden min-w-48 rounded-md border border-gray-400 animate-pulse">
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4" />
                            <div className="h-3 bg-gray-300 rounded w-full" />
                            <div className="h-3 bg-gray-300 rounded w-2/3 mt-2" />
                            <div className="h-8 bg-gray-300 rounded-lg mt-3" />
                          </div>
                        </div>
                      </>))
                    }
                  </>
                ) : suggestionError ? (
                  <>
                    <div className="w-full flex flex-col items-center justify-center py-8 text-center">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl text-gray-400 mb-2"/>

                      <p className="text-sm font-medium text-gray-700">
                        Unable to load nearby places
                      </p>

                      <p className="text-xs text-gray-500 mt-1 max-w-xs">
                        The server is not responding right now. <br /> Please try again in a moment.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full flex flex-col items-center justify-center py-8 text-center">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-3xl text-gray-400 mb-2"
                      />

                      <p className="text-sm font-medium text-gray-700">
                        No nearby places found
                      </p>

                      <p className="text-xs text-gray-500 mt-1 max-w-xs">
                        We couldn’t find any place nearby destination.
                      </p>
                    </div>
                  </>
                )
                }
              </div>
            </div>




            <h1 className="mt-10 text-2xl font-bold text-gray-800 mb-2 ">Reorder you stops</h1>
            <p className="text-xs text-gray-500 mb-8">Drag stops to reorder your list</p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => { setActiveId(null); handleDragEnd(event) }}
              onDragStart={(event) => setActiveId(event.active.id)}
              onDragCancel={() => setActiveId(null)}
            >
              {
                Array.from({ length: tripDetails.duration }).map((_, index) => (
                  <DaysColumn locations={locations} setLocations={setLocations} key={index} index={index} activeId={activeId} />
                ))
              }
              <DragOverlay>
                {
                  activeId ? (
                    <SortableStops item={locations.find(item => item.id === activeId)} isOverlay />
                  ) : null
                }
              </DragOverlay>
            </DndContext>
            <div>
              <button className="w-full h-12 bg-gradient-to-r from-[rgb(94,221,189)]  to-[rgb(27,193,199)] rounded-full mt-8 mb-4" onClick={handleGenerateRoute}>
                Generate Route
              </button>
            </div>
          </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-40 text-center px-6">

              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 mb-6">
                <FontAwesomeIcon
                  icon={faMagnifyingGlassLocation}
                  className="text-teal-600 text-3xl"
                />
              </div>

              <h1 className="text-lg font-semibold text-gray-800">
                Set destination and departure
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xs">
                Please add starting and ending location to start discovering stops along your route.
              </p>

              <div className="flex items-center gap-2 mt-4 text-teal-600 text-sm">
                <span><FontAwesomeIcon className="pr-2" icon={faTriangleExclamation} />Stops are unavailable until locations are set</span>
              </div>

            </div>
          )
        }
      </div>
    </div>
  )
}

export default StopsTab;

import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faLink, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import DaysColumn from "./DaysColumn";
import SortableStops from "./SortableStops";
import { arrayMove } from "@dnd-kit/sortable";

function StopsTab({ suggestedSightseeing, setSuggestedSightseeing, suggestedPlaces, setSuggestedPlaces, locations, setLocations, routeModel }) {

  const [activeId, setActiveId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleClick(data) {

    console.log(data)

    setLocations((prev) => [...prev.filter(place => place.id != "end"), {
      id: `stop${locations.length - 1}`,
      name: `${data.tags.name}`,
      coords: [data.lat, data.lon],
      day: Math.floor(1 + tripDetails.duration / 2)
    }, ...prev.filter(place => place.id == "end")])

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

          return [...updated]

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

  useEffect(()=>{

    routeModel.current = "editing";

    return ()=>{

      routeModel.current = "initial"
    }

  },[])

  useEffect(() => {
    if (!locations?.length || suggestedSightseeing?.length > 0) return;

    const fetchPlaces = async () => {
      const coords = locations
        .filter(loc => loc.id != "start")
        .map(c => `${c.coords[1]},${c.coords[0]}`)
        .toString();

      if (!coords) return;

      const url = `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights.fort,tourism.sights.archaeological_site,tourism.attraction.viewpoint,religion.place_of_worship.hinduism&filter=circle:${coords},20000&limit=5&apiKey=466a96c44cad45f1b4134c82b52e4d65`;

      const rawData = await fetch(url);
      const data = await rawData.json();
      console.log(data);

      setSuggestedSightseeing(data.features);
    };

    fetchPlaces();
  }, [locations]);

  useEffect(() => {

    if (!locations || locations.length === 0 || suggestedPlaces.length > 0) return;

    const fetchPlacesNearDestination = async () => {
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
      let data = await rawData.json()

      let tempPlaces = data.elements

      tempPlaces = tempPlaces.filter(place => Number(place.tags.population) % 1000 != 0)

      tempPlaces = tempPlaces.slice(0, 6)

      console.log(tempPlaces)

      setSuggestedPlaces(tempPlaces)

    }

    fetchPlacesNearDestination();

  }, [locations])

  useEffect(() => {

    window.suggestedSightseeing = suggestedSightseeing

  }, [suggestedSightseeing]);

  return (
    <div>
      <div className="p-6">
        <div className="pt-6 text-2xl font-bold text-gray-800 mb-2">
          Add Your Stops
        </div>
        <p className="text-xs text-gray-500 mb-6">Add the places you want to visit</p>
        <div className="relative">
          <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Search for places..." className="w-full px-3 py-2 border rounded-md text-sm border-gray-500" />
            <button className="absolute top-[6px] right-2"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          </form>
        </div>
        {tripDetails.endLocation && (
          <div>
            <p className="text-base mb-2 mt-6 text-gray-700">Place to visit near Destination</p>
            <div className="flex flex-row gap-4 overflow-x-auto pb-4 whitespace-nowrap">
              {suggestedPlaces && suggestedPlaces.length > 0 && (
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
              )}
            </div>
          </div>
        )}

        

        {
          tripDetails.endLocation != "" || tripDetails.startLocation != "" ? (<>
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
                  <DaysColumn locations={locations} key={index} index={index} activeId={activeId} />
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
          </>
          ) : (
            <h1>Nothing is here</h1>
          )
        }
      </div>
    </div>
  )
}

export default StopsTab;

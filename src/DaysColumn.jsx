import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableStops from "./SortableStops"
import { useDroppable } from "@dnd-kit/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapPin } from "@fortawesome/free-solid-svg-icons"



function DaysColumn({ index, locations, activeId }) {

    const { setNodeRef, isOver } = useDroppable({ id: `day${index + 1}` })

    return (
        <div
            ref={setNodeRef}
            className={`mt-4 min-h-[60px] rounded-xl border bg-white shadow-sm border-gray-300`}
        >

            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl bg-gradient-to-r from-teal-500 to-teal-600 mb-4 px-6 py-3 text-white  ">
                <h1 className="text-lg font-semibold tracking-wide">
                    Day {index + 1}
                </h1>

                <span className="text-xs text-white/80">
                    {locations.filter(i => i.day === index + 1).length} stops
                </span>
            </div>

            {
                locations.filter(item => item.day === index + 1).length === 0 ?
                    <div className="flex flex-col justify-center items-center p-2">
                        <FontAwesomeIcon className="text-3xl text-gray-600 mb-2" icon={faMapPin} />
                        <h1 className="mb-3 text-sm text-gray-700">Drop Stops here</h1>
                    </div>
                    : <div className="px-2">
                        <SortableContext
                            items={locations.filter(item => item.day === index + 1).map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {locations
                                .filter(item => item.day === index + 1)
                                .map(item => (
                                    <SortableStops key={item.id} item={item} />
                                ))}
                        </SortableContext>
                    </div>
            }


        </div>
    )
}

export default DaysColumn

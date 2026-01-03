import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SortableStops({ item, isOverlay = false, activeId }) {

  if (isOverlay) {
    return (
      <div className="w-full h-auto border border-teal-500 rounded-md mb-4 p-4 cursor-grabbing shadow-2xl
">
        <div>
          <div className="relative flex justify-between">
            <div className="flex">
              <FontAwesomeIcon className="absolute top-1" icon={faGripVertical} />
              <h1 className="text-md text-gray-700 overflow-hidden text-ellipsis max-w-48 pb-1 pl-8 truncate">{item.name}</h1>
            </div>
            <FontAwesomeIcon className={`absolute right-0 top-1 ${item.id === "end" ? "cursor-not-allowed" : "cursor-pointer"}`} icon={faTrashCan} />
          </div>
        </div>
      </div>
    );
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled: item.id === "start" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };


  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`w-full h-auto border border-gray-400 rounded-md mb-4 p-4 ${item.id === "start" ? "opacity-80 cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}>
      {
        item.id === "start" ? (
          <div>
            <h1 className="text-sm text-gray-700 overflow-hidden text-ellipsis max-w-48 pb-1">{item.name}</h1>
          </div>
        ) :
          (
            <div>
              <div className="relative flex justify-between">
                <div className="flex">
                  <FontAwesomeIcon className="absolute top-1" icon={faGripVertical} />
                  <h1 className="text-md text-gray-700 overflow-hidden text-ellipsis max-w-48 pb-1 pl-8">{item.name}</h1>
                </div>
                <FontAwesomeIcon className={`absolute right-0 top-1 ${item.id === "end" ? "cursor-not-allowed" : "cursor-pointer"}`} icon={faTrashCan} />
              </div>
            </div>

          )

      }



    </div >
  )
}

export default SortableStops

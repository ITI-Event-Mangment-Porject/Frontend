"use client"
import { FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaCalendarPlus, FaEye, FaPlay, FaStop } from "react-icons/fa"

// Helper function to format time for display (e.g., "9:00 AM", "10:30 PM")
const formatTimeDisplay = (timeString) => {
  if (!timeString) return "N/A"

  // If it's already in HH:MM format, convert to 12-hour format
  if (timeString.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const minute = Number.parseInt(minutes, 10)

    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`
  }

  // Otherwise try to parse as date
  try {
    const time = new Date(timeString)
    if (isNaN(time.getTime())) return timeString // Return original if can't parse

    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } catch (e) {
    console.error("Error formatting time:", e)
    return timeString // Return original if can't parse
  }
}

export const getEventTableColumns = (
  handleEditClick,
  handleDeleteEvent,
  handlePublishEvent,
  handleArchiveEvent,
  handleViewDetails,
  handleStartEvent,
  handleEndEvent,
  actionLoading,
) => [
  {
    header: "Event",
    accessor: "title",
    render: (event) => (
      <div className="flex items-center">
        <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center overflow-hidden">
          <FaCalendarAlt className="text-gray-500" />
        </div>
        <span className="ml-2 text-sm font-medium">{event.title}</span>
      </div>
    ),
  },
  {
    header: "Date & Time",
    accessor: "date",
    render: (event) => (
      <div className="text-left text-sm text-[#8C8D8BFF]">
        <div>{new Date(event.start_date).toLocaleDateString("en-GB")}</div>
        <div className="text-xs">{event.start_time ? formatTimeDisplay(event.start_time) : "N/A"}</div>
      </div>
    ),
  },
  {
    header: "Location",
    accessor: "location",
    render: (event) => (
      <div className="flex items-center text-sm text-[#8C8D8BFF]">
        <FaMapMarkerAlt className="text-gray-400 mr-1" size={12} />
        {event.location || "N/A"}
      </div>
    ),
  },
  {
    header: "Type",
    accessor: "type",
    render: (event) => (
      <div className="text-left text-sm text-[#8C8D8BFF]">
        <div className="flex items-center">
          <FaCalendarPlus className="text-gray-400 mr-1" size={12} />
          {event.type || "N/A"}
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (event) => {
      let statusColor = "bg-gray-100 text-gray-800"

      switch (event.status?.toLowerCase()) {
        case "published":
          statusColor = "bg-blue-100 text-blue-800"
          break
        case "active":
        case "ongoing":
          statusColor = "bg-green-100 text-green-800"
          break
        case "cancelled":
          statusColor = "bg-red-100 text-red-800"
          break
        case "completed":
          statusColor = "bg-purple-100 text-purple-800"
          break
        case "draft":
          statusColor = "bg-gray-100 text-gray-800"
          break
        default:
          statusColor = "bg-gray-100 text-gray-800"
      }

      return <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>{event.status || "Draft"}</span>
    },
  },
  {
    header: "Actions",
    accessor: "actions",
    render: (event) => (
      <div className="flex gap-2 flex-wrap">
        {/* View Details button - always visible */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleViewDetails(event)
          }}
          className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 flex items-center"
          title="View Details"
        >
          <FaEye className="w-3 h-3 mr-1" />
          View
        </button>

        {/* Start Event button - only show for published events */}
        {event.status?.toLowerCase() === "published" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleStartEvent(event)
            }}
            disabled={actionLoading}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center"
            title="Start Event"
          >
            <FaPlay className="w-3 h-3 mr-1" />
            Start
          </button>
        )}

        {/* End Event button - only show for ongoing events */}
        {event.status?.toLowerCase() === "ongoing" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEndEvent(event)
            }}
            disabled={actionLoading}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center"
            title="End Event"
          >
            <FaStop className="w-3 h-3 mr-1" />
            End
          </button>
        )}

        {/* Publish button - only show for draft events */}
        {event.status?.toLowerCase() === "draft" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePublishEvent(event)
            }}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            title="Publish Event"
          >
            <FaCalendarPlus className="w-3 h-3 mr-1" />
            Publish
          </button>
        )}

        {/* Edit button - changes to Archive for completed events */}
        {event.status?.toLowerCase() === "completed" ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleArchiveEvent(event)
            }}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
            title="Archive Event"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Archive
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEditClick(event)
            }}
            className="px-3 py-1 text-sm bg-[var(--secondary-400)] text-white rounded-md hover:bg-[var(--secondary-500)] flex items-center"
            title="Edit Event"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteEvent(event)
          }}
          className="px-3 py-1 text-sm rounded-md bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] flex items-center"
          title="Delete Event"
        >
          <FaTrash className="w-3 h-3 mr-1" />
          Delete
        </button>
      </div>
    ),
  },
]

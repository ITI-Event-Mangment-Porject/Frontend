"use client"
import {
  Search,
  Users,
  Calendar,
  MapPin,
  Activity,
  User,
  Mail,
  Phone,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react"

const AttendanceTableEnhanced = ({
  event,
  attendanceData,
  filteredAttendees,
  paginatedAttendees,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPages,
  attendeesPerPage,
  formatDate,
}) => {
  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter((a) => a.status === "present").length,
    absent: attendanceData.filter((a) => a.status === "absent").length,
    late: attendanceData.filter((a) => a.status === "late").length,
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center lg:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-[#901b20] to-[#901b20] bg-clip-text text-transparent mb-1 lg:mb-2 leading-tight">
              Attendance & Reports
            </h2>
            <p className="text-sm lg:text-lg text-gray-600 font-medium">
              Monitor event attendance and generate detailed reports
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <button className="group relative overflow-hidden bg-gradient-to-r from-[#203947] to-[#467c9b] hover:from-[#1a2f3a] hover:to-[#203947] text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-500 transform hover:scale-105 lg:hover:scale-105 hover:shadow-xl lg:hover:shadow-2xl">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-1.5 lg:gap-3">
                <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Refresh</span>
              </div>
            </button>

            <button className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-500 transform hover:scale-105 lg:hover:scale-105 hover:shadow-xl lg:hover:shadow-2xl">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-1.5 lg:gap-3">
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Export</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Event Summary */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          Event Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 border border-blue-200">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:rotate-12 transition-transform duration-500">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-bold text-blue-600 uppercase tracking-wider">Event Date</p>
                <p className="text-sm lg:text-lg font-black text-blue-900">{formatDate(event.start_date)}</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 border border-green-200">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-bold text-green-600 uppercase tracking-wider">Total Attendees</p>
                <p className="text-sm lg:text-lg font-black text-green-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 border border-purple-200">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:rotate-12 transition-transform duration-500">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-bold text-purple-600 uppercase tracking-wider">Location</p>
                <p className="text-sm lg:text-lg font-black text-purple-900 truncate">{event.location || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 border border-orange-200">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:rotate-12 transition-transform duration-500">
                <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-bold text-orange-600 uppercase tracking-wider">Status</p>
                <p className="text-sm lg:text-lg font-black text-orange-900 capitalize">{event.status || "Draft"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Filter */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 lg:pl-12 pr-4 lg:pr-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-sm lg:text-lg font-medium placeholder-gray-400 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Enhanced Attendee Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 lg:px-8 py-4 lg:py-6 border-b bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white">
          <h2 className="text-lg lg:text-xl font-bold flex items-center gap-3">
            <Users className="w-5 h-5 lg:w-6 lg:h-6" />
            Attendees ({filteredAttendees.length})
          </h2>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="text-center py-16 lg:py-20">
            <Users className="w-16 h-16 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 lg:mb-6 animate-float" />
            <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">No Attendees Found</h3>
            <p className="text-sm lg:text-xl text-gray-600 px-4">
              {searchTerm
                ? "No attendees match your search criteria."
                : "No attendees have registered for this event yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedAttendees.map((attendee, index) => (
                    <tr
                      key={`${attendee.id}-${index}`}
                      className="hover:bg-gray-50 transition-colors duration-200 animate-slide-in-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                          </div>
                          <div className="text-sm lg:text-base font-bold text-gray-900">{attendee.name}</div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm lg:text-base text-gray-900 font-medium">{attendee.email}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                        {attendee.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm lg:text-base text-gray-900 font-medium">{attendee.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm lg:text-base">-</span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm lg:text-base text-gray-900 font-medium">{attendee.date}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-b-2xl p-6 lg:p-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="text-sm lg:text-lg text-gray-600 font-medium text-center sm:text-left">
                    Page <span className="font-bold text-[#901b20]">{currentPage}</span> of{" "}
                    <span className="font-bold text-[#901b20]">{totalPages}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 lg:px-4 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white border-[#901b20] shadow-lg transform scale-110"
                              : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AttendanceTableEnhanced

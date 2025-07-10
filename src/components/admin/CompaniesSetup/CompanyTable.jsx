import CompanyRow from './CompanyRow'
import { Building2 } from "lucide-react"

const TableSkeleton = ({ rows }) => (
  <tbody>
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-xl shimmer-effect"></div>
            <div className="ml-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 shimmer-effect"></div>
              <div className="h-3 bg-gray-200 rounded w-24 shimmer-effect"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-40 shimmer-effect"></div>
            <div className="h-3 bg-gray-200 rounded w-32 shimmer-effect"></div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 rounded-full w-20 shimmer-effect"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 rounded-full w-16 shimmer-effect"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-8 bg-gray-200 rounded-xl w-24 shimmer-effect"></div>
        </td>
      </tr>
    ))}
  </tbody>
)

const CompanyTable = ({ companies, loading, onView, onApproveReject, actionLoading }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Company</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Industry</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        {loading ? (
          <TableSkeleton rows={6} />
        ) : (
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.length > 0 ? (
              companies.map((c) => (
                <CompanyRow
                  key={c.id}
                  company={c}
                  onView={onView}
                  onApproveReject={onApproveReject}
                  actionLoading={actionLoading}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="text-gray-300 mb-4">
                    <Building2 className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Companies Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
    </div>
  </div>
)

export default CompanyTable

import CompanyRow from './CompanyRow';
import TableSkeleton from '../../TabeSkeleton';
const CompanyTable = ({ companies,loading, onView, onApproveReject, actionLoading }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
        
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <tbody className="bg-white divide-y divide-gray-200">
        {companies.length > 0 ? (
          companies.map(c => (
            
            <CompanyRow
              key={c.id}
              company={c}
              statusAppr={c.status}
              onView={onView}
              onApproveReject={onApproveReject}
              actionLoading={actionLoading}
            />
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              No companies found
            </td>
          </tr>
        )}
      </tbody>
      )}
     
    </table>
    
  </div>
);
export default CompanyTable;

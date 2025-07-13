'use client';

import { useEffect, useState } from 'react';
import CompanyTable from './CompanyTable';
import SearchAndFilterBar from './SearchAndFilterBar';
import DetailModal from './DetailModal';
import NewJobFairModal from './NewJobFairModal';

const JWT_TOKEN = localStorage.getItem('token');
const JobFairSetUp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobFairId, setSelectedJobFairId] = useState(1);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);

        // Build query parameters for pagination, search, and filter
        const params = new URLSearchParams({
          page: currentPage.toString(),
          per_page: itemsPerPage.toString(),
        });

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        if (statusFilter !== 'All Statuses') {
          params.append('status', statusFilter.toLowerCase());
        }

        const res = await fetch(
          `http://127.0.0.1:8000/api/job-fairs/${selectedJobFairId}/participations?${params}`,
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
              Accept: 'application/json',
            },
          }
        );
        const data = await res.json();

        // Assuming the API returns pagination metadata
        setCompanies(data.data.result || data.data);
        setTotalItems(data.data.total || data.total || 0);
        setTotalPages(
          Math.ceil((data.data.total || data.total || 0) / itemsPerPage)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [selectedJobFairId, currentPage, itemsPerPage, searchTerm, statusFilter]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleAction = async ({
    participationId,
    companyId,
    action,
    reason = null,
  }) => {
    setProcessingIds(prev => new Set(prev).add(participationId));

    try {
      // Step 1: Update participation status
      await fetch(
        `http://127.0.0.1:8000/api/job-fairs/${selectedJobFairId}/participations/${participationId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: action }),
        }
      );

      const requestBody = {};

      // Add reason to request body only for reject action when reason is provided
      if (action === 'reject' && reason) {
        requestBody.reason = reason;
      }

      const response = await fetch(
        `http://localhost:8000/api/companies/${companyId}/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Only send body if there's data to send
          ...(Object.keys(requestBody).length > 0 && {
            body: JSON.stringify(requestBody),
          }),
        }
      );
      if (response.ok) {
        console.log(`Company ${action}d successfully`);
      } else {
        console.error(`Failed to ${action} company`);
      }
      // Step 3: Update local state
      setCompanies(prev =>
        prev.map(p =>
          p.id === participationId
            ? {
                ...p,
                status: action,
                reviewed_at: new Date().toISOString(),
                company: {
                  ...p.company,
                  status: action,
                  reason: reason ?? null,
                },
              }
            : p
        )
      );
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(participationId);
        return updated;
      });
    }
  };

  const handleViewDetails = async id => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/job-fairs/${selectedJobFairId}/participations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
          Accept: 'application/json',
        },
      }
    );
    const data = await res.json();
    setSelectedDetails(data.data.result);
    setShowDetailsModal(true);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = newItemsPerPage => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const PaginationControls = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={e => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JobFair data...</p>
        </div>
      </div>
    );
  }

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-[var(--gray-200)] rounded-lg shadow-md transition-all duration-300 ease-out">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Fair Participations</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-(--primary-500) cursor-pointer text-white rounded hover:bg-(--primary-600) transition-colors flex items-center gap-2"
        >
          + New Job Fair
        </button>
      </div>

      {showCreateModal && (
        <NewJobFairModal onClose={() => setShowCreateModal(false)} />
      )}

      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <CompanyTable
        companies={companies}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        handleAction={handleAction}
        onViewDetails={handleViewDetails}
        processingIds={processingIds}
      />

      {/* Pagination Controls */}
      {totalItems > 0 && <PaginationControls />}

      {showDetailsModal && selectedDetails && (
        <DetailModal
          details={selectedDetails}
          onClose={() => setShowDetailsModal(false)}
          handleAction={handleAction}
          processingIds={processingIds}
        />
      )}
    </div>
  );
};

export default JobFairSetUp;

// JobFairSetUp.jsx
import React, { useEffect, useState } from 'react';
import CompanyGrid from './CompanyGrid';
import SearchAndFilterBar from './SearchAndFilterBar';
import DetailModal from './DetailModal';
import NewJobFairModal from './NewJobFairModal';

const JWT_TOKEN ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDEvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTE5OTg3OTMsImV4cCI6MTc4MTk5ODc5MywibmJmIjoxNzUxOTk4NzkzLCJqdGkiOiJzckhHaWpQZmN0WU96bWU2Iiwic3ViIjoiMTYyIiwicHJ2IjoiMTNlOGQwMjhiMzkxZjNiN2I2M2YyMTkzM2RiYWQ0NThmZjIxMDcyZSJ9.fXlhOX24U9dyZyqi9dABx9cucgbV_vYnxQ1aKG3R4qg';
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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations`,
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
              Accept: 'application/json',
            },
          }
        );
        const data = await res.json();
        setCompanies(data.data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [selectedJobFairId]);

  const handleAction = async ({ participationId, companyId, action, reason = null }) => {
    setProcessingIds(prev => new Set(prev).add(participationId));
  
    try {
      // Step 1: Update participation status
      await fetch(
        `http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations/${participationId}`,
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
        `http://localhost:8001/api/companies/${companyId}/${action}`,
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
      `http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations/${id}`,
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Fair Participations</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-(--primary-500) cursor-pointer text-white rounded hover:bg-(--primary-600) transition-colors flex items-center gap-2"
        >
          + New Job Fair
        </button>
      </div>
      {showCreateModal && <NewJobFairModal onClose={() => setShowCreateModal(false)} />}


      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <CompanyGrid
        companies={companies}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        handleAction={handleAction}
        onViewDetails={handleViewDetails}
        processingIds={processingIds}
      />

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

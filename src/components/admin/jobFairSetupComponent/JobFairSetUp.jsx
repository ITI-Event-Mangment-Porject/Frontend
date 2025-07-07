// JobFairSetUp.jsx
import React, { useEffect, useState } from 'react';
import CompanyGrid from './CompanyGrid';
import SearchAndFilterBar from './SearchAndFilterBar';
import DetailModal from './DetailModal';

const JWT_TOKEN ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDEvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTE4ODMxNTYsImV4cCI6MTc4MTg4MzE1NiwibmJmIjoxNzUxODgzMTU2LCJqdGkiOiJ3UWcwZE94NjgzT1lmSFJEIiwic3ViIjoiMTYyIiwicHJ2IjoiMTNlOGQwMjhiMzkxZjNiN2I2M2YyMTkzM2RiYWQ0NThmZjIxMDcyZSJ9.dgpwv-fX-w_2bPhpc4N78A2UuutHNcfwcxOLGG5cxhM'; 
const JobFairSetUp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobFairId, setSelectedJobFairId] = useState(1);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
 
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations`, {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
            Accept: 'application/json',
          },
        });
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

  const handleApprove = async (id) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    await fetch(`http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'approved' }),
    });
    setCompanies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved', reviewed_at: new Date().toISOString() } : p))
    );
    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleRejected = async (id) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    
    await fetch(`http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected' }),
    });
    setCompanies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected', reviewed_at: new Date().toISOString() } : p))
    );
    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };
  
  const handleViewDetails = async (id) => {
    const res = await fetch(`http://127.0.0.1:8001/api/job-fairs/${selectedJobFairId}/participations/${id}`, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
        Accept: 'application/json',
      },
    });
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
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Fair Participations</h1>
       
      </div>

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
        onApprove={handleApprove}
        onReject={handleRejected}
        onViewDetails={handleViewDetails}
        processingIds={processingIds}
      />


      {showDetailsModal && selectedDetails && (
        <DetailModal
          details={selectedDetails}
          onClose={() => setShowDetailsModal(false)}
          onApprove={handleApprove}
          onReject={handleRejected}
          processingIds={processingIds}
        />
      )}
    </div>
  );
};

export default JobFairSetUp;

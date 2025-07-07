import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const FeedbackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loadingForm, setLoadingForm] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Mock form data - replace with your actual form structure
    const mockFormData = {
      title: 'Event Feedback Form',
      description: 'Please share your thoughts about this event',
      form_config: [
        {
          question: 'How would you rate the overall event?',
          type: 'rating'
        },
        {
          question: 'How was the event organization?',
          type: 'rating'
        },
        {
          question: 'What did you like most about the event?',
          type: 'text'
        },
        {
          question: 'Any suggestions for improvement?',
          type: 'text'
        }
      ]
    };

    // Simulate loading delay
    setTimeout(() => {
      setForm(mockFormData);
      const initial = {};
      mockFormData.form_config.forEach((q, idx) => {
        initial[idx] = q.type === 'rating' ? 0 : '';
      });
      setResponses(initial);
      setLoadingForm(false);
    }, 1000);
  }, [id]);

  const handleChange = (idx, value) => {
    setResponses(prev => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form) return;

    // Validation
    for (let i = 0; i < form.form_config.length; i++) {
      if (form.form_config[i].type === 'rating' && (!responses[i] || responses[i] < 1)) {
        setModalType('error');
        setModalMessage('⚠️ Please answer all required questions.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // POST request to submit feedback responses
      const res = await fetch(
        `${API_BASE_URL}/api/feedback/events/${id}/forms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            responses,
          }),
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setResponses({});
      setModalType('success');
      setModalMessage('✅ Thank you for your feedback!');
      setTimeout(() => navigate(`/events/${id}`), 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setModalType('error');
      setModalMessage('❌ Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate(`/events/${id}`);

  if (loadingForm) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <span className="text-orange-600 animate-pulse">Loading Feedback Form...</span>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <span className="text-red-600">No feedback form available</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen w-full">
      <Navbar />
      <div className="flex flex-1 min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 ml-4 sm:ml-8">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg mx-auto">
            <div
              className="h-32 md:h-48 w-full rounded-t-lg bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage:
                  "url('https://www.investopedia.com/thmb/ejUMpcr5pOzEIkw5FekHv4E5-f0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1210536688-f8aa4c9c1ace4e348e2bcd5e267fdbb3.jpg')",
              }}
            >
              <div className="bg-black/60 w-full h-full flex flex-col justify-center items-center rounded-t-lg">
                <h1 className="text-3xl font-extrabold text-white text-center px-4 drop-shadow-lg tracking-wide">
                  {form.title || 'Feedback Form'}
                </h1>
                <p className="text-white text-sm mt-2 px-4 text-center">{form.description}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                {form.form_config.map((q, idx) => (
                  <div className="mb-6" key={idx}>
                    <label className="block font-medium text-gray-700 mb-2">
                      {q.question}
                      {q.type === 'rating' && <span className="text-red-500">*</span>}
                    </label>
                    {q.type === 'rating' ? (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleChange(idx, star)}
                            className="text-3xl focus:outline-none hover:scale-110 transition-transform"
                          >
                            <span className={responses[idx] >= star ? 'text-orange-400' : 'text-gray-300'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        rows={4}
                        placeholder="Your answer..."
                        value={responses[idx] || ''}
                        onChange={e => handleChange(idx, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors font-medium"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Modal */}
          {modalType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div
                className={`w-full max-w-sm p-6 rounded-lg shadow-lg ${
                  modalType === 'success'
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                } border text-center`}
              >
                <p
                  className={`text-sm font-medium ${
                    modalType === 'success' ? 'text-green-700' : 'text-red-700'
                  } mb-4`}
                >
                  {modalMessage}
                </p>
                <button
                  onClick={() => setModalType(null)}
                  className={`px-4 py-2 rounded transition-colors ${
                    modalType === 'success'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackForm;
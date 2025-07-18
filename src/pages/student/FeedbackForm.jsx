import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';

const APP_URL = import.meta.env.VITE_API_BASE_URL;

const FeedbackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loadingForm, setLoadingForm] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [modalType, setModalType] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchFeedbackForm = async () => {
      try {
        setLoadingForm(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await fetch(
          `${APP_URL}/api/feedback/events/${id}/forms`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to fetch feedback form: ${response.status}`
          );
        }

        const data = await response.json();
        const formData = Array.isArray(data) ? data[0] : data;

        let processedFormData = { ...formData };
        if (typeof formData.form_config === 'string') {
          try {
            const parsedConfig = JSON.parse(formData.form_config);
            processedFormData.form_config = parsedConfig.fields || parsedConfig;
          } catch (e) {
            console.error('Error parsing form_config:', e);
            processedFormData.form_config = [];
          }
        }

        console.log('Processed form data:', processedFormData); // للتشخيص
        setForm(processedFormData);

        // Initialize responses object based on the form structure
        const initialResponses = {};
        if (
          processedFormData.form_config &&
          Array.isArray(processedFormData.form_config)
        ) {
          processedFormData.form_config.forEach((question, idx) => {
            initialResponses[idx] = question.type === 'rating' ? 0 : '';
          });
        }
        setResponses(initialResponses);
      } catch (error) {
        console.error('Error fetching feedback form:', error);
        setError(error.message);
      } finally {
        setLoadingForm(false);
      }
    };

    if (id) {
      fetchFeedbackForm();
    }
  }, [id]);

  const handleChange = (idx, value) => {
    setResponses(prev => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form) return;

    // Validation
    for (let i = 0; i < form.form_config.length; i++) {
      const question = form.form_config[i];
      if (
        question.type === 'rating' &&
        question.required &&
        (!responses[i] || responses[i] < 1)
      ) {
        setModalType('error');
        setModalMessage('⚠️ Please answer all required questions.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      const formId = form.id || form.form_id || 1;

      const res = await fetch(
        `${APP_URL}/api/feedback/forms/${formId}/responses`,
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
      setTimeout(() => navigate(`/student/show-events`), 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setModalType('error');
      setModalMessage(
        '❌ Sorry, You submit your feedback before, please wait for the next event.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate(`/student/show-events`);

  if (loadingForm) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <span className="text-orange-600 animate-pulse">
          Loading Feedback Form...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-xl">
        <span className="text-red-600 mb-4">Error loading feedback form</span>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
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
    <Layout>
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
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
              <p className="text-white text-sm mt-2 px-4 text-center">
                {form.description}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              {form.form_config &&
                form.form_config.map((q, idx) => (
                  <div className="mb-6" key={idx}>
                    <label className="block font-medium text-gray-700 mb-2">
                      {q.label || q.question}
                      {q.required && <span className="text-red-500">*</span>}
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
                            <span
                              className={
                                responses[idx] >= star
                                  ? 'text-orange-400'
                                  : 'text-gray-300'
                              }
                            >
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
      </div>

      <Footer />
    </Layout>
  );
};

export default FeedbackForm;

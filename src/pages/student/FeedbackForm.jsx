import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const FeedbackForm = ({ formId = 1 }) => {
  const { eventId } = useParams(); // اجلب eventId من الرابط

  const [orgRating, setOrgRating] = useState(0);
  const [speakerEffective, setSpeakerEffective] = useState(null);
  const [sessionFeedback, setSessionFeedback] = useState('');
  const [comments, setComments] = useState('');
  const [usability, setUsability] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [modalType, setModalType] = useState(null); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!orgRating) {
      setModalType('error');
      setModalMessage('⚠️ Please rate the event.');
      return;
    }

    const feedbackData = {
      responses: {
        0: orgRating,
        1: comments,
      },
      overall_rating: orgRating,
      event_id: Number(eventId), // تأكد أنه رقم
    };

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/api/feedback/forms/${formId}/responses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(feedbackData),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Reset form
      setOrgRating(0);
      setSpeakerEffective(null);
      setSessionFeedback('');
      setComments('');
      setUsability('');

      setModalType('success');
      setModalMessage('✅ Thank you for your feedback!');
    } catch {
      setModalType('error');
      setModalMessage('❌ Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="p-2 sm:p-6 flex flex-col items-center w-full">
        {/* Hero */}
        <div className="w-full max-w-2xl md:max-w-4xl bg-white rounded-lg shadow p-0 mb-6">
          <div
            className="h-28 md:h-55 w-full rounded-t-lg bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://www.investopedia.com/thmb/ejUMpcr5pOzEIkw5FekHv4E5-f0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1210536688-f8aa4c9c1ace4e348e2bcd5e267fdbb3.jpg')",
            }}
          >
            <div className="bg-black/60 w-full h-full flex flex-col justify-center items-center rounded-t-lg">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center px-2 drop-shadow-lg tracking-wide"
                style={{
                  textShadow: '0 2px 8px #000, 0 0 2px #000',
                  letterSpacing: '1px',
                }}
              >
                Your Voice Matters
                <br />
                Share Your Event Experience
              </h1>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                Event & Speaker Feedback Form
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Share your thoughts on the event's organization, quality, and
                speakers to help us improve.
              </p>

              {/* Rating */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Rate the Event's Organization:{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOrgRating(star)}
                      className="text-2xl focus:outline-none"
                    >
                      <span
                        className={
                          orgRating >= star
                            ? 'text-orange-400'
                            : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>

                <label className="block font-medium text-gray-700 mb-1 mt-2">
                  Rate the Effectiveness of the Speakers:{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6 mt-1 flex-wrap">
                  <label className="flex items-center gap-1 text-gray-700 text-sm">
                    <input
                      type="radio"
                      name="speakerEffective"
                      value="yes"
                      checked={speakerEffective === 'yes'}
                      onChange={() => setSpeakerEffective('yes')}
                      className="accent-orange-500"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1 text-gray-700 text-sm">
                    <input
                      type="radio"
                      name="speakerEffective"
                      value="no"
                      checked={speakerEffective === 'no'}
                      onChange={() => setSpeakerEffective('no')}
                      className="accent-orange-500"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Session Feedback */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Provide feedback on specific sessions/companies (Optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm mb-2"
                  placeholder="Session/Company Name"
                  value={sessionFeedback}
                  onChange={e => setSessionFeedback(e.target.value)}
                />
                <label className="block font-medium text-gray-700 mb-1">
                  Additional Comments or Suggestions:
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Provide detailed feedback regarding the event's organization, the quality of the sessions, and the effectiveness of the speakers."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>

              {/* Usability */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                  How would you rate the platform's usability?{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                  {[
                    'Excellent',
                    'Good',
                    'Average',
                    'Needs Improvement',
                    'Poor',
                  ].map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-1 text-gray-700 text-sm"
                    >
                      <input
                        type="radio"
                        name="usability"
                        value={option}
                        checked={usability === option}
                        onChange={() => setUsability(option)}
                        className="accent-orange-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Popup */}
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div
              className={`w-full max-w-xs sm:max-w-sm p-6 rounded-lg shadow-lg ${
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
                className={`px-4 py-2 rounded ${
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
      <Footer />
    </Layout>
  );
};

export default FeedbackForm;

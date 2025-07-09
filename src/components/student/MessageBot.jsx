import React, { useState, useEffect } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Messenger = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (open) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('User not logged in');
        return;
      }
      fetch(`${API_BASE_URL}/api/message/bulk-messages`, {
        headers: { Authorization: `Bearer ${token}` },
        Accept: 'application/json',
      })
        .then(res => res.json())
        .then(data => setMessages(data.data || []));
    }
  }, [open]);

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 bg-red-900 text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setOpen(true)}
        style={{ display: open ? 'none' : 'block' }}
      >
        <FaComments size={24} />
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-bold">Messages</span>
            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No messages yet
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-2 rounded ${
                    msg.unread
                      ? 'bg-orange-50 border-l-4 border-orange-500'
                      : 'bg-gray-50 border-l-4 border-gray-300'
                  }`}
                >
                  <div className="font-medium">
                    {msg.sender_name || 'Unknown'}
                  </div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs text-gray-400">{msg.created_at}</div>
                </div>
              ))
            )}
          </div>
          {/* You can add a reply box here */}
        </div>
      )}
    </div>
  );
};

export default Messenger;

import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Tabs = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {tabs.map(tab => (
            <li className="mr-2" key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === tab.id
                    ? 'text-[var(--primary-500)] border-[var(--primary-500)]'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                {tab.icon && (
                  <span
                    className={`w-4 h-4 mr-2 ${
                      activeTab === tab.id
                        ? 'text-[var(--primary-500)]'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  >
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="tab-content"
      >
        {tabs.find(tab => tab.id === activeTab)?.content}
      </motion.div>
    </div>
  );
};

export default Tabs;

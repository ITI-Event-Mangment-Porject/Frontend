import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const Table = ({
  columns,
  data,
  selectable = false,
  onRowSelect,
  selectedRows = [],
  actions = null,
  onActionSelect,
}) => {
  const handleCheckboxChange = id => {
    if (onRowSelect) {
      if (selectedRows.includes(id)) {
        onRowSelect(selectedRows.filter(rowId => rowId !== id));
      } else {
        onRowSelect([...selectedRows, id]);
      }
    }
  };

  const handleActionClick = (e, row) => {
    e.stopPropagation();
    if (onActionSelect) {
      onActionSelect(row);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="w-10 py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Header for checkboxes */}
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th className="py-3 px-4 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {selectable && (
                <td className="py-4 px-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="py-4 px-4 whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
              {actions && (
                <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={e => handleActionClick(e, row)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisV />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-4 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;

// components/TableSkeleton.jsx
const TableSkeleton = ({ rows = 5 }) => {
    return (
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="animate-pulse border-b">
            <td className="p-4"><div className="h-4 bg-gray-300 rounded w-3/4"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-300 rounded w-1/2"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-300 rounded w-1/3"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-300 rounded w-2/3"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-300 rounded w-1/4"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-300 rounded w-1/2"></div></td>
          </tr>
        ))}
      </tbody>
    );
  };
  
  export default TableSkeleton;
  
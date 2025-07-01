// components/FullPageLoader.jsx
import { ClipLoader } from 'react-spinners';

const FullPageLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <ClipLoader size={60} color="#EF4444" />
    </div>
  );
};

export default FullPageLoader;

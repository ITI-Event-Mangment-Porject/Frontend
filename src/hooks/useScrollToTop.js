import { useEffect } from 'react';

/**
 * Custom hook to scroll the window to the top on component mount
 * @param {Object} options - Scrolling options
 * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
 * @param {Array} deps - Optional dependency array for when to trigger scroll (default: [])
 */
const useScrollToTop = (options = { smooth: true }, deps = []) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: options.smooth ? 'smooth' : 'auto',
    });
  }, deps); // Empty dependency array means this runs once on mount
};

export default useScrollToTop;

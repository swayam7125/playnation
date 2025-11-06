import { useState, useEffect } from "react";

/**
 * useSkeletonLoader
 * Provides a smooth fade transition between skeleton and real content.
 * 
 * @param {boolean} isLoading - Current loading state (e.g., API fetching)
 * @param {number} delay - Delay before showing real content (ms)
 * @returns {boolean} showContent - Whether to show real content
 */
export default function useSkeletonLoader(isLoading, delay = 300) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isLoading) {
      timeout = setTimeout(() => setShowContent(true), delay);
    } else {
      setShowContent(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, delay]);

  return showContent;
}

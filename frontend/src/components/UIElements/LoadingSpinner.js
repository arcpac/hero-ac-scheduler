import React, { useEffect, useState } from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = (props) => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // After the timeout, hide the spinner and show the error message
      setShowSpinner(false);
      setShowError(true);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      {showSpinner && (
        <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
          <div className="lds-dual-ring"></div>
        </div>
      )}
      {showError && <div className="control-error">Loading took too long. Please try again.</div>}
    </div>
  );
};

export default LoadingSpinner;

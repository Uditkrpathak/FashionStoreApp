import React from 'react';
import brandIcon from '../../assets/icon.png';

export const Loader = ({ message = 'Loading...', fullPage = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 rounded-full border-4 border-[#704F38]/20 border-t-[#704F38] animate-spin"></div>
        {/* Inner pulsing logo */}
        <div className="absolute w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm animate-pulse">
          <img src={brandIcon} alt="Loading..." className="w-full h-full object-contain" />
        </div>
      </div>
      {message && (
        <p className="text-xs font-semibold text-[#704F38] uppercase tracking-wider animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[#FDFBF9] z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;

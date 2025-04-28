import React from 'react';

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M10 15.585l-5.857 3.105 1.114-6.51L.515 7.62l6.517-.955L10 .685l2.968 6.03 6.517.954-4.742 4.562 1.114 6.51L10 15.585z"
      clipRule="evenodd"
    />
  </svg>
);

export default StarIcon; 
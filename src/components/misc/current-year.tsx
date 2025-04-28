// CurrentYear.tsx - Client Component
'use client';

import React from 'react';

const CurrentYear: React.FC = () => {
  return <>{new Date().getFullYear()}</>;
};

export default CurrentYear;
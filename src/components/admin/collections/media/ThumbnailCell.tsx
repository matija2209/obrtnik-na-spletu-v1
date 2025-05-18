import React from 'react';
import type { Media } from '@payload-types'; // Import the Media type

// Define a more specific type for rowData using the imported Media type
// This makes MediaDoc redundant if Media from @payload-types is sufficient
// interface MediaDoc { ... }

interface ThumbnailCellProps {
  // cellData is the value of the specific field this cell is for (e.g., 'alt' text)
  cellData?: any; 
  // rowData is the entire document for the current row, typed as Media
  rowData?: Media;
}

const ThumbnailCell: React.FC<ThumbnailCellProps> = (props) => {
  const { cellData, rowData: doc } = props;

  if (!doc || !doc.filename) {
    // If this cell is specifically for the 'alt' field, cellData would be doc.alt
    // Otherwise, if it's a general thumbnail cell not tied to 'alt', 
    // you might want to just show the placeholder or nothing.
    return <>{cellData || (doc && doc.alt) || ''}</>; 
  }

  // Prefer thumbnailURL if it exists (some setups might add this), then sizes, then main URL
  const thumbnailUrl = doc.thumbnailURL || doc.sizes?.thumbnail?.url || doc.url;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={doc.alt || doc.filename || 'thumbnail'}
          style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }}
        />
      ) : (
        <div 
          style={{ 
            width: '50px', 
            height: '50px', 
            marginRight: '10px', 
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize:'10px', 
            textAlign: 'center', 
            color: '#888'
          }}
        >
          No Preview
        </div>
      )}
      {/* Display cellData (e.g., alt text if this cell is for the 'alt' field) */}
      {/* Or display doc.alt if this cell is a generic thumbnail preview */}
      <span>{cellData || doc.alt}</span>
    </div>
  );
};

export default ThumbnailCell; 
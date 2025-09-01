'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'feedback-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        widgetid: string;
      };
    }
  }
}

interface FiidbakkWidgetProps {
  widgetId: string;
}

export default function FiidbakkWidget({ widgetId }: FiidbakkWidgetProps) {
  useEffect(() => {
    // Ensure the custom element is recognized
    if (typeof window !== 'undefined' && !customElements.get('feedback-widget')) {
      // The script will register the custom element when loaded
    }
  }, []);

  return (
    <>
    {/* @ts-ignore */}
      <feedback-widget widgetid={widgetId} />
      <Script
        src="https://widget.fiidbakk.com/main.js"
        type="module"
        strategy="afterInteractive"
      />
    </>
  );
}

// Usage example:
// import FiidbakkWidget from './components/FiidbakkWidget';
// 
// export default function MyPage() {
//   return (
//     <div>
//       <h1>My Page</h1>
//       <FiidbakkWidget widgetId="684bc31083c1434fe8c33024" />
//     </div>
//   );
// }
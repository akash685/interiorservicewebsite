'use client';

import { useEffect } from 'react';

export default function BlogViewTracker({ blogId }) {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Check if view already tracked in this session to avoid duplicates (optional, but good practice)
        const viewedKey = `viewed_blog_${blogId}`;
        if (sessionStorage.getItem(viewedKey)) return;

        await fetch(`/api/blogs/${blogId}/view`, {
          method: 'POST',
        });
        
        sessionStorage.setItem(viewedKey, 'true');
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [blogId]);

  return null; // This component renders nothing
}

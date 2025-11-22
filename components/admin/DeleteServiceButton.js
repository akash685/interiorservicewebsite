'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteServiceButton({ id, name }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      alert('Error deleting service');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn"
      style={{ 
        padding: '8px 16px', 
        fontSize: '0.85rem', 
        background: '#f44336', 
        color: 'white',
        opacity: isDeleting ? 0.6 : 1
      }}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

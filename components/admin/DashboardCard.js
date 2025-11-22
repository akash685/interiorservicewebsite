'use client';

import Link from 'next/link';
import { useState } from 'react';

export function StatCard({ stat, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={stat.href}
      className="bg-white border border-gray-200 p-6 transition-all"
      style={{
        borderColor: isHovered ? 'var(--primary)' : '',
        opacity: isHovered ? 0.9 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

export function QuickActionCard({ action, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={action.href}
      className="flex items-center gap-3 p-4 border border-gray-200 transition-all"
      style={{
        borderColor: isHovered ? 'var(--primary)' : '',
        color: isHovered ? 'var(--primary)' : ''
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

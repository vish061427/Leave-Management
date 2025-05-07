import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1 text-gray-600">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx > 0 && <ChevronRight size={14} className="mx-1" />}
            {item.href ? (
              <Link to={item.href} className="hover:underline text-sm font-medium text-gray-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

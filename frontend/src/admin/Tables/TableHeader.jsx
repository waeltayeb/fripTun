import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const TableHeader = ({
  title,
  field,
  sortConfig,
  onSort,
}) => {
  const getSortIcon = () => {
    if (sortConfig.key !== field) return <ArrowUpDown className="w-4 h-4" />;
    if (sortConfig.direction === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sortConfig.direction === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  return (
    <th className="py-4 px-4 font-medium text-black">
      <button
        className="flex items-center gap-1 hover:text-gray-600"
        onClick={() => onSort(field)}
      >
        {title}
        {getSortIcon()}
      </button>
    </th>
  );
};
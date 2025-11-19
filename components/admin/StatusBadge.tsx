'use client';

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: any; label: string }> = {
  completed: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
    label: 'Completed',
  },
  pending: {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: Clock,
    label: 'Pending',
  },
  cancelled: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: XCircle,
    label: 'Cancelled',
  },
  active: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: CheckCircle,
    label: 'Active',
  },
  inactive: {
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: AlertCircle,
    label: 'Inactive',
  },
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: AlertCircle,
    label: status,
  };

  const IconComponent = config.icon;

  if (variant === 'outline') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${
          config.color.replace('text-', 'border-')
        } ${config.color}`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}


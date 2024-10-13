import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon: Icon,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="flex flex-col items-center p-6 space-y-4">
      {Icon && <Icon size={48} className="text-gray-400" />}{" "}
      {/* Render icon if provided */}
      <CardHeader>
        <CardTitle>{message}</CardTitle>
      </CardHeader>
      {actionLabel && onAction && (
        <CardContent>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        </CardContent>
      )}
    </Card>
  );
};

export default EmptyState;

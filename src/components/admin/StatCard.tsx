import { m } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "amber" | "red" | "purple";
}

const colorVariants = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    text: "text-blue-300",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: "text-green-400",
    text: "text-green-300",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    text: "text-amber-300",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "text-red-400",
    text: "text-red-300",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: "text-purple-400",
    text: "text-purple-300",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "blue",
}: StatCardProps) {
  const colors = colorVariants[color];

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-sm text-gray-400 ml-2">vs mois dernier</span>
        </div>
      )}
    </m.div>
  );
}

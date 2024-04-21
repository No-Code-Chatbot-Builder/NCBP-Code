import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const LoadingSkeleton = ({ children, className }: Props) => {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center h-64 w-full bg-card rounded-lg animate-pulse",
        children ? "h-fit" : "h-64",
        className
      )}
    >
      {children}
    </div>
  );
};

export default LoadingSkeleton;

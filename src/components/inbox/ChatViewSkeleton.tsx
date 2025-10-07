import { Skeleton } from "@/components/ui/skeleton";

export const ChatViewSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex gap-2 justify-start">
          <Skeleton className="h-16 w-[60%] rounded-2xl" />
        </div>
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-12 w-[50%] rounded-2xl" />
        </div>
        <div className="flex gap-2 justify-start">
          <Skeleton className="h-20 w-[55%] rounded-2xl" />
        </div>
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-14 w-[45%] rounded-2xl" />
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="flex-1 h-[60px] rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
};

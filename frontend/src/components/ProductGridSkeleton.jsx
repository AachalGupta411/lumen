export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-square skeleton rounded-none" />
          <div className="p-3.5 space-y-2">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

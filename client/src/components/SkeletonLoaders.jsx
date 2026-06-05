import { motion } from "framer-motion";

export const EventCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden"
  >
    <div className="h-48 w-full bg-gray-800 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-800 rounded animate-pulse" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-800 rounded animate-pulse" />
      </div>
    </div>
  </motion.div>
);

export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-16 py-10">
    {/* Header Skeleton */}
    <div className="flex items-center gap-6 mb-10">
      <div className="w-16 h-16 rounded-full bg-gray-800 animate-pulse" />
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 space-y-2"
        >
          <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
        </div>
      ))}
    </div>

    {/* Bookings Skeleton */}
    <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-6" />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="h-40 w-full bg-gray-800 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const EventDetailSkeleton = () => (
  <div className="min-h-screen bg-[#0f0f0f] text-white">
    {/* Hero Skeleton */}
    <div className="relative h-[400px] w-full bg-gray-800 animate-pulse" />

    {/* Content Skeleton */}
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-10 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-xl space-y-4">
          <div className="h-6 w-32 bg-gray-800 rounded animate-pulse" />
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-xl space-y-4">
        <div className="h-6 w-32 bg-gray-800 rounded animate-pulse" />
        <div className="h-12 w-full bg-gray-800 rounded animate-pulse" />
        <div className="h-12 w-full bg-gray-800 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export const AdminDashboardSkeleton = () => (
  <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-12 py-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-10">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="h-12 w-32 bg-gray-800 rounded animate-pulse" />
    </div>

    {/* Stats */}
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 space-y-2"
        >
          <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
        </div>
      ))}
    </div>

    {/* Content */}
    <div className="grid lg:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-24 bg-gray-800 rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 flex justify-between items-center"
              >
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden h-[350px] bg-gray-800 animate-pulse">
    <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-3">
      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
      <div className="h-10 w-3/4 bg-gray-700 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
    </div>
  </div>
);

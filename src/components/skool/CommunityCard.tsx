import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
// import DeleteModal from './DeleteCourseModal'; // Adjust this import if your delete modal is named differently

interface Community {
  id: number;
  rank: number;
  name: string;
  description: string;
  members: string;
  price: string;
  category: string;
  image: string;
  avatar: string;
}

interface CommunityCardProps {
  community: Community;
  onClick?: () => void;
}

export default function CommunityCard({ community, onClick }: CommunityCardProps) {
  // State for handling the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Compute a pseudo progress based on rank (rank 1 shows a full bar)
  const progressPercent = Math.max(0, Math.min(100, 100 - (community?.rank - 1)));

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    // TODO: implement actual delete if needed
    setShowDeleteModal(false);
  };

  return (
    <div
      className="md:w-[380px] w-full max-w-full rounded-2xl shadow-2xl bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] overflow-hidden group transition-transform hover:-translate-y-2 hover:shadow-3xl duration-300 relative cursor-pointer"
      onClick={onClick}
    >
      {/* Image + Rank Badge */}
      <div className="relative w-full h-66">
        <Image
          src={community.image}
          alt={community.name}
          fill
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm bg-black/60 text-white">
          #{community.rank}
        </span>
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#23253a88] to-transparent pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="px-6 py-5 flex flex-col gap-3 bg-white/80 backdrop-blur-xl">
        {/* Category & Price */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#786AED] uppercase tracking-widest bg-[#eceaff] px-3 py-1 rounded-full shadow-sm">
            {community.category}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
            {community.price}
          </span>
        </div>

        {/* Name & Description */}
        <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">
          {community.name}
        </h3>
        <p className="text-sm text-gray-600 font-medium line-clamp-2 min-h-[40px]">
          {community.description}
        </p>

        {/* Members & Progress */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-gray-500 font-medium">Members</span>
          <span className="font-semibold text-[#786AED] text-xs">
            {community.members}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#A99EF6] to-[#786AED] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Buttons - Edit & Delete */}
        <div className="flex gap-2 mt-4">
          <Link href="#" className="flex-1">
            <button
              className="w-full py-2 rounded-xl bg-[#786AED] text-white font-bold shadow-md hover:bg-[#5743c2] transition-all text-sm"
              type="button"
            >
              Edit
            </button>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowDeleteModal(true);
            }}
            className="flex-1 w-full py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold shadow-md hover:bg-red-100 transition-all text-sm"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        courseTitle={community.name} // Title shown in modal
        id={community.id}
      /> */}
    </div>
  );
}

import Image from 'next/image';
import { Star } from 'lucide-react';

interface Module {
  title: string;
  duration: string;
  completed: boolean;
}

interface CourseProgressCardProps {
  title: string;
  author: string;
  rating: number;
  avatarUrl: string;
  completedModules: number;
  totalModules: number;
  modules: Module[];
}

export default function CourseProgressCard({
  title,
  author,
  rating,
  avatarUrl,
  completedModules,
  totalModules,
  modules
}: CourseProgressCardProps) {
  const progress = Math.floor((completedModules / totalModules) * 100);

  return (
    <div className="bg-white rounded-2xl  p-8 max-w-96 text-gray-900 font-sans">
      <h2 className="text-xl font-bold leading-snug mb-3">{title}</h2>

      <div className="flex items-center gap-3 mb-4">
        <Image
          src={avatarUrl}
          alt={author}
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="text-sm font-medium">{author}</span>
        <div className="flex items-center gap-1 ml-auto text-sm text-yellow-500">
          <Star size={16} fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-gray-600" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="text-xs text-gray-500 mb-4">{completedModules}/{totalModules} Module &nbsp;&nbsp;&nbsp; {progress}%</div>

      <div className="text-sm font-medium mb-2">{totalModules} Module <span className="float-right font-normal text-gray-400">{completedModules}/{totalModules} Done</span></div>

      <div className="space-y-3">
        {modules.map((module, index) => (
          <div
            key={index}
            className={`flex items-center text-sm ${module.completed ? 'text-gray-400 line-through' : ''}`}
          >
            <div className={`w-6 h-6 ${module.completed ? 'bg-green-500 rounded-full    ` text-white' : 'bg-gray-100 text-gray-800 rounded-[8px]'}  flex items-center justify-center text-xs mr-3`}>
              {module.completed ? '✓' : index + 1}
            </div>
            <span className="flex-1">{module.title}</span>
            <span className="text-gray-400">{module.duration}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        <button className="flex-1 border border-gray-300 text-gray-700 text-sm rounded-lg py-2 hover:bg-gray-100 transition">Give Review</button>
        <button className="flex-1 bg-gray-600 text-white text-sm rounded-lg py-2 hover:bg-gray-700 transition">Next Module</button>
      </div>
    </div>
  );
}
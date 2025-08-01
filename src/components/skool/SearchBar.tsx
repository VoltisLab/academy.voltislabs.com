import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export default function SearchBar({ 
  placeholder = "Search for anything", 
  value, 
  onChange, 
  className = "" 
}: SearchBarProps) {
  return (
    <div className={`relative ${className} `}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#909090] h-5 w-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 py-4 placeholder:text-[#909090] text-[#909090] placeholder:font-semibold text-lg border border-gray-300 rounded-xl bg-white shadow-md focus:border-transparent outline-none"
      />
    </div>
  )
} 
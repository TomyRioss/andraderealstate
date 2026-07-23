'use client'

interface SubcategoryTabsProps {
  subcategories: string[]
  active: string
  onChange: (value: string) => void
}

export default function SubcategoryTabs({ subcategories, active, onChange }: SubcategoryTabsProps) {
  const options = ['Todos', ...subcategories]

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = option === active
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase border transition-all ${
              isActive
                ? 'bg-[#D4AF6B] text-[#111009] border-[#D4AF6B]'
                : 'border-[#2E2A18] text-[#7A6845] hover:text-[#F5EDD8] hover:border-[#B8912A]/50'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

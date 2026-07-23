'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
  searchParams: Record<string, string>
}

export default function Pagination({ page, totalPages, basePath, searchParams }: PaginationProps) {
  const router = useRouter()

  function goTo(p: number) {
    const params = new URLSearchParams({ ...searchParams, page: String(p) })
    router.push(`${basePath}?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  function getPageNumbers(): (number | 'ellipsis')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | 'ellipsis')[] = []
    // always show 1
    pages.push(1)

    const left = Math.max(2, page - 1)
    const right = Math.min(totalPages - 1, page + 1)

    if (left > 2) pages.push('ellipsis')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('ellipsis')

    pages.push(totalPages)
    return pages
  }

  const pageNums = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="text-[#F5EDD8] border-[#111009] disabled:opacity-40"
      >
        Anterior
      </Button>

      {pageNums.map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => goTo(p as number)}
            className={
              p === page
                ? 'bg-[#111009] text-white border-[#111009]'
                : 'text-[#F5EDD8] border-[#111009] hover:bg-[#111009] hover:text-white'
            }
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="text-[#F5EDD8] border-[#111009] disabled:opacity-40"
      >
        Siguiente
      </Button>
    </div>
  )
}

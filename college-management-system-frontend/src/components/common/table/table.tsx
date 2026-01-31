import * as React from 'react';

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'

interface IProps {
    columns: any[]
    data: any[]
    pagination?: {
      currentPage: number
      totalPages: number
      perPage: number
      total: number
      next_page: number | null,
      prev_page: number | null,
      has_next_page: boolean,
      has_prev_page: boolean
    }
    onPageChange?: (page: number) => void
}

const Table:React.FC<IProps> = ({ columns, data=[], pagination, onPageChange }) => {

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })

    const handlePrev = () => {
      if (pagination && pagination.has_prev_page) {
        onPageChange && onPageChange(pagination.prev_page ?? 1)
    }
    }

    const handleNext = () => {
      if (pagination && pagination.has_next_page) {
        onPageChange && onPageChange(pagination.next_page ?? pagination.totalPages)
      }
    }

    const handlePageClick = (page: number) => {
      onPageChange?.(page)
    }

    return (
      <div className='w-full overflow-x-auto rounded-lg shadow-md border border-gray-200'>
        <table className='w-full text-sm text-gray-800 min-w-[600px] scroll-auto'>
          <thead className='bg-indigo-600 text-white sticky top-0 z-10 shadow-sm'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                      key={header.id}
                      className='px-4 py-3 text-center font-bold tracking-wide
                                    text-xs sm:text-sm md:text-base
                                    bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400
                                    text-white border-r border-gray-300 last:border-r-0'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-100/50 transition-colors duration-200`} key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td className='px-4 py-3 text-center border-b border-gray-200 border-r last:border-r-0' key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
          {pagination && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6 mb-6">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                disabled={!pagination.has_prev_page}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
                  ${
                    pagination.has_prev_page
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer shadow-sm hover:shadow-md'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                  }`}
              >
                ‹ Prev
              </button>
                
              {/* Page Numbers */}
              {(() => {
                const totalPages =
                  (pagination as any).totalPages ??
                  (pagination as any).total_pages ??
                  (pagination.total && (pagination.perPage || (pagination as any).per_page)
                    ? Math.ceil(
                        pagination.total / (pagination.perPage ?? (pagination as any).per_page)
                      )
                    : 0);

                if (!totalPages || totalPages < 1) return null;
                  
                return (
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNumber = i + 1;
                      const isActive = pagination.currentPage === pageNumber;
                    
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageClick(pageNumber)}
                          className={`px-3 py-2 w-10 text-sm rounded-lg font-semibold transition-all duration-200 cursor-pointer
                            ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!pagination.has_next_page}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
                  ${
                    pagination.has_next_page
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer shadow-sm hover:shadow-md'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                  }`}
              >
                Next ›
              </button>
            </div>
          )}

      </div>
    )
}

export default Table;

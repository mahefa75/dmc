import React from 'react'

const Table = ({
  columns = [],
  data = [],
  onRowClick,
  className = '',
  striped = true,
  hover = true
}) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-navy-600 ${className}`}>
      <table className="min-w-full divide-y divide-navy-600">
        <thead className="bg-navy-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-navy-700 divide-y divide-navy-600`}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-400"
              >
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${striped && rowIndex % 2 === 0 ? 'bg-navy-700' : 'bg-navy-700/50'}
                  ${hover && onRowClick ? 'hover:bg-navy-600 cursor-pointer' : ''}
                  transition-colors
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                  >
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

interface Column {
  header: string
  accessor: string
  cell?: (value: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  title: string
  description?: string
}

export function DataTable({ columns, data, title, description }: DataTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold leading-none tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="p-6 pt-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      {column.cell
                        ? column.cell(row[column.accessor])
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 
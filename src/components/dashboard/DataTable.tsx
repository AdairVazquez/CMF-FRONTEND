"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "Sin datos disponibles",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "#0D1117", borderColor: "#1C2333" }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: "#1C2333" }}>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={`text-xs font-semibold uppercase tracking-wide ${col.className ?? ""}`}
                style={{ color: "#6B7280", background: "#080B0F" }}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} style={{ borderColor: "#1C2333" }}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    <div
                      className="h-4 rounded animate-pulse"
                      style={{ background: "#1C2333", width: "60%" }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow style={{ borderColor: "#1C2333" }}>
              <TableCell
                colSpan={columns.length}
                className="text-center py-12 text-sm"
                style={{ color: "#6B7280" }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={String(row[keyField])}
                className="transition-colors hover:bg-white/[0.02]"
                style={{ borderColor: "#1C2333" }}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className="text-sm" style={{ color: "#B9C0C8" }}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

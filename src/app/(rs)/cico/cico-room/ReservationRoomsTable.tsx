"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  CircleCheckIcon,
  CircleXIcon,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Filter from "@/components/react-table/Filter";
import { usePolling } from "@/hooks/usePolling";

type RowType = {
  roomNumber: string;
  roomType: string;
  bedType: string;
  maxOccupants: number | null;
  maxChildren: number | null;
  status: string;
  ratePerNight: string | null;
  assignedDate: Date | null;
  checkInTime: Date | null;
  checkOutTime: Date | null;
};

type Props = {
  data: RowType[];
};

export default function ReservationCicoTable({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  usePolling(searchParams.get("searchText"), 30000);

  const pageIndex = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  }, [searchParams]);

  const columnHeadersArray: Array<keyof RowType> = [
    "roomNumber",
    "roomType",
    "bedType",
    "maxOccupants",
    "maxChildren",
    "status",
    "ratePerNight",
    "assignedDate",
    "checkInTime",
    "checkOutTime",
  ];

  const columnLabelMap: Record<keyof RowType, string> = {
    roomNumber: "Room #",
    roomType: "Room Type",
    bedType: "Bed Type",
    maxOccupants: "Max Occupants",
    maxChildren: "Max Children",
    status: "Status",
    ratePerNight: "Rate/Night",
    assignedDate: "Assigned Date",
    checkInTime: "Check-In Time",
    checkOutTime: "Check-Out Time",
  };

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((columnName) =>
    columnHelper.accessor((row) => row[columnName], {
      id: columnName,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-1 w-full flex justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {columnLabelMap[columnName]}
          {column.getIsSorted() === "asc" && (
            <ArrowUp className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
          {column.getIsSorted() === false && (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ getValue }) => {
        const value = getValue();

        if (columnName === "checkInTime" || columnName === "checkOutTime") {
          return value instanceof Date
            ? value.toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "-";
        }

        if (columnName === "assignedDate") {
          return value ? new Date(value).toLocaleDateString("en-US") : "-";
        }

        if (columnName === "ratePerNight" && typeof value === "string") {
          return value ? `$${parseFloat(value).toFixed(2)}` : "-";
        }

        if (columnName === "status" && typeof value === "string") {
          switch (value) {
            case "Active":
              return (
                <div className="text-green-600 flex items-center gap-1 font-medium">
                  <CircleCheckIcon className="w-4 h-4" /> Confirmed
                </div>
              );
            case "Cancelled":
              return (
                <div className="text-red-500 flex items-center gap-1 font-medium">
                  <CircleXIcon className="w-4 h-4" /> Cancelled
                </div>
              );
            case "Completed":
              return (
                <div className="text-blue-600 flex items-center gap-1 font-medium">
                  <CircleCheckIcon className="w-4 h-4" /> Completed
                </div>
              );
            case "No-show":
              return (
                <div className="text-yellow-600 flex items-center gap-1 font-medium">
                  <CircleXIcon className="w-4 h-4" /> No-show
                </div>
              );
            default:
              return <div className="opacity-70">{value}</div>;
          }
        }

        return value ?? "-";
      },
    })
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const currentPageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    if (pageCount <= currentPageIndex && currentPageIndex > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [table.getState().columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-lg overflow-hidden border border-border">
        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-secondary p-1"
                    style={{ width: header.getSize() }}
                  >
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                    {header.column.getCanFilter() && (
                      <div className="grid place-content-center">
                        <Filter
                          column={header.column}
                          filteredRows={table
                            .getFilteredRowModel()
                            .rows.map((row) => row.getValue(header.column.id))}
                        />
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`cursor-pointer hover:opacity-90 ${
                  row.original.status === "Active"
                    ? "bg-green-50 dark:bg-green-900/20"
                    : row.original.status === "Cancelled"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : row.original.status === "Completed"
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-gray-50 dark:bg-muted/40"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center gap-1 flex-wrap">
        <div>
          <p className="whitespace-nowrap font-bold">
            {`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(
              1,
              table.getPageCount()
            )}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length !== 1
                ? "total results"
                : "result"
            }]`}
          </p>
        </div>
        <div className="flex flex-row gap-1">
          <Button variant="outline" onClick={() => router.refresh()}>
            Refresh Data
          </Button>
          <Button variant="outline" onClick={() => table.resetSorting()}>
            Reset Sorting
          </Button>
          <Button variant="outline" onClick={() => table.resetColumnFilters()}>
            Reset Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const newIndex = table.getState().pagination.pageIndex - 1;
              table.setPageIndex(newIndex);
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", (newIndex + 1).toString());
              router.replace(`?${params.toString()}`, { scroll: false });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const newIndex = table.getState().pagination.pageIndex + 1;
              table.setPageIndex(newIndex);
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", (newIndex + 1).toString());
              router.replace(`?${params.toString()}`, { scroll: false });
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

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
import { RoomsType } from "@/lib/quaries/getRooms"; // Import RoomsType

type Props = {
  data: RoomsType;
};

type RowType = RoomsType[0];

export default function RoomTable({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "roomNumber",
      desc: false,
    },
  ]);

  usePolling(searchParams.get("searchText"), 30000);

  const pageIndex = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("page")]);

  const columnHeadersArray: Array<keyof RowType> = [
    "roomNumber",
    "roomType",
    "bedType",
    "maxOccupants",
    "maxChildren",
    "status",
    "ratePerNight",
    "ratePerWeek",
  ];

  const columnLabelMap: Record<keyof RowType, string> = {
    id: "ID",
    roomNumber: "Room Number",
    roomType: "Room Type",
    bedType: "Bed Type",
    maxOccupants: "Max Occupants",
    maxChildren: "Max Children",
    status: "Status",
    ratePerNight: "Rate Per Night",
    ratePerWeek: "Rate Per Week",
    ratePerMonth: "Rate Per Month",
  };

  const columnWidths = {
    roomNumber: 150,
    roomType: 150,
    bedType: 150,
    maxOccupants: 100,
    status: 150,
    ratePerNight: 150,
    ratePerWeek: 150,
    ratePerMonth: 150,
  };

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((columnName) =>
    columnHelper.accessor(
      (row) => {
        const value = row[columnName];
        if (
          (columnName === "ratePerNight" ||
            columnName === "ratePerWeek" ||
            columnName === "ratePerMonth") &&
          typeof value === "string"
        ) {
          return value ? `$${parseFloat(value).toFixed(2)}` : "N/A"; // Formatting rates as currency
        }
        return value;
      },
      {
        id: columnName,
        size: columnWidths[columnName as keyof typeof columnWidths],
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
            {column.getIsSorted() !== "desc" &&
              column.getIsSorted() !== "asc" && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
          </Button>
        ),
        cell: ({ getValue }) => {
          const value = getValue();
          if (columnName === "status" && typeof value === "string") {
            return (
              <div className="grid place-content-center font-medium">
                {value === "Available" && (
                  <div className="text-green-600 flex items-center gap-1">
                    <CircleCheckIcon className="w-4 h-4" /> Available
                  </div>
                )}
                {value === "Occupied" && (
                  <div className="text-orange-500 flex items-center gap-1">
                    <CircleCheckIcon className="w-4 h-4" /> Occupied
                  </div>
                )}
                {value === "Maintenance" && (
                  <div className="text-red-500 flex items-center gap-1">
                    <CircleXIcon className="w-4 h-4" /> Maintenance
                  </div>
                )}
              </div>
            );
          }
          return value;
        },
      }
    )
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
                className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                onClick={() =>
                  router.push(`/rooms/form?roomId=${row.original.id}`)
                }
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

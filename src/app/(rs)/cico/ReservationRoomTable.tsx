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
  Loader,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Filter from "@/components/react-table/Filter";
import { usePolling } from "@/hooks/usePolling";
import { ReservationCicoSearchResultsType } from "@/lib/quaries/getReservationCicoSearchResult";

type Props = {
  data: ReservationCicoSearchResultsType;
};

type RowType = ReservationCicoSearchResultsType[0];

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

  const columnHeadersArray: Array<keyof RowType | "customerName"> = [
    "customerName",
    "checkInDate",
    "checkOutDate",
    "numAdults",
    "numChildren",
    "status",
    "createdBy",
    "customerEmail",
  ];

  const columnLabelMap: Record<string, string> = {
    customerName: "Customer Name",
    id: "ID",
    checkInDate: "Check-In",
    checkOutDate: "Check-Out",
    numAdults: "# Adults",
    numChildren: "# Children",
    status: "Status",
    createdBy: "Created By",
    customerEmail: "Email",
    createdAt: "Created At",
  };

  const columnWidths = {
    customerName: 200,
    checkInDate: 150,
    checkOutDate: 150,
    numAdults: 100,
    numChildren: 100,
    status: 150,
    createdBy: 150,
    customerEmail: 250,
  };

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((columnName) => {
    if (columnName === "customerName") {
      return columnHelper.accessor(
        (row) => `${row.firstName} ${row.lastName}`,
        {
          id: "customerName",
          size: columnWidths.customerName,
          header: () => <span>{columnLabelMap["customerName"]}</span>,
          cell: ({ getValue }) => <span>{getValue()}</span>,
        }
      );
    }

    return columnHelper.accessor((row) => row[columnName as keyof RowType], {
      id: columnName,
      size: columnWidths[columnName as keyof typeof columnWidths] ?? 150,
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
        if (
          (columnName === "checkInDate" ||
            columnName === "checkOutDate" ||
            columnName === "createdAt") &&
          value instanceof Date
        ) {
          return value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
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
                <div className="text-gray-600 flex items-center gap-1 font-medium">
                  <CircleXIcon className="w-4 h-4" /> No-show
                </div>
              );

            case "Inprogress":
              return (
                <div className="text-yellow-600 flex items-center gap-1 font-medium">
                  <Loader className="w-4 h-4" /> Inprogress
                </div>
              );
            default:
              return <div className="opacity-70">{value}</div>;
          }
        }

        return value ?? "-";
      },
    });
  });

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
                onClick={() =>
                  router.push(
                    `/cico/cico-room?reservationId=${row.original.id}`
                  )
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

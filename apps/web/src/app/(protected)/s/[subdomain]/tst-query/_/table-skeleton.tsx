import { FilterIcon } from "lucide-react";

import { Button } from "@repo/design/components/ui/button";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design/components/ui/table";

export interface TableSkeletonProps {
  numCols: number;
  numRows: number;
}

export function TableSkeleton({ numRows, numCols }: TableSkeletonProps) {
  const rows = Array.from(Array(numRows).keys());
  const cols = Array.from(Array(numCols).keys());

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {cols.map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-[20px] w-[75px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((_, index) => (
              <TableRow key={index} className="h-12">
                {cols.map((_, index2) => (
                  <TableCell key={index2}>
                    <Skeleton className="h-[30px] w-[140px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-[20px] w-[200px]" />
          <Skeleton className="h-[20px] w-[150px]" />
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export function TableFilterSkeleton() {
  return (
    <div>
      <Button variant="outline" className="h-7" disabled>
        <FilterIcon className="size-4" />
        <span>Filter</span>
      </Button>
    </div>
  );
}

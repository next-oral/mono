/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit,
  Eye,
  MoreVertical,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { cn, truncateText } from "@repo/design/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Types and Interface Definitions for table
export type SortDirection = "asc" | "desc" | null;

export interface SubField {
  key: string;
  label?: string;
  className?: string;
}

export interface ColumnConfig {
  key: string;
  label?: string;
  sortable?: boolean;
  className?: string;
  maxLength?: number;
  subFields?: SubField[];
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ActionButton {
  key: "view" | "edit" | "delete";
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  className?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface CustomDataTableProps {
  data: any[];
  loading?: boolean;

  // Search Configuration
  searchable?: boolean;
  searchPlaceholder?: string;
  showSeeAll?: boolean;
  onSeeAllClick?: () => void;

  // Column (for table heads) Configuration
  columns?: ColumnConfig[];
  autoDetectColumns?: boolean;

  // Selection (checkbox) Configuration - Uses auto-generated IDs (1, 2, 3...)
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  rowIdKey?: string; // Only used for internal row identification, not for selection

  // Serial Number Configuration
  hasSerialNumber?: boolean; // Controls whether to show auto-generated serial numbers (default: false)

  // Pagination Configuration
  pagination?: PaginationConfig; // Optional - table will paginate by default without this
  hasNumberOfRows?: boolean; // Controls whether to show rows per page selector (default: false)

  // Action Buttons Configuration
  actionButtons?: ("view" | "edit" | "delete")[];
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onBulkDelete?: (selectedIds: string[]) => void;

  // Empty States
  emptyState?: React.ReactNode;
  noSearchResults?: React.ReactNode;

  // Styling
  className?: string;
  rowClassName?: string | ((row: any) => string);
}

// Utility Functions
const formatColumnLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
};

// This is to identify date fields for further formatting
const isDateField = (key: string): boolean => {
  const dateFields = [
    "date",
    "created",
    "updated",
    "createdAt",
    "updatedAt",
    "lastVisit",
    "lastTreatment",
  ];
  return dateFields.some((field) =>
    key.toLowerCase().includes(field.toLowerCase()),
  );
};

// This is for profiles and avatar styling
const isAvatarField = (key: string): boolean => {
  const avatarFields = ["avatar", "profile", "image", "photo", "picture"];
  return avatarFields.some((field) =>
    key.toLowerCase().includes(field.toLowerCase()),
  );
};

// Status fields
const isStatusField = (key: string): boolean => {
  const statusFields = ["status", "state", "condition"];
  return statusFields.some((field) =>
    key.toLowerCase().includes(field.toLowerCase()),
  );
};

// Check if field is an ID field that should be hidden
const isIdField = (key: string): boolean => {
  const idFields = ["id", "_id", "uuid", "objectId", "key"];
  return idFields.some((field) => key.toLowerCase() === field.toLowerCase());
};

// Format date to "2 FEB 2025" format
const formatDate = (dateValue: any): string => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return String(dateValue);

  const day = date.getDate();
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

// Advanced Pagination Component with Ellipses - Clean Design
const PaginationComponent: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers with ellipses logic
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Current page is near the beginning
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // Current page is in the middle
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between gap-1">
      {/* Previous Pagination Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* Pagination Page Numbers */}
      <div>
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-muted-foreground px-2 py-1 text-sm"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          return (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className="h-8 w-8 p-0"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Next Pagination Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
};

// Default Empty State Component
const DefaultEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <Search className="text-muted-foreground h-8 w-8" />
    </div>
    <h3 className="text-foreground mb-2 text-lg font-medium">
      No data available
    </h3>
    <p className="text-muted-foreground text-sm">
      There are no records to display at the moment.
    </p>
  </div>
);

// Default No Search Results Component
const DefaultNoSearchResults = ({ searchTerm }: { searchTerm: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <Search className="text-muted-foreground h-8 w-8" />
    </div>
    <h3 className="text-foreground mb-2 text-lg font-medium">
      No results found for "{searchTerm}"
    </h3>
    <p className="text-muted-foreground text-sm">Search for something else.</p>
  </div>
);

// Main Component
export const CustomDataTable: React.FC<CustomDataTableProps> = ({
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  showSeeAll = false,
  onSeeAllClick,
  columns,
  autoDetectColumns = true,
  selectable = true,
  selectedRows = [],
  onSelectionChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rowIdKey = "id", // This is kept for backward compatibility but not used for selection
  hasSerialNumber = false, // Controls whether to show auto-generated serial numbers
  hasNumberOfRows = false, // Controls whether to show rows per page selector
  actionButtons = ["view", "edit", "delete"],
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  pagination, // Optional - table will paginate by default without this
  emptyState,
  noSearchResults,
  className,
  rowClassName,
}) => {
  // Internal pagination state (used when pagination prop is not provided)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(50); // Default 50 records per page

  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({
    key: "",
    direction: null,
  });
  const [internalSelectedRows, setInternalSelectedRows] =
    useState<string[]>(selectedRows);

  // Update internal selection when prop changes
  useEffect(() => {
    setInternalSelectedRows(selectedRows);
  }, [selectedRows]);

  // Generate columns automatically if not provided
  const tableColumns = useMemo((): ColumnConfig[] => {
    let finalColumns: ColumnConfig[] = [];

    // Add serial number column if enabled
    if (hasSerialNumber) {
      finalColumns.push({
        key: "__serial__",
        label: "#",
        sortable: false,
        className: "w-16",
        render: (_: any, __: any, index: number) => (
          <span className="text-muted-foreground text-sm">{index + 1}</span>
        ),
      });
    }

    if (columns && columns.length > 0) {
      finalColumns = [...finalColumns, ...columns];
      return finalColumns;
    }

    if (!autoDetectColumns || data.length === 0) return finalColumns;

    const sampleRow = data[0];
    const autoColumns = Object.keys(sampleRow)
      .filter((key) => !isIdField(key)) // Filter out ID fields when auto-detecting
      .map((key): ColumnConfig => {
        const config: ColumnConfig = {
          key,
          label: formatColumnLabel(key),
          sortable: true,
        };

        // Auto-detect field types and apply appropriate styling
        if (isAvatarField(key)) {
          config.render = (value, row) => (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={value ?? "/placeholder.svg"} alt={row.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {(row.name ?? "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {row.name && (
                <div>
                  <div className="text-sm font-medium">{row.name}</div>
                  {row.phone && (
                    <div className="text-muted-foreground text-xs">
                      {row.phone}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        } else if (isDateField(key)) {
          config.render = (value) => (
            <span className="text-sm">{formatDate(value)}</span>
          );
        } else if (isStatusField(key)) {
          config.render = (value) => (
            <Badge variant={value === "active" ? "default" : "secondary"}>
              {String(value)}
            </Badge>
          );
        }

        return config;
      });

    return [...finalColumns, ...autoColumns];
  }, [columns, autoDetectColumns, data, hasSerialNumber]);

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) =>
      tableColumns.some((column) => {
        if (column.key === "__serial__") return false; // Skip serial number column in search
        const value = row[column.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }),
    );
  }, [data, searchTerm, tableColumns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (
      !sortConfig.key ||
      !sortConfig.direction ||
      sortConfig.key === "__serial__"
    )
      return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination logic - use internal pagination if no pagination prop provided
  const currentPage = pagination?.currentPage ?? internalCurrentPage;
  const pageSize = pagination?.pageSize ?? internalPageSize;
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get current page data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (pagination?.onPageChange) {
      pagination.onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    if (pagination?.onPageSizeChange) {
      pagination.onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
      setInternalCurrentPage(1); // Reset to first page when changing page size
    }
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (columnKey === "__serial__") return; // Don't sort serial number column

    setSortConfig((prev) => {
      if (prev.key !== columnKey) {
        return { key: columnKey, direction: "asc" };
      }

      switch (prev.direction) {
        case null:
          return { key: columnKey, direction: "asc" };
        case "asc":
          return { key: columnKey, direction: "desc" };
        case "desc":
          return { key: "", direction: null };
        default:
          return { key: "", direction: null };
      }
    });
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked
      ? paginatedData.map((_, index) =>
          String((currentPage - 1) * pageSize + index + 1),
        )
      : [];

    setInternalSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelection = checked
      ? [...internalSelectedRows, rowId]
      : internalSelectedRows.filter((id) => id !== rowId);

    setInternalSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    onBulkDelete?.(internalSelectedRows);
    setInternalSelectedRows([]);
    onSelectionChange?.([]);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Render cell content
  const renderCellContent = (column: ColumnConfig, row: any) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    if (column.subFields && column.subFields.length > 0) {
      return (
        <div className="space-y-1">
          <div className={cn("font-medium", column.className)}>
            {column.maxLength
              ? truncateText(String(value ?? ""), column.maxLength)
              : String(value ?? "")}
          </div>
          {column.subFields.map((subField) => (
            <div
              key={subField.key}
              className={cn(
                "text-muted-foreground text-sm",
                subField.className,
              )}
            >
              {subField.label && `${subField.label}: `}
              {String(row[subField.key] ?? "")}
            </div>
          ))}
        </div>
      );
    }

    const displayValue = column.maxLength
      ? truncateText(String(value ?? ""), column.maxLength)
      : String(value ?? "");

    return <span className={column.className}>{displayValue}</span>;
  };

  // Action buttons configuration
  const getActionButtons = (): ActionButton[] => {
    const buttons: ActionButton[] = [];

    if (actionButtons.includes("view") && onView) {
      buttons.push({
        key: "view",
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: onView,
      });
    }

    if (actionButtons.includes("edit") && onEdit) {
      buttons.push({
        key: "edit",
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: onEdit,
      });
    }

    if (actionButtons.includes("delete") && onDelete) {
      buttons.push({
        key: "delete",
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: onDelete,
        className: "text-destructive",
      });
    }

    return buttons;
  };

  const actionButtonsConfig = getActionButtons();

  // Loading state
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Search bar skeleton */}
        {searchable && (
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm flex-1">
              <div className="bg-secondary h-10 animate-pulse rounded-md" />
            </div>
            {showSeeAll && (
              <div className="bg-secondary h-10 w-20 animate-pulse rounded-md" />
            )}
          </div>
        )}

        {/* Table skeleton */}
        <div className="rounded-lg border">
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-secondary h-12 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1 bg-secondary px-1", className)}>
      {/* Search and Controls */}
      {(searchable ||
        showSeeAll ||
        internalSelectedRows.length > 0 || hasNumberOfRows) && (
        <div className="flex flex-wrap-reverse items-center justify-between gap-4 py-0.5">
          <div className="flex flex-1 items-center gap-4">
            {searchable && (
              <div className="relative max-w-sm flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform " />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-10 focring-0 sm:border-0"
                />
                {/* Clear search button */}
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                  >
                    <X className="text-muted-foreground hover:text-foreground h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Bulk delete button with the counter inside of it */}
            {internalSelectedRows.length > 0 && onBulkDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="h-8"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({internalSelectedRows.length})
              </Button>
            )}
          </div>

          {/* See All button has higher precedence than number of rows selector */}
          {showSeeAll ? (
            <Button variant="outline" onClick={onSeeAllClick}>
              See All
            </Button>
          ) : (
            hasNumberOfRows && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Rows:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-background">
        {paginatedData.length === 0 ? (
          <div className="min-h-[400px]">
            {searchTerm.trim()
              ? (noSearchResults ?? (
                  <DefaultNoSearchResults searchTerm={searchTerm} />
                ))
              : (emptyState ?? <DefaultEmptyState />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Checkboxes */}
                  {selectable && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          paginatedData.length > 0 &&
                          internalSelectedRows.length === paginatedData.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                  )}

                  {tableColumns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        column.sortable &&
                          "hover:bg-accent cursor-pointer select-none",
                        column.className,
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={cn(
                                "-mb-1 h-3 w-3",
                                sortConfig.key === column.key &&
                                  sortConfig.direction === "asc"
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                "h-3 w-3",
                                sortConfig.key === column.key &&
                                  sortConfig.direction === "desc"
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}

                  {actionButtonsConfig.length > 0 && (
                    <TableHead className="w-12">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((row, index) => {
                  const autoGeneratedId = String(
                    (currentPage - 1) * pageSize + index + 1,
                  ); // Auto-generated ID based on global position
                  const isSelected =
                    internalSelectedRows.includes(autoGeneratedId);
                  const computedRowClassName =
                    typeof rowClassName === "function"
                      ? rowClassName(row)
                      : rowClassName;

                  return (
                    <TableRow
                      key={autoGeneratedId}
                      className={cn(
                        isSelected && "bg-accent/50",
                        computedRowClassName,
                      )}
                    >
                      {/* FIXED: Checkbox is now always rendered when selectable=true */}
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(autoGeneratedId, !!checked)
                            }
                            aria-label={`Select row ${index + 1}`}
                          />
                        </TableCell>
                      )}

                      {tableColumns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={column.className}
                        >
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}

                      {actionButtonsConfig.length > 0 && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actionButtonsConfig.map((action) => (
                                <DropdownMenuItem
                                  key={action.key}
                                  onClick={() => action.onClick(row)}
                                  className={action.className}
                                >
                                  {action.icon}
                                  <span className="ml-2">{action.label}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Enhanced Pagination with Ellipses - Always show if there's data to paginate */}
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CustomDataTable;

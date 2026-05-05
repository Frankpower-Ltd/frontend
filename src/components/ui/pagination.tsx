import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { useMemo } from "react";

type PaginationItem = number | "ellipsis";

const buildPaginationItems = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PaginationItem[] => {
  if (totalPages <= 1) return [1];

  const pageSet = new Set<number>();
  pageSet.add(1);
  pageSet.add(totalPages);

  for (
    let page = currentPage - siblingCount;
    page <= currentPage + siblingCount;
    page += 1
  ) {
    if (page > 1 && page < totalPages) {
      pageSet.add(page);
    }
  }

  for (
    let page = 2;
    page <= Math.min(2 + siblingCount, totalPages - 1);
    page += 1
  ) {
    pageSet.add(page);
  }

  for (
    let page = Math.max(totalPages - (1 + siblingCount), 2);
    page < totalPages;
    page += 1
  ) {
    pageSet.add(page);
  }

  const sorted = [...pageSet].sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];

    if (index > 0 && previous !== undefined) {
      if (page - previous === 2) {
        items.push(previous + 1);
      } else if (page - previous > 2) {
        items.push("ellipsis");
      }
    }

    items.push(page);
  }

  return items;
};

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) => {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);

  const pageItems = useMemo(
    () => buildPaginationItems(safePage, safeTotalPages, siblingCount),
    [safePage, safeTotalPages, siblingCount],
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-2", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        disabled={safePage <= 1}
        onClick={() => onPageChange(1)}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        disabled={safePage <= 1}
        onClick={() => onPageChange(safePage - 1)}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={`page-${item}`}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 min-w-8 rounded-full px-3 text-xs",
                item === safePage &&
                  "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground",
              )}
              onClick={() => onPageChange(item)}
              aria-current={item === safePage ? "page" : undefined}
              aria-label={`Go to page ${item}`}
            >
              {item}
            </Button>
          ),
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        disabled={safePage >= safeTotalPages}
        onClick={() => onPageChange(safePage + 1)}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        disabled={safePage >= safeTotalPages}
        onClick={() => onPageChange(safeTotalPages)}
        aria-label="Go to last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export default Pagination;

"use client"
import type { ListViewClientProps } from 'payload'
import { useListQuery, useConfig, useTranslation } from '@payloadcms/ui' // Adjusted for plausible Payload hook paths
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

// ShadCN UI components
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

// Helper to generate pagination items (numbers, ellipsis)
// This is a simplified version; you might want a more robust one for edge cases.
const generatePagination = (currentPage: number, totalPages: number, siblingCount: number = 1): (string | number)[] => {
  const totalPageNumbers = siblingCount * 2 + 5; // firstPage + lastPage + currentPage + 2*siblings + 2*ellipsis

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    if (currentPage <= siblingCount + 1) { // Adjust if current page is near the beginning
        leftItemCount = Math.max(5, currentPage + siblingCount +1)
    }
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
     let rightItemCount = 3 + 2 * siblingCount;
     if (totalPages - currentPage <= siblingCount) { // Adjust if current page is near the end
        rightItemCount = Math.max(5, totalPages - currentPage + siblingCount + 2)
     }
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
    return [firstPageIndex, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }
  // Fallback or when totalPages is small enough that no dots are needed (handled by first check)
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};


function TestimonialsList(props: ListViewClientProps) {
  // const { collectionSlug } = props; // collectionSlug is available if needed for config

  const {
    data,
    handlePageChange,
  } = useListQuery();

  const { i18n } = useTranslation();
  // const { getEntityConfig } = useConfig();
  // const collectionConfig = getEntityConfig({ collectionSlug }); // For dynamic labels, fields etc.

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  if (!data.docs || data.docs.length === 0) {
    // const singularLabel = collectionConfig ? getTranslation(collectionConfig.labels.singular, i18n) : 'item';
    // You could add a "Create New" button here if newDocumentURL is available from props
    return <div className="p-4">No tenants found.</div>;
  }

  const {
    docs,
    hasNextPage,
    hasPrevPage,
    limit, // eslint-disable-line @typescript-eslint/no-unused-vars
    nextPage,
    page,
    prevPage,
    totalDocs,
    totalPages,
  } = data;

  // Define columns - these should ideally come from collectionConfig or be more dynamic
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const paginationItems = generatePagination(page || 1, totalPages || 0);

  return (
    <div className="p-4 md:p-6">
      {/* <h1 className="text-2xl font-semibold mb-4">
        {collectionConfig ? getTranslation(collectionConfig.labels.plural, i18n) : 'Items'}
      </h1> */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc: any) => ( // Use 'any' for doc type for simplicity; ideally, use your Tenant type
              <TableRow key={doc.id || JSON.stringify(doc)}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {typeof doc[col.key] === 'object'
                      ? col.key === 'createdAt' || col.key === 'updatedAt' // Basic date formatting
                        ? new Date(doc[col.key]).toLocaleDateString()
                        : JSON.stringify(doc[col.key])
                      : String(doc[col.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}. Showing {docs.length} of {totalDocs}{' '}
              {/* {collectionConfig ? getTranslation(collectionConfig.labels.plural, i18n).toLowerCase() : 'items'}. */}
              tenants.
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              {hasPrevPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (handlePageChange && typeof prevPage === 'number') { 
                        handlePageChange(prevPage); 
                      }
                    }}
                  />
                </PaginationItem>
              )}

              {paginationItems.map((item, index) => (
                <PaginationItem key={index}>
                  {typeof item === 'number' ? (
                    <PaginationLink
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (handlePageChange && typeof item === 'number') handlePageChange(item); }}
                      isActive={page === item}
                    >
                      {item}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}

              {hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (handlePageChange && typeof nextPage === 'number') { 
                        handlePageChange(nextPage); 
                      }
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default TestimonialsList
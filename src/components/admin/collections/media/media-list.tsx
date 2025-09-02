"use client"

import type { ListViewClientProps } from 'payload'
import { useListQuery, useTranslation } from '@payloadcms/ui'
import React from 'react'
import PayloadImage from '@/components/PayloadImage'
import { Media, Media as MediaType } from '@payload-types'

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

function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return 'N/A';
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const generatePagination = (currentPage: number, totalPages: number, siblingCount: number = 1): (string | number)[] => {
  const totalPageNumbers = siblingCount * 2 + 5;
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
    if (currentPage <= siblingCount + 1) { 
        leftItemCount = Math.max(5, currentPage + siblingCount +1)
    }
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
     let rightItemCount = 3 + 2 * siblingCount;
     if (totalPages - currentPage <= siblingCount) { 
        rightItemCount = Math.max(5, totalPages - currentPage + siblingCount + 2)
     }
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
    return [firstPageIndex, '...', ...rightRange];
  }
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

function MediaList(props: ListViewClientProps) {
  const {
    data,
    handlePageChange,
  } = useListQuery();

  const { t } = useTranslation();

  if (!data) {
    return <div className="p-4 md:p-6">Nalagam...</div>;
  }

  if (!data.docs || data.docs.length === 0) {
    return <div className="p-4 md:p-6">Ni slik.</div>;
  }

  const {
    docs,
    hasNextPage,
    hasPrevPage,
    nextPage,
    page,
    prevPage,
    totalDocs,
    totalPages,
  } = data;

  const columns = [
    { key: 'thumbnail', label: 'Thumbnail', width: 'w-20' },
    { key: 'filename', label: 'Filename' },
    { key: 'mimeType', label: 'Type' },
    { key: 'filesize', label: 'Size' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'createdAt', label: 'Uploaded At' },
  ];

  const paginationItems = generatePagination(page || 1, totalPages || 0);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Slike</h1>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.width || ''}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((mediaItem) => (
              <TableRow key={mediaItem.id}>
                <TableCell className="py-2 px-2">
                  {(mediaItem.thumbnailURL || mediaItem.url) && (
                    <div className="relative h-12 w-16 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={mediaItem.thumbnailURL || mediaItem.url || ''} 
                        alt={mediaItem.alt || mediaItem.filename || ''}
                        className="absolute inset-0 w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-2 px-2 whitespace-nowrap">{mediaItem.filename}</TableCell>
                <TableCell className="py-2 px-2 whitespace-nowrap">{mediaItem.mimeType}</TableCell>
                <TableCell className="py-2 px-2 whitespace-nowrap">{formatFileSize(mediaItem.filesize)}</TableCell>
                <TableCell className="py-2 px-2 whitespace-nowrap">
                  {mediaItem.width && mediaItem.height ? `${mediaItem.width} × ${mediaItem.height}` : 'N/A'}
                </TableCell>
                <TableCell className="py-2 px-2 whitespace-nowrap">{formatDate(mediaItem.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {`Stran ${page} od ${totalPages}. Prikazujem ${docs.length} od ${totalDocs} slik.`}
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

export default MediaList;
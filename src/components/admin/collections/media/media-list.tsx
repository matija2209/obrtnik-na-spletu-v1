import { ListViewServerProps } from 'payload'
import React from 'react'
import Image from 'next/image'
import { Media } from '@payload-types'

type MediaListData = {
  docs: Media[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function MediaList(props: ListViewServerProps) {
  const data = props.data as MediaListData
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>
      
      {/* Grid layout for media items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {data.docs.map((media) => (
          <div key={media.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image thumbnail */}
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={media.thumbnailURL || media.url || ''}
                alt={media.alt || media.filename || ''}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                priority={false}
              />
            </div>
            
            {/* Image details */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate" title={media.filename || ''}>
                {media.filename}
              </h3>
              
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium">Type:</span> {media.mimeType}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {formatFileSize(media.filesize || 0)}
                </p>
                <p>
                  <span className="font-medium">Dimensions:</span> {media.width} × {media.height}
                </p>
                <p>
                  <span className="font-medium">Uploaded:</span> {formatDate(media.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {data.pagingCounter} to {Math.min(data.pagingCounter + data.docs.length - 1, data.totalDocs)} of {data.totalDocs} items
        </div>
        
        <div className="flex space-x-2">
          {data.hasPrevPage && (
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Previous
            </button>
          )}
          
          {data.hasNextPage && (
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaList
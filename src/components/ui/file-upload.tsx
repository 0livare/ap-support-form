import { Upload, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { cn } from '@/lib/utils'

interface FileUploadUIProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onBlur?: () => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  'aria-invalid'?: boolean
}

interface FilePreview {
  url: string
  name: string
  size: number
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
}

export function FileUploadUI({
  files,
  onFilesChange,
  onBlur,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxFiles = 10,
  maxSize = 5242880, // 5MB
  disabled = false,
  'aria-invalid': ariaInvalid,
}: FileUploadUIProps) {
  const [previews, setPreviews] = useState<FilePreview[]>([])

  // Create preview URLs for images
  useEffect(() => {
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))
    setPreviews(newPreviews)

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [files])

  const handleRemove = useCallback(
    (index: number) => {
      const newFiles = [...files]
      newFiles.splice(index, 1)
      onFilesChange(newFiles)
    },
    [files, onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections, open } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    multiple: true,
    disabled,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles]
      onFilesChange(newFiles)
      // Call onBlur after files are added to mark field as touched
      onBlur?.()
    },
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        data-slot="file-upload"
        className={cn(
          'border-input h-32 w-full rounded-md border-2 border-dashed bg-transparent px-4 py-6',
          'flex flex-col items-center justify-center gap-2',
          'transition-colors',
          'hover:border-ring hover:bg-accent/50',
          isDragActive && 'border-ring bg-accent/50 ring-ring/50 ring-[3px]',
          disabled && 'opacity-50',
          ariaInvalid &&
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        )}
        aria-invalid={ariaInvalid}
      >
        <input {...getInputProps()} />
        <Upload className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isDragActive ? (
              <span className="font-medium">Drop files here</span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={open}
                  disabled={disabled}
                  className="font-medium text-foreground hover:underline focus:underline focus:outline-none"
                >
                  Click to upload
                </button>{' '}
                or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Images up to {formatFileSize(maxSize)} (max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-2">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-xs text-destructive">
              {file.name}: {errors.map((e) => e.message).join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={preview.url} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border border-input bg-muted">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const icon = document.createElement('div')
                      icon.className = 'w-full h-full flex items-center justify-center'
                      icon.innerHTML =
                        '<svg class="size-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
                      parent.appendChild(icon)
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className={cn(
                  'absolute -top-2 -right-2 size-6 rounded-full bg-destructive text-white',
                  'cursor-pointer transition-all hover:scale-110',
                  'opacity-0 group-hover:opacity-100',
                  'flex items-center justify-center hover:bg-destructive/90',
                  'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2',
                )}
                aria-label={`Remove ${preview.name}`}
              >
                <X className="size-4" />
              </button>
              <p className="mt-1 text-xs text-muted-foreground truncate" title={preview.name}>
                {preview.name}
              </p>
              <p className="text-xs text-muted-foreground">{formatFileSize(preview.size)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

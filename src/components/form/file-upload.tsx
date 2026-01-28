import { useCallback } from 'react'
import { FileUploadDropzone, FileUploadPreviews } from '@/components/ui/file-upload'
import { useFieldContext } from '@/hooks/demo.form-context'
import { FormControl } from './form-control'

export function FileUpload({
  label,
  accept,
  maxFiles,
  maxSize,
}: {
  label: string
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
}) {
  const field = useFieldContext<File[]>()

  const handleRemove = useCallback(
    (index: number) => {
      const files = field.state.value ?? []
      const newFiles = [...files]
      newFiles.splice(index, 1)
      field.handleChange(newFiles)
    },
    [field],
  )

  return (
    <>
      <FormControl label={label} field={field}>
        <FileUploadDropzone
          files={field.state.value ?? []}
          onFilesChange={(files) => field.handleChange(files)}
          onBlur={field.handleBlur}
          accept={accept}
          maxFiles={maxFiles}
          maxSize={maxSize}
          aria-invalid={field.state.meta.errors.length > 0}
        />
      </FormControl>
      <FileUploadPreviews files={field.state.value ?? []} onRemove={handleRemove} />
    </>
  )
}

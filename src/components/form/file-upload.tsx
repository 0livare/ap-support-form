import { FileUploadUI } from '@/components/ui/file-upload'
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

  return (
    <FormControl label={label} field={field}>
      <FileUploadUI
        files={field.state.value ?? []}
        onFilesChange={(files) => field.handleChange(files)}
        onBlur={field.handleBlur}
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </FormControl>
  )
}

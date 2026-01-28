import { Button } from '@/components/ui/button'
import { useFormContext } from '@/hooks/form/form-context'

export function SubmitButton({
  label = 'Submit',
  disabled = false,
}: {
  label?: string
  disabled?: boolean
}) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={disabled || isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

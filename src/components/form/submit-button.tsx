import { Button } from '@/components/ui/button'
import { useFormContext } from '@/hooks/form/form-context'

export function SubmitButton({ label = 'Submit' }: { label?: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

import { useStore } from '@tanstack/react-form'
import { Label } from '@/components/ui/label'
import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { useFieldContext } from '@/hooks/demo.form-context'
import { ErrorMessages } from './error-message'

export function Switch({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

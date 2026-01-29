import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { useFieldContext } from '@/hooks/form/form-context'
import { FormControl } from './form-control'

export function Switch({ label }: { label: string }) {
  const field = useFieldContext<boolean>()

  return (
    <FormControl
      label={label}
      field={field}
      classes={{ labelRoot: 'flex flex-row items-center gap-2' }}
    >
      <ShadcnSwitch
        id={label}
        onBlur={field.handleBlur}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
      />
    </FormControl>
  )
}

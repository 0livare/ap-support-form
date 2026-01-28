import { Input } from '@/components/ui/input'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import { useFieldContext } from '@/hooks/demo.form-context'
import { FormControl } from './form-control'

export function TextField({ label, placeholder }: { label: string; placeholder?: string }) {
  const field = useFieldContext<string>()

  return (
    <FormControl label={label} field={field}>
      <Input
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </FormControl>
  )
}

export function TextArea(props: { label: string } & React.ComponentProps<typeof ShadcnTextarea>) {
  const { label, rows = 3, ...rest } = props

  const field = useFieldContext<string>()

  return (
    <FormControl label={label} field={field}>
      <ShadcnTextarea
        {...rest}
        id={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        rows={rows}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </FormControl>
  )
}

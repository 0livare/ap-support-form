import { useStore } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import { useFieldContext } from '@/hooks/demo.form-context'
import { ErrorMessages } from './error-message'

export function TextField({ label, placeholder }: { label: string; placeholder?: string }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label>
        <span>{label}</span>
        <Input
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </Label>

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function TextArea(props: { label: string } & React.ComponentProps<typeof ShadcnTextarea>) {
  const { label, rows = 3, ...rest } = props

  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label>
        <span>{label}</span>
        <ShadcnTextarea
          {...rest}
          id={label}
          value={field.state.value}
          onBlur={field.handleBlur}
          rows={rows}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </Label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

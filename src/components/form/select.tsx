import { useStore } from '@tanstack/react-form'
import { Label } from '@/components/ui/label'
import * as ShadcnSelect from '@/components/ui/select'
import { useFieldContext } from '@/hooks/demo.form-context'
import { ErrorMessages } from './error-message'

export function Select({
  label,
  values,
  placeholder,
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label>
        <span>{label}</span>
        <ShadcnSelect.Select
          name={field.name}
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
        >
          <ShadcnSelect.SelectTrigger className="w-full">
            <ShadcnSelect.SelectValue placeholder={placeholder} />
          </ShadcnSelect.SelectTrigger>
          <ShadcnSelect.SelectContent>
            <ShadcnSelect.SelectGroup>
              {values.map((value) => (
                <ShadcnSelect.SelectItem key={value.value} value={value.value}>
                  {value.label}
                </ShadcnSelect.SelectItem>
              ))}
            </ShadcnSelect.SelectGroup>
          </ShadcnSelect.SelectContent>
        </ShadcnSelect.Select>
      </Label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

import { useStore } from '@tanstack/react-form'
import { Label } from '@/components/ui/label'
import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { useFieldContext } from '@/hooks/demo.form-context'
import { ErrorMessages } from './error-message'

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label>
        <span>{label}</span>
        <ShadcnSlider
          id={label}
          onBlur={field.handleBlur}
          value={[field.state.value]}
          onValueChange={(value) => field.handleChange(value[0])}
        />
      </Label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

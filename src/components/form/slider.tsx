import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { useFieldContext } from '@/hooks/form/form-context'
import { FormControl } from './form-control'

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>()

  return (
    <FormControl label={label} field={field}>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
    </FormControl>
  )
}

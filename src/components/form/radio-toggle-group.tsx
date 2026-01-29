import type { ToggleGroupSingleProps } from '@radix-ui/react-toggle-group'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { useFieldContext } from '@/hooks/form/form-context'
import { cn } from '@/lib/utils'
import { FormControl, type FormControlProps } from './form-control'

type ToggleGroupProps = Omit<ToggleGroupSingleProps, 'type' | 'value' | 'onValueChange'>

interface RadioToggleGroupProps extends Partial<FormControlProps> {
  label: string
  toggleGroupProps?: ToggleGroupProps
}

export function RadioToggleGroup(props: RadioToggleGroupProps) {
  const { children, label, toggleGroupProps, classes, ...rest } = props
  const field = useFieldContext<string>()

  return (
    <FormControl
      {...rest}
      label={label}
      field={field}
      classes={{
        ...classes,
        labelRoot: cn('flex flex-row items-center gap-2', classes?.labelRoot),
      }}
    >
      <ToggleGroup
        variant="outline"
        {...toggleGroupProps}
        value={field.state.value}
        type="single"
        onValueChange={(value) => {
          if (value) field.handleChange(value)
        }}
      >
        {children}
      </ToggleGroup>
    </FormControl>
  )
}

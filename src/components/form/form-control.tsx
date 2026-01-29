import { type FieldApi, useStore } from '@tanstack/react-form'
import type React from 'react'
import { Label } from '@/components/ui/label'
import { useIsFieldOptional } from '@/lib/form-utils'
import { cn } from '@/lib/utils'

export interface FormControlProps extends React.ComponentProps<'div'> {
  label: string
  description?: React.ReactNode
  // biome-ignore format lint/suspicious/noExplicitAny: don't split all these any's onto their own line
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  classes?: {
    root?: string
    labelRoot?: string
    labelText?: string
  }
  isOptional?: boolean
}

export function FormControl(props: FormControlProps) {
  const {
    children,
    className,
    field,
    label,
    description,
    classes,
    isOptional: isOptionalOverride,
    ...rest
  } = props

  const errors = useStore(field.store, (state) => state.meta.errors)
  const isOptional = useIsFieldOptional(field)

  return (
    <div className={cn(className, classes?.root)} {...rest}>
      <Label
        label={label}
        isOptional={isOptionalOverride ?? isOptional}
        classes={{ root: classes?.labelRoot, text: classes?.labelText }}
      >
        {children}
      </Label>
      {description && <div className="text-sm text-muted-foreground my-1">{description}</div>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function ErrorMessages({ errors }: { errors: Array<string | { message: string }> }) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-500 mt-1 text-xs"
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}

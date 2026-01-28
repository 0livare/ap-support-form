import { useStore } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as ShadcnSelect from '@/components/ui/select'
import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import { useFieldContext, useFormContext } from '@/hooks/demo.form-context'

export function SubscribeButton({ label }: { label: string }) {
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

function ErrorMessages({ errors }: { errors: Array<string | { message: string }> }) {
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

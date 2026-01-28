import type { ZodTypeAny } from 'zod'

/**
 * Checks if a zod schema field is optional
 */
export function isZodFieldOptional(schema: ZodTypeAny, fieldPath: string): boolean {
  try {
    // For ZodObject, we can check the shape
    if ('shape' in schema && schema.shape) {
      const shape = schema.shape as Record<string, ZodTypeAny>
      const fieldSchema = shape[fieldPath]

      if (!fieldSchema) {
        return false
      }

      // Check if it accepts undefined - this is the most reliable way
      const result = fieldSchema.safeParse(undefined)
      return result.success
    }

    return false
  } catch {
    return false
  }
}

/**
 * Hook to determine if the current form field is optional
 */
export function useIsFieldOptional(field: {
  name: string
  form: { options?: { validators?: { onBlur?: unknown } } }
}): boolean {
  try {
    // Access the onBlur validator which should be our zod schema
    const validator = field.form?.options?.validators?.onBlur

    if (!validator) {
      return false
    }

    // Get the field name from the field API
    const fieldName = field.name

    return isZodFieldOptional(validator as ZodTypeAny, fieldName)
  } catch {
    return false
  }
}

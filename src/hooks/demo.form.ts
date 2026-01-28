import { createFormHook } from '@tanstack/react-form'

import { FileUpload, Select, SubmitButton, TextArea, TextField } from '@/components/form'
import { fieldContext, formContext } from './demo.form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    FileUpload,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

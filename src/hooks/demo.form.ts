import { createFormHook } from '@tanstack/react-form'

import { FileUpload, Select, SubmitButton, Switch, TextArea, TextField } from '@/components/form'
import { fieldContext, formContext } from './demo.form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    FileUpload,
    Switch,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

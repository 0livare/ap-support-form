import { createFormHook } from '@tanstack/react-form'
import {
  FileUpload,
  RadioToggleGroup,
  Select,
  SubmitButton,
  Switch,
  TextArea,
  TextField,
} from '@/components/form'
import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    FileUpload,
    Switch,
    RadioToggleGroup,
    ToggleGroupItem,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

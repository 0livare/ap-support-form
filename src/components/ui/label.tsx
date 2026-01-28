'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import type * as React from 'react'

import { cn } from '@/lib/utils'

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  label: string
  isOptional?: boolean
  classes?: {
    root?: string
    text?: string
    optionalText?: string
  }
}

export function Label(props: LabelProps) {
  const { children, className, label, isOptional, classes, ...rest } = props

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex flex-col items-start gap-2',
        'select-none group-data-[disabled=true]:pointer-events-none',
        'group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
        classes?.root,
      )}
      {...rest}
    >
      <span className={cn('text-sm font-medium leading-snug', classes?.text)}>
        {label}
        {isOptional && (
          <span className={cn('text-muted-foreground font-normal ml-1', classes?.optionalText)}>
            (optional)
          </span>
        )}
      </span>

      {children}
    </LabelPrimitive.Root>
  )
}

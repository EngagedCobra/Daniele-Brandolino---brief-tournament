import React, { Component, type ReactElement, type ReactNode } from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty'
import { Loader2, OctagonAlert } from 'lucide-react'
import { Button } from '@base-ui/react'

type EmptyProps = {
  title: string,
  message?: string,
  icon?: ReactNode,
  link?: any,
  linkText?: string
}

const CustomEmpty = ({ title, message, icon, link, linkText }: EmptyProps) => {
  return (
    <>
    <Empty className="border">
        <EmptyHeader>
          {icon ? <EmptyMedia variant="icon">
            {icon}
          </EmptyMedia> : ""}
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {link ? <Button onClick={() => link}>{linkText}</Button> : ""}
        </EmptyContent>
      </Empty>
    </>
  )
}

export default CustomEmpty
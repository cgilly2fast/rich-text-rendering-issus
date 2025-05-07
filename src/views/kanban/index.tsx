import React from 'react'
import { AdminViewProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { notFound } from 'next/navigation'
import { TaskDrawerProvider } from './TaskDrawerProvider'
import TaskDrawer from './TaskDrawer'
import TaskButton from './TaskButton'
import { Gutter } from '@payloadcms/ui'

const Kanban: React.FC<AdminViewProps> = async ({ initPageResult, params, searchParams }) => {
  const { user } = initPageResult.req
  if (!user) {
    return notFound()
  }

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req?.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <TaskDrawerProvider>
        <Gutter>
          <h1 className="text-2xl font-bold mb-6">Task Drawer Demo</h1>
          <p className="mb-4">Click the button below to open the task drawer with a sample task.</p>
          <TaskButton />
          <TaskDrawer />
        </Gutter>
      </TaskDrawerProvider>
    </DefaultTemplate>
  )
}

export default Kanban

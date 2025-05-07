'use client'
import { useEffect, useMemo } from 'react'
import { DefaultEditView, DocumentInfoProvider, useAuth, XIcon } from '@payloadcms/ui'
import { TaskDrawerContent } from './TaskDrawerContent'
import { useTaskDrawer } from './TaskDrawerProvider'
import { getId } from './getId'

interface TaskDrawerProps {
  onSoftTaskUpdate?: (
    taskId: string,
    updates: {
      name?: string
      completed?: boolean
      priority?: 'low' | 'medium' | 'high' | 'asap'
      assignee?: string[]
    },
  ) => void
}

export default function TaskDrawer({ onSoftTaskUpdate }: TaskDrawerProps) {
  const { isOpen, taskData, closeDrawer, drawerWidth } = useTaskDrawer()
  const { permissions, user } = useAuth()

  /*
  Init form data so there is no loading when drawer opens
  THIS FUNCTION transformObjectToPaths SUCKS NEEDS TO REDONE BASED ON THE TASK COLLECTION CONFIG
  SEE HOW THE PIPELINE VALUE IS HARD CODED, NO BUENO
  */
  function transformObjectToPaths(inputObject: any, arrayProps = ['dependencies']) {
    if (!inputObject) return {}

    const result: { [key: string]: any } = {}

    Object.entries(inputObject).forEach(([key, value]) => {
      if (!arrayProps.includes(key)) {
        result[key] = { value, valid: true }
      }
    })

    arrayProps.forEach((propName) => {
      const array = inputObject[propName]
      if (array && Array.isArray(array)) {
        result[propName] = {
          rows: array.map((item) => ({ id: getId(item) })),
          value: array.length,
          valid: true,
          passesCondition: true,
          requiresRender: false,
          disableFormData: true,
        }

        // Process each item in the array
        array.forEach((item, index) => {
          result[`${propName}.${index}.id`] = {
            initialValue: item.id,
            passesCondition: true,
            value: item.id,
            valid: true,
          }

          Object.entries(item).forEach(([key, value]) => {
            if (key !== 'id') {
              const path = `${propName}.${index}.${key}`

              // THIS IS THE PART THAT IS GROSS
              if (
                (propName === 'pipelines' && key === 'pipeline') ||
                (propName === 'comments' && key === 'author') ||
                (propName === 'dependencies' && key === 'task')
              ) {
                result[path] = {
                  initialValue: getId(value as any),
                  passesCondition: true,
                  value: getId(value as any),
                  valid: true,
                }
              } else {
                result[path] = { value, valid: true }
              }
            }
          })
        })
      }
    })

    return result
  }

  //Hacky remove unwanted elements
  useEffect(() => {
    if (isOpen) {
      // Create a style element to inject CSS
      const styleElement = document.createElement('style')
      styleElement.id = 'task-drawer-styles'
      styleElement.textContent = `
        .doc-controls__meta, .doc-tabs, .document-fields__sidebar-wrap {
          display: none !important;
        }
        .doc-controls__content {
          padding: 0 !important;
        }
      `
      document.head.appendChild(styleElement)

      return () => {
        // Clean up by removing the style element when drawer closes
        const styleToRemove = document.getElementById('task-drawer-styles')
        if (styleToRemove) {
          styleToRemove.remove()
        }
      }
    }
  }, [isOpen])

  const data = useMemo(() => {
    return {
      ...transformObjectToPaths(taskData, ['pipelines', 'comments', 'dependencies']),
      // assignee: { value: taskData?.assignee?.map((a) => getId(a)) || [] },
      // attachments: { value: taskData?.attachments?.map((a) => getId(a)) || [] },
      // collaborators: { value: taskData?.collaborators?.map((a) => getId(a)) || [] },
      // tags: { value: taskData?.tags?.map((a) => getId(a)) || [] },
      // firm: { value: getId(taskData?.firm || '') },
      description: {
        value: {
          root: { children: [], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 },
        },
      },
    }
  }, [taskData?.id])

  if (!isOpen || !taskData?.id || !permissions?.collections?.tasks) return null

  const drawerStyle = {
    width: `${drawerWidth}px`,
    maxWidth: `${drawerWidth}px`,
  }
  return (
    <div className="relative z-40" style={drawerStyle}>
      <div
        className="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex flex-col border-0 border-l-[1px] border-solid border-border bg-[var(--theme-bg)] shadow-xl transition-all duration-300"
          style={drawerStyle}
        >
          <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
            <div className="mt-6 flex justify-end pr-[45px]">
              <button
                onClick={closeDrawer}
                className="cursor-pointer rounded-md border-none bg-none"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <div style={{ minWidth: `${drawerWidth}px` }} className="mr-[20px]">
              <DocumentInfoProvider
                apiURL={''}
                currentEditor={user as any}
                isLocked={false}
                id={taskData?.id}
                collectionSlug={'tasks'}
                hasPublishedDoc={true}
                versionCount={0}
                unpublishedVersionCount={0}
                initialData={taskData}
                initialState={data}
                mostRecentVersionIsAutosaved={false}
                docPermissions={permissions?.collections?.tasks}
                lastUpdateTime={new Date(taskData?.updatedAt).getTime()}
                hasSavePermission={permissions?.collections?.tasks?.update}
                hasPublishPermission={permissions?.collections?.tasks?.update}
              >
                {/* <TaskDrawerContent onSoftTaskUpdate={onSoftTaskUpdate} /> */}
                <DefaultEditView
                  formState={data}
                  documentSubViewType={{} as any}
                  viewType={{} as any}
                />
              </DocumentInfoProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

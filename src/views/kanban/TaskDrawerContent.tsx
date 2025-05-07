'use client'

import type { ClientCollectionConfig, FormState } from 'payload'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  DocumentControls,
  DocumentFields,
  Form,
  Gutter,
  OperationProvider,
  RenderTitle,
  SetDocumentTitle,
  useConfig,
  useDocumentInfo,
  useEditDepth,
  useServerFunctions,
} from '@payloadcms/ui'
import { abortAndIgnore, handleAbortRef } from '@payloadcms/ui/shared'
import { FormFieldsLoggerUtil } from '@/components/FormFieldsLoggerUtil'

const baseClass = 'collection-edit'

interface TaskDrawerContentProps {
  Description?: React.ReactNode
  PreviewButton?: React.ReactNode
  PublishButton?: React.ReactNode
  SaveButton?: React.ReactNode
  SaveDraftButton?: React.ReactNode
  Upload?: React.ReactNode
  onSoftTaskUpdate?: (
    taskId: string,
    updates: {
      name?: string
      completed?: boolean
      priority?: 'low' | 'medium' | 'high' | 'asap'
      assignee?: string[]
      // Can add more update fields as needed
    },
  ) => void
}

export function TaskDrawerContent({
  Description,
  PreviewButton,
  PublishButton,
  SaveButton,
  SaveDraftButton,
  Upload: CustomUpload,
  onSoftTaskUpdate,
}: TaskDrawerContentProps) {
  const {
    id,
    action,
    AfterDocument,
    AfterFields,
    apiURL,
    BeforeFields,
    collectionSlug,
    currentEditor,
    disableActions,
    disableCreate,
    docPermissions,
    getDocPreferences,
    hasPublishPermission,
    hasSavePermission,
    initialState,
    isEditing,
    isInitializing,
    redirectAfterDelete,
    redirectAfterDuplicate,
    savedDocumentData,
  } = useDocumentInfo()

  const { config, getEntityConfig } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug }) as ClientCollectionConfig | null

  const depth = useEditDepth()

  const { getFormState } = useServerFunctions()

  const abortOnChangeRef = useRef<AbortController>(null)
  const abortOnSaveRef = useRef<AbortController>(null)

  const entitySlug = collectionConfig?.slug

  const operation = collectionSlug && !id ? 'create' : 'update'

  const docConfig = collectionConfig
  const fields = useMemo(
    () =>
      docConfig?.fields.map((f: any) => {
        if (f.name === '_status') {
          return {
            ...f,
            hidden: true,
          }
        }
        return f
      }),
    [docConfig?.fields],
  )

  const [editSessionStartTime, setEditSessionStartTime] = useState(Date.now())

  const classes = [baseClass, id && `${baseClass}--is-editing`]

  if (collectionSlug) {
    classes.push(`collection-edit--${collectionSlug}`)
  }

  const schemaPathSegments = useMemo(() => [entitySlug], [entitySlug])

  const [validateBeforeSubmit, setValidateBeforeSubmit] = useState(() => {
    return operation === 'create'
  })

  const onChange: any = useCallback(
    async ({ formState: prevFormState, submitted }: any) => {
      // Handle soft updates for the Kanban board using the centralized API
      if (onSoftTaskUpdate && id) {
        const updates: any = {}

        // Check if name changed
        if (prevFormState?.name?.value !== undefined) {
          updates.name = prevFormState.name.value
        }

        // Check if completed status changed
        if (prevFormState?.completed?.value !== undefined) {
          updates.completed = prevFormState.completed.value
        }

        // Check if priority changed
        if (prevFormState?.priority?.value !== undefined) {
          updates.priority = prevFormState.priority.value
        }

        // Check if assignee changed
        if (prevFormState?.assignee?.value !== undefined) {
          updates.assignee = prevFormState.assignee.value
        }

        // Only call onSoftTaskUpdate if there are changes
        if (Object.keys(updates).length > 0) {
          onSoftTaskUpdate(id as string, updates)
        }
      }

      const controller = handleAbortRef(abortOnChangeRef as any)

      const currentTime = Date.now()
      const timeSinceLastUpdate = currentTime - editSessionStartTime

      const updateLastEdited = timeSinceLastUpdate >= 10000 // 10 seconds

      if (updateLastEdited) {
        setEditSessionStartTime(currentTime)
      }

      const docPreferences = await getDocPreferences()

      const { state } = await getFormState({
        id,
        collectionSlug,
        docPermissions,
        docPreferences,
        formState: prevFormState,

        operation,
        skipValidation: !submitted,
        // Performance optimization: Setting it to false ensure that only fields that have explicit requireRender set in the form state will be rendered (e.g. new array rows).
        // We only want to render ALL fields on initial render, not in onChange.
        renderAllFields: false,
        schemaPath: schemaPathSegments.join('.'),
        signal: controller.signal,
        updateLastEdited,
      })

      abortOnChangeRef.current = null

      return state
    },
    [
      id,
      collectionSlug,
      getDocPreferences,
      getFormState,
      operation,
      schemaPathSegments,
      docPermissions,
      editSessionStartTime,
      onSoftTaskUpdate,
    ],
  )

  useEffect(() => {
    const abortOnChange = abortOnChangeRef.current
    const abortOnSave = abortOnSaveRef.current

    return () => {
      abortAndIgnore(abortOnChange as any)
      abortAndIgnore(abortOnSave as any)
    }
  }, [])

  return (
    <div className={classes.filter(Boolean).join(' ')}>
      {/* <Gutter className={baseClass}>
        <RenderTitle className={`${baseClass}__title`} />
      </Gutter> */}

      <OperationProvider operation={operation}>
        <Form
          action={action}
          className={`${baseClass}__form`}
          disabled={isInitializing || !hasSavePermission}
          disableValidationOnSubmit={!validateBeforeSubmit}
          initialState={!isInitializing && (initialState as any)}
          isDocumentForm={true}
          isInitializing={isInitializing}
          method={id ? 'PATCH' : 'POST'}
          onChange={[onChange]}
        >
          {/* <FormFieldsLoggerUtil /> */}

          <SetDocumentTitle
            collectionConfig={collectionConfig!}
            config={config}
            fallback={depth <= 1 ? id?.toString() : (undefined as any)}
          />
          <DocumentControls
            apiURL={apiURL!}
            customComponents={{
              PreviewButton,
              PublishButton: null,
              SaveButton,
              SaveDraftButton,
            }}
            data={savedDocumentData}
            disableActions={disableActions}
            disableCreate={disableCreate}
            hasPublishPermission={hasPublishPermission}
            hasSavePermission={hasSavePermission}
            id={id}
            isEditing={isEditing}
            permissions={docPermissions!}
            redirectAfterDelete={redirectAfterDelete}
            redirectAfterDuplicate={redirectAfterDuplicate}
            slug={'tasks'}
            user={currentEditor}
          />
          <DocumentFields
            // AfterFields={AfterFields}
            BeforeFields={BeforeFields}
            Description={Description}
            docPermissions={docPermissions!}
            fields={fields as any[]}
            readOnly={!hasSavePermission}
            schemaPathSegments={schemaPathSegments as any}
            forceSidebarWrap={true}
          />
          {AfterDocument}
        </Form>
      </OperationProvider>
    </div>
  )
}

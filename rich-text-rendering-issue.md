# [BUG] Rich Text Fields Not Rendering in Custom Drawer but Work When Adding New Comments

## Issue Description

When using a custom task drawer implementation, rich text fields don't render properly when initially loaded but oddly work fine when adding new array elements that have a richtext field. This issue occurs despite using Payload's default components.

## Reproduction Steps

1. Navigate to `/admin/views/kanban`
2. Click the "Open Task Drawer" button to open a task drawer
3. Observe that the description field (rich text) doesn't render properly - no toolbar appears
4. Click "Add New" in the comments array section
5. Notice that the rich text field in the new comment renders correctly with toolbar

I've tried both the custom TaskDrawerContent component and Payload's DefaultEditView component, and both exhibit the same issue.

## Environment

- Payload CMS version: 3.33.0
- @payloadcms/richtext-lexical: 3.33.0
- @payloadcms/ui: 3.33.0
- NextJS: 15.3.0 (app router)
- React: 19.1.0
- Using a custom drawer component that builds on Payload's UI components

## Technical Details

### What Works

- Rich text fields render correctly in standard Payload admin UI
- Rich text rendering works in the custom drawer when **adding new comments to the comments array**

### What Doesn't Work

- Using Payload's `DefaultEditView` component directly doesn't solve the issue
- Initial rendering of rich text fields in the drawer context
- Using the default form state initialization doesn't help

### Relevant File Paths

- `/src/views/kanban/index.tsx` - Main Kanban view component
- `/src/views/kanban/TaskDrawer.tsx` - Custom drawer implementation
- `/src/views/kanban/TaskDrawerContent.tsx` - Our simplified version of DefaultEditView
- `/src/views/kanban/TaskDrawerProvider.tsx` - Context provider for the drawer
- `/src/views/kanban/TaskButton.tsx` - Button to open the drawer with example task
- `/src/collections/Tasks/index.ts` - Task collection definition with rich text fields
- `/src/app/(payload)/admin/importMap.js` - Import map for Lexical editor components

### Implementation Details

The issue is in our custom task drawer implementation in `/src/views/kanban/TaskDrawer.tsx`. We're using Payload's `DocumentInfoProvider` and trying both:

1. Our custom `TaskDrawerContent` component 
2. Payload's own `DefaultEditView` component

Both approaches have the same issue - rich text doesn't render initially, but works when adding new comments.

In `TaskDrawer.tsx`, we're switching between our component and Payload's default:

```typescript
<DocumentInfoProvider
  /* ... props ... */
>
  {/* Can use either our custom component or Payload's default */}
  {/* <TaskDrawerContent onSoftTaskUpdate={onSoftTaskUpdate} /> */}
  <DefaultEditView
    formState={data}
    documentSubViewType={{} as any}
    viewType={{} as any}
  />
</DocumentInfoProvider>
```

The rich text fields are properly configured in our Task collection `/src/collections/Tasks/index.ts`:

```typescript
{
  name: 'description',
  type: 'richText',
  editor: lexicalEditor({
    features: () => [
      AlignFeature(),
      BlockquoteFeature(),
      BoldFeature(),
      FixedToolbarFeature(),
      /* ... other features ... */
    ],
  }),
}
```

## Possible Causes

1. Issue with how the rich text data is initialized in the drawer context
2. Missing imports or client-side functionality for rich text rendering
3. Improper initialization of the Lexical editor in this context
4. Issues with how TaskDrawer passes data to children components

## Expected Behavior

Rich text fields should render properly in the custom drawer implementation, just like they do in the standard Payload admin UI and when adding new comments.

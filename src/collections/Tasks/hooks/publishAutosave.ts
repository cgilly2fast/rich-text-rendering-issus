import { CollectionBeforeOperationHook } from 'payload'

export const publishAutosave: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation === 'update' && args.autosave && args.draft) {
    args.draft = false
    args.autosave = false
  }
}

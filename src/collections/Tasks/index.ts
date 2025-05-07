import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import dayjs from 'dayjs'
import { CollectionConfig } from 'payload'
import { publishAutosave } from './hooks/publishAutosave'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    singular: 'Task',
    plural: 'Tasks',
  },
  hooks: {
    beforeOperation: [publishAutosave],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
  },
  admin: {
    useAsTitle: 'name',
    components: {
      edit: {
        PublishButton: {
          path: '@/components/NullComponent#NullComponent',
        },
      },
    },
  },
  fields: [
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        style: {
          width: '50%',
        },
      },
    },
    // {
    //   name: 'assignee',
    //   type: 'relationship',
    //   relationTo: 'users',
    //   hasMany: true,
    //   filterOptions: filterByFirm,
    //   admin: {
    //     style: {
    //       width: '50%',
    //     },
    //   },
    //   // Every assignee will have an entry in the projects for my tasks
    // },
    // {
    //   name: 'project',
    //   label: 'Case',
    //   type: 'relationship',
    //   relationTo: 'projects',
    //   filterOptions: filterByFirm,
    //   admin: {
    //     style: {
    //       width: '50%',
    //     },
    //   },
    // },
    {
      name: 'projectOrder',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        hidden: true,
        step: 1,
        style: {
          width: '50%',
        },
        // condition: () => false,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) return 0
            return value
          },
        ],
      },
    },
    {
      name: 'pipelines',
      type: 'array',
      admin: {
        hidden: true,
      },
      fields: [
        // {
        //   name: 'pipeline',
        //   type: 'relationship',
        //   relationTo: 'pipelines',
        //   // **PROBLEM should not need to comment out
        //   // filterOptions: filterByFirm,
        //   required: true,
        //   index: true,
        // },
        {
          name: 'stage',
          type: 'text',
          required: true,
          index: true,
          //need to override the UI on this one
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
            step: 1,
            // condition: () => false,
          },
          required: true,
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (!value) return 0
                return value
              },
            ],
          },
        },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'ASAP', value: 'asap' },
      ],
      defaultValue: 'medium',
      admin: {
        style: {
          width: '50%',
        },
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        style: {
          width: '50%',
        },
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          timeIntervals: 15,
        },
        style: {
          width: '50%',
        },
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        date: {
          timeIntervals: 15,
        },
        style: {
          width: '50%',
        },
      },
    },
    {
      name: 'dependencies',
      type: 'array',
      fields: [
        // {
        //   name: 'task',
        //   type: 'relationship',
        //   relationTo: 'tasks',
        //   // May need to refine more to limit to current project
        //   filterOptions: filterByFirm,
        //   required: true,
        // },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Blocking', value: 'blocking' },
            { label: 'Blocked by', value: 'blockedBy' },
          ],
          required: true,
          defaultValue: 'blockedBy',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: () => {
          return [
            AlignFeature(),
            BlockquoteFeature(),
            BoldFeature(),
            FixedToolbarFeature(),
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            HorizontalRuleFeature(),
            InlineCodeFeature(),
            InlineToolbarFeature(),
            ItalicFeature(),
            ParagraphFeature(),
            LinkFeature(),
            OrderedListFeature(),
            UnderlineFeature(),
            UnorderedListFeature(),
            StrikethroughFeature(),
            ChecklistFeature(),
            EXPERIMENTAL_TableFeature(),
          ]
        },
      }),
    },
    // {
    //   name: 'attachments',
    //   type: 'upload',
    //   relationTo: 'files',
    //   hasMany: true,
    //   filterOptions: filterByFirm,
    // },

    {
      type: 'row',
      fields: [
        // {
        //   name: 'collaborators',
        //   type: 'relationship',
        //   relationTo: 'users',
        //   hasMany: true,
        //   filterOptions: filterByFirm,
        // },
        // {
        //   name: 'tags',
        //   type: 'relationship',
        //   relationTo: 'tags',
        //   label: 'Tags',
        //   hasMany: true,
        //   filterOptions: filterByFirm,
        // },
      ],
    },
    {
      name: 'comments',
      type: 'array',
      label: 'Comments',
      fields: [
        {
          name: 'comment',
          type: 'richText',
          editor: lexicalEditor({
            features: () => {
              return [
                AlignFeature(),
                BlockquoteFeature(),
                BoldFeature(),
                FixedToolbarFeature(),
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                HorizontalRuleFeature(),
                InlineCodeFeature(),
                InlineToolbarFeature(),
                ItalicFeature(),
                ParagraphFeature(),
                LinkFeature(),
                OrderedListFeature(),
                UnderlineFeature(),
                UnorderedListFeature(),
                StrikethroughFeature(),
              ]
            },
          }),
          required: true,
        },
        {
          name: 'edited',
          type: 'checkbox',
          defaultValue: false,
          // remove when comment set up properly where default view of the comment is not the edit view
          hidden: true,
        },
        {
          type: 'row',
          fields: [
            // {
            //   name: 'author',
            //   type: 'relationship',
            //   relationTo: 'users',
            //   access: {
            //     update: () => false,
            //   },
            //   hooks: {
            //     beforeChange: [
            //       ({ operation, req: { user }, value, siblingData, previousSiblingDoc }) => {
            //         if (
            //           operation === 'create' ||
            //           previousSiblingDoc.comment !== siblingData.comment
            //         ) {
            //           return user?.id
            //         }

            //         return value
            //       },
            //     ],
            //   },
            //   admin: {
            //     condition: (_, siblingData) => !!siblingData.author,
            //   },
            //   filterOptions: filterByFirm,
            // },
            {
              name: 'createdAt',
              type: 'date',
              hooks: {
                beforeChange: [
                  ({ operation, req: { user }, siblingData, previousSiblingDoc, value }) => {
                    if (
                      operation === 'create' ||
                      previousSiblingDoc.comment !== siblingData.comment
                    ) {
                      return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                    }
                    return value
                  },
                ],
              },
              admin: {
                condition: (_, siblingData) => !!siblingData.createdAt,
              },
            },
          ],
        },
      ],
    },
  ],
}

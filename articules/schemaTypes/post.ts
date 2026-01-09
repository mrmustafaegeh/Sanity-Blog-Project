import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),

    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Pending Review', value: 'pending'},
          {title: 'Published', value: 'published'},
          {title: 'Rejected', value: 'rejected'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'rejectionReason',
      title: 'Rejection Reason',
      type: 'text',
      hidden: ({document}) => document?.status !== 'rejected',
      description: 'Will be shown to the author',
    }),

    defineField({
      name: 'isUserSubmission',
      title: 'User Submission',
      type: 'boolean',
      initialValue: false,
      description: 'Mark if this is a user-submitted post',
      readOnly: true,
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      hidden: ({document}) => document?.status !== 'published',
    }),

    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
      initialValue: new Date().toISOString(),
    }),

    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(60),
    }),

    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      readOnly: true,
      description: 'Automatically generated AI summary',
    }),

    defineField({
      name: 'aiStatus',
      title: 'AI Status',
      type: 'string',
      readOnly: true,
      initialValue: 'pending',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Completed', value: 'completed'},
          {title: 'Failed', value: 'failed'},
          {title: 'Skipped', value: 'skipped'},
        ],
      },
    }),

    defineField({
      name: 'aiSummaryHistory',
      title: 'AI Summary History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'summary', type: 'text'},
            {name: 'createdAt', type: 'datetime'},
          ],
        },
      ],
      readOnly: true,
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],

  orderings: [
    {
      title: 'Submitted Date, New',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      status: 'status',
      media: 'mainImage',
      submittedAt: 'submittedAt',
    },
    prepare(selection) {
      const {title, author, status, submittedAt} = selection
      const statusColors = {
        draft: 'gray',
        pending: 'yellow',
        published: 'green',
        rejected: 'red',
      }

      return {
        title,
        subtitle: `${status.charAt(0).toUpperCase() + status.slice(1)} • by ${author || 'Anonymous'}`,
        media: selection.media,
      }
    },
  },
})

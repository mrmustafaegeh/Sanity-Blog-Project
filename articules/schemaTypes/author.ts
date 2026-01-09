import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'user',
      options: {
        list: [
          {title: 'User', value: 'user'},
          {title: 'Admin', value: 'admin'},
          {title: 'Editor', value: 'editor'},
        ],
      },
      hidden: ({currentUser}) => !currentUser?.roles?.includes('administrator'),
    }),

    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
    }),

    defineField({
      name: 'isVerified',
      title: 'Verified Account',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as verified contributor',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      role: 'role',
      media: 'image',
    },
    prepare(selection) {
      const {title, subtitle, role} = selection
      return {
        title,
        subtitle: `${subtitle} • ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        media: selection.media,
      }
    },
  },
})

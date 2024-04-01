import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'Comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'userimage',
      title: 'Image',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'array',
      of: [{type: 'string'}],
      readOnly: true,
    }),
    defineField({
      name: 'replies',
      title: 'Replies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'Comment'}]}],
    }),
    // defineField({
    //   name: 'parentComment',
    //   title: 'Parent Comment',
    //   type: 'reference',
    //   to: [{type: 'Comment'}],
    // }),
    defineField({
      name: 'post',
      type: 'reference',
      to: [{type: 'post'}],
    }),
  ],
  initialValue: {
    likes: [],
    replies: [],
  },
});

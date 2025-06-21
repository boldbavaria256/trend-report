// In schemaTypes/article.js

export default {
    name: 'article',
    title: 'Article',
    type: 'document',
    fields: [
        
      // ... (title, slug, mainImage fields remain the same) ...
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => Rule.required().error('A title is required for the article.'),
      },
      {
        name: 'slug',
        title: 'Slug (URL Segment)',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
        validation: Rule => Rule.required().error('A slug is required. Generate it from the title.'),
      },
      {
        name: 'mainImage',
        title: 'Main image',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text (for accessibility)',
            description: 'Important for SEO and accessiblity. Describe the image.',
            validation: Rule => Rule.required().error('Alt text is required for the main image.'),
          },
        ],
      },
      {
        name: 'publishedAt',
        title: 'Published at',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
        validation: Rule => Rule.required().error('Publication date is required.'),
      },
      {
        name: 'categories',
        title: 'Categories',
        type: 'array',     // Because an article can have multiple categories
        of: [             // Defines what type of items can be in this array
          {
            type: 'reference', // This item is a reference to another document
            to: [{type: 'category'}] // And it references documents of type 'category'
          }
        ],
        description: 'Select one or more categories for this article.',
        validation: Rule => Rule.min(1).error('Please select at least one category for the article.'), // Optional: make at least one category required
      },
      {
        name: 'excerpt',
        title: 'Excerpt / Teaser',
        type: 'text',
        rows: 3,
        description: 'A short summary of the article for previews and SEO.',
        // Corrected validation:
        validation: Rule => Rule.max(500).error('Excerpt cannot be more than 200 characters. Shorter excerpts are often better for previews.')
      },
      {
        name: 'body',
        title: 'Body',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              {title: 'Normal', value: 'normal'},
              {title: 'H2', value: 'h2'},
              {title: 'H3', value: 'h3'},
              {title: 'H4', value: 'h4'},
              {title: 'Quote', value: 'blockquote'},
            ],
            lists: [
              {title: 'Bullet', value: 'bullet'},
              {title: 'Numbered', value: 'number'},
            ],
            marks: {
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'},
                {title: 'Underline', value: 'underline'},
                {title: 'Strike-through', value: 'strike-through'}
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'URL',
                  fields: [
                    {
                      title: 'URL',
                      name: 'href',
                      type: 'url',
                      validation: Rule => Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel']
                      })
                    }
                  ]
                },
              ]
            },
          },
          {
            type: 'image',
            options: {hotspot: true},
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative text',
                validation: Rule => Rule.required().error('Alt text is required for inline images.'),
              },
              {
                name: 'caption',
                type: 'string',
                title: 'Caption',
              }
            ]
          },
        ],
        validation: Rule => Rule.required().error('The article body cannot be empty.'),
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'publishedAt',
        media: 'mainImage',
      },
      prepare(selection) {
        const {title, subtitle, media} = selection
        return {
          title: title,
          subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date set',
          media: media
        }
      }
    }
  }
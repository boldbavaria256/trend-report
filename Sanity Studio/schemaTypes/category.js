// In schemaTypes/category.js

export default {
    name: 'category', // Unique name for this document type
    title: 'Category', // Human-readable title in the Studio
    type: 'document',  // It's a top-level document type
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        description: 'The name of the category (e.g., Technology, Lifestyle)',
        validation: Rule => Rule.required().error('Category title cannot be empty.'),
      },
      {
        name: 'slug',
        title: 'Slug (URL Segment)',
        type: 'slug',
        options: {
          source: 'title', // Auto-generate from the title field
          maxLength: 96,
        },
        validation: Rule => Rule.required().error('Category slug is required.'),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text', // For a potentially longer description
        description: 'Optional: A brief description of what this category is about.',
      },
    ],
    // Optional: Define how documents of this type are previewed
    preview: {
      select: {
        title: 'title',
        subtitle: 'description', // Show description as subtitle in list view
      }
    }
  }
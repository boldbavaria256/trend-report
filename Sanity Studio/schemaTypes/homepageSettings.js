// In schemaTypes/homepageSettings.js

export default {
    name: 'homepageSettings',
    title: 'Homepage Settings', // What users see
    type: 'document',
    // Optional: Add an icon for the Sanity Studio (requires an icon plugin or an emoji)
    // icon: () => '🏠', // Example using an emoji as an icon
    fields: [
      {
        name: 'title', // Just a descriptive title for this settings document
        title: 'Internal Title',
        type: 'string',
        description: 'A descriptive title for these settings in the CMS (e.g., "Homepage Configuration").',
        initialValue: 'Homepage Configuration',
        readOnly: true, // Often, the title for a singleton is fixed
      },
      {
        name: 'heroArticle',
        title: 'Hero Article',
        type: 'reference',
        to: [{type: 'article'}], // This references a single document of type 'article'
        description: 'Select the main article to feature prominently on the homepage.',
        validation: Rule => Rule.required().error('A hero article must be selected for the homepage.'),
      },
      // You can add more homepage-specific settings here in the future, e.g.:
      // {
      //   name: 'welcomeMessage',
      //   title: 'Homepage Welcome Message',
      //   type: 'text',
      // },
    ],
    // We don't usually need a complex preview for singletons as there's only one
    preview: {
      select: {
        title: 'title',
        hero: 'heroArticle.title' // Show the title of the selected hero article
      },
      prepare(selection) {
        const {title, hero} = selection
        return {
          title: title || 'Homepage Settings',
          subtitle: hero ? `Hero: ${hero}` : 'No hero article selected'
        }
      }
    }
  }
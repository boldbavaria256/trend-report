import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { Iframe } from 'sanity-plugin-iframe-pane'
import { schemaTypes } from './schemaTypes'

// Define our custom desk structure
const myStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Our Singleton 'Homepage Settings'
      S.listItem()
        .title('Homepage Settings')
        .child(
          S.document()
            .schemaType('homepageSettings')
            .documentId('homepageSettings')
            .title('Edit Homepage Settings')
            .views([
              S.view.form(),
              S.view
                .component(Iframe)
                .options({
                  url: 'http://localhost:3000', // Replace with your deployed URL in production
                  reload: {
                    button: true,
                  },
                })
                .title('Preview'),
            ])
        ),
      S.divider(),
      // List out the rest of our document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['homepageSettings', 'media.tag'].includes(listItem.getId())
      ),
    ])

export default defineConfig({
  name: 'default',
  title: 'The Trend Report',

  projectId: '1u4o2o1r',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: myStructure,
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'article') {
          return S.document().views([
            S.view.form(),
            S.view
              .component(Iframe)
              .options({
                // Dynamic URL for articles
                url: (doc) => `http://localhost:3000/articles/${doc?.slug?.current}`,
                reload: { button: true },
              })
              .title('Preview'),
          ])
        }
        return S.document().views([S.view.form()])
      },
    }),
    visionTool(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
})

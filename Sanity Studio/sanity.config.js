import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Define our custom desk structure
const myStructure = (S) => // S is the Structure Builder
  S.list()
    .title('Content')
    .items([
      // Our Singleton 'Homepage Settings'
      S.listItem()
        .title('Homepage Settings')
        // .icon(() => '🏠') // Optional: if you want an icon
        .child(
          S.document()
            .schemaType('homepageSettings') // The schema type name
            .documentId('homepageSettings') // A UNIQUE, FIXED ID for this singleton document
            .title('Edit Homepage Settings') // Title when editing the document
        ),
      // Add a visual divider (optional)
      S.divider(),
      // List out the rest of our document types, excluding the singleton
      // as it's already handled above.
      ...S.documentTypeListItems().filter(
        (listItem) => !['homepageSettings'].includes(listItem.getId())
      ),
    ])


export default defineConfig({
  name: 'default',
  title: 'The Trend Report',

  projectId: '1u4o2o1r',
  dataset: 'production',

  plugins: [structureTool({structure: myStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

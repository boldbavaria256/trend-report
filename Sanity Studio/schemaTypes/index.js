// In schemaTypes/index.js

import article from './article' // Import our new article schema
import category from './category' // Import the category schema
import homepageSettings from './homepageSettings'
import subscription from './subscription'

export const schemaTypes = [article, category, homepageSettings, subscription] // Add it to an array of schema types
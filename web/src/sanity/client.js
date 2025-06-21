// web/src/sanity/client.js

import {createClient} from '@sanity/client'
// Import imageUrlBuilder if you're using @next-sanity/image or a similar library
import imageUrlBuilder from '@sanity/image-url'

// --- 1. Read Project ID and Dataset from environment variables ---
// It's good practice to store these in environment variables,
// especially if your dataset is private. For now, we can hardcode them
// for simplicity, but we'll discuss .env files soon.

const projectId = '1u4o2o1r' // Replace with your actual project ID
const dataset = 'production' // Replace with your actual dataset name (e.g., 'production')
const apiVersion = '2025-05-07' // Use a YYYY-MM-DD format for the API version. Choose today's date or a recent one.

// --- 2. Create the Sanity client ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster responses
  // token: process.env.SANITY_API_TOKEN, // Only if you need to write data or fetch private datasets
  // perspective: 'published', // Or 'raw' or 'previewDrafts'
})

// --- 3. Helper for generating image URLs with Sanity ---
// If you're using @next-sanity/image, this builder is often handled by that library's components.
// However, having it here can be useful for custom image URL generation if needed.
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// --- Optional: Example of a function to fetch data ---
// You can create helper functions here to encapsulate your GROQ queries
// export async function getSomeData() {
//   const data = await client.fetch('*[_type == "someType"]');
//   return data;
// }
import client from "../lib/client";

export const getAllPosts = () =>
  client.fetch(`*[_type=="post"]|order(publishedAt desc){
    title, slug, excerpt, aiSummary, publishedAt,
    author->{name},
    mainImage{asset->{url}}
  }`);

// Fetch single post by slug
/**
 * Returns: null | post object
 */
export async function getPostBySlug(slug) {
  if (!slug) {
    throw new Error("Slug is required");
  }

  try {
    const query = `
        *[_type == "post" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          publishedAt,
          aiSummary,
          body,
          mainImage{
            asset->{url},
            alt
          },
          author->{
            name
          },
          categories[]->{
            title,
            slug
          },
          readingTime,
          difficulty
        }
      `;

    const post = await client.fetch(query, { slug });

    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error("getPostBySlug error:", error);
    throw error;
  }
}

export const getPostsByCategory = (category) =>
  client.fetch(
    `*[_type=="post" && references($category)] | order(publishedAt desc){
    title, slug, excerpt, aiSummary, publishedAt,
    author->{name},
    mainImage{asset->{url}}
  }`,
    { category }
  );

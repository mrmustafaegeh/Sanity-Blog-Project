import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Generate AI summary for content
 * @param {string} content - Content to summarize
 * @returns {Promise<string>} AI-generated summary
 */
export const generateSummary = async (content) => {
  try {
    // If no OpenAI API key, return a simple summary
    if (!openai || !process.env.OPENAI_API_KEY) {
      return generateFallbackSummary(content);
    }

    // Truncate content if too long
    const truncatedContent =
      content.length > 4000 ? content.substring(0, 4000) + "..." : content;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes blog posts. Provide a concise 2-3 sentence summary that captures the main points.",
        },
        {
          role: "user",
          content: `Please summarize this blog post content:\n\n${truncatedContent}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      generateFallbackSummary(content)
    );
  } catch (error) {
    console.error("AI Summary Error:", error.message);
    return generateFallbackSummary(content);
  }
};

/**
 * Generate a fallback summary when AI is not available
 * @param {string} content - Content to summarize
 * @returns {string} Simple summary
 */
const generateFallbackSummary = (content) => {
  if (!content) return "";

  // Take first 150 characters as summary
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= 150) {
    return plainText;
  }

  // Find a good cutoff point
  const summary = plainText.substring(0, 150);
  const lastSpace = summary.lastIndexOf(" ");

  if (lastSpace > 100) {
    return summary.substring(0, lastSpace) + "...";
  }

  return summary + "...";
};

export default generateSummary;

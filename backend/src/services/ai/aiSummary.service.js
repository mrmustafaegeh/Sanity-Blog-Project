import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Summarize the following blog post clearly and concisely.",
      },
      {
        role: "user",
        content: text.slice(0, 6000),
      },
    ],
  });

  return response.choices[0].message.content;
}

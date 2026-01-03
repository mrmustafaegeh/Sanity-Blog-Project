export default function extractText(body = []) {
  return body
    .filter((b) => b._type === "block")
    .map((b) => b.children?.map((c) => c.text).join(" "))
    .join("\n");
}

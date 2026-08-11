export function splitText(
  text: string,
  maxLength = 500
): string[] {
  const sentences =
    text.match(/[^.!?]+[.!?]+/g) ?? [text];

  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLength) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  return chunks;
}
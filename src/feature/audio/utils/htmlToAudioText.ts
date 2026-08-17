/**
 * Convierte texto HTML en chunks pequeños optimizados para TTS.
 *
 * Los chunks se dividen por:
 * - Bloques HTML
 * - Oraciones
 * - Límite máximo de caracteres
 *
 * Las comas y paréntesis NO generan cortes.
 */
export function htmlToAudioText(html: string): string[] {
  if (!html) return [];

  const MAX_CHUNK_LENGTH = 80;

  const text = html
    .replace(/<\/(p|div|h[1-6]|ul|ol)>/gi, '\n\n') // Fin de bloques HTML
    .replace(/<br\s*\/?>/gi, '\n')                 // Saltos de línea
    .replace(/<li[^>]*>/gi, '\n• ')                // Inicio de lista
    .replace(/<\/li>/gi, '\n')                     // Fin de lista
    .replace(/<[^>]+>/g, '')                       // Eliminar resto de tags HTML
    .replace(/&nbsp;/g, ' ')                       // Decodificar entidades
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const finalChunks: string[] = [];

  const blocks = text.split(/\n{2,}/);

  for (let block of blocks) {
    block = block.replace(/^[ \t]+|[ \t]+$/gm, '').trim();

    if (!block) continue;

    const sentences = block.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [block];

    for (let sentence of sentences) {
      sentence = sentence
        .replace(/\s+,/g, ',')
        .replace(/\s+\./g, '.')
        .replace(/\s+;/g, ';')
        .replace(/\s+:/g, ':')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      if (sentence.length <= 1) continue;

      while (sentence.length > MAX_CHUNK_LENGTH) {
        let cutIndex = sentence.lastIndexOf(' ', MAX_CHUNK_LENGTH);

        if (cutIndex <= 0) {
          cutIndex = MAX_CHUNK_LENGTH;
        }

        const chunk = sentence.slice(0, cutIndex).trim();
        if (chunk.length > 1) {
          finalChunks.push(chunk);
        }

        sentence = sentence.slice(cutIndex).trim();
      }

      if (sentence.length > 1) {
        finalChunks.push(sentence);
      }
    }
  }

  return finalChunks;
}
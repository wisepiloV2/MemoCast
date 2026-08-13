/**
 * Convierte texto HTML a un Array de chunks optimizados para TTS.
 *
 * Los chunks se dividen principalmente por:
 * - Bloques HTML
 * - Oraciones
 *
 * Las comas y los paréntesis NO generan chunks nuevos.
 * Se conservan dentro de la oración para que Piper pueda
 * interpretar naturalmente las pausas.
 */
export function htmlToAudioChunks(html: string): string[] {
  if (!html) return [];

  let text = html;

  const CHUNK_MARKER = '|||CUT|||';

  // ============================================================
  // 1. MARCAR FIN DE BLOQUES HTML
  // ============================================================

  text = text.replace(
    /<\/(p|div|h[1-6]|ul|ol)>/gi,
    `\n\n${CHUNK_MARKER}`,
  );

  // ============================================================
  // 2. SALTOS DE LÍNEA
  // ============================================================

  text = text.replace(/<br\s*\/?>/gi, '\n');

  // ============================================================
  // 3. LISTAS
  // ============================================================

  text = text.replace(/<li[^>]*>/gi, '\n• ');
  text = text.replace(/<\/li>/gi, '\n');

  // ============================================================
  // 4. ELIMINAR HTML
  // ============================================================

  text = text.replace(/<[^>]+>/g, '');

  // ============================================================
  // 5. DECODIFICAR ENTIDADES HTML
  // ============================================================

  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'');

  // ============================================================
  // 6. DIVIDIR POR BLOQUES HTML
  // ============================================================

  const blockChunks = text.split(CHUNK_MARKER);

  const finalChunks: string[] = [];

  blockChunks.forEach((block) => {
    // ----------------------------------------------------------
    // Normalizar espacios
    // ----------------------------------------------------------

    let cleaned = block;

    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    cleaned = cleaned.replace(
      /^[ \t]+|[ \t]+$/gm,
      '',
    );

    cleaned = cleaned.trim();

    if (!cleaned) return;

    // ----------------------------------------------------------
    // Dividir por oraciones
    //
    // IMPORTANTE:
    // Las comas y paréntesis NO cortan la oración.
    // ----------------------------------------------------------

    const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [cleaned];

    sentences.forEach((sentence) => {
      let cleanSentence = sentence.trim();

      if (cleanSentence.length <= 1) {
        return;
      }

      // --------------------------------------------------------
      // Normalizar espacios alrededor de puntuación
      // --------------------------------------------------------

      cleanSentence = cleanSentence
        // Espacios antes de coma
        .replace(/\s+,/g, ',')

        // Espacios antes de punto
        .replace(/\s+\./g, '.')

        // Espacios antes de punto y coma
        .replace(/\s+;/g, ';')

        // Espacios antes de dos puntos
        .replace(/\s+:/g, ':')

        // Espacios después de "("
        .replace(/\(\s+/g, '(')

        // Espacios antes de ")"
        .replace(/\s+\)/g, ')')

        // Múltiples espacios
        .replace(/[ \t]{2,}/g, ' ')

        .trim();

      if (cleanSentence.length > 1) {
        finalChunks.push(cleanSentence);
      }
    });
  });

  return finalChunks;
}

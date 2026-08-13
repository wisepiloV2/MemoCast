/**
 * Convierte texto HTML a un Array de chunks optimizados para un bot de audio en cola.
 * @param html El texto HTML original.
 * @returns Array de strings, donde cada elemento es un fragmento (chunk) listo para el TTS.
 */
export function htmlToAudioChunks(html: string): string[] {
  if (!html) return [];

  let text = html;
  
  // Usamos un marcador temporal único que no aparecerá en textos normales
  const CHUNK_MARKER = '|||CUT|||';

  // 1. Marcar los cortes al final de bloques lógicos (p, div, títulos, y listas completas)
  
  // Al agregar el marcador aquí, aseguramos que el corte tenga sentido semántico
  text = text.replace(/<\/(p|div|h[1-6]|ul|ol)>/gi, `\n\n${CHUNK_MARKER}`);
  
  // 2. Manejar saltos de línea explícitos
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // 3. Formatear listas (toda la lista se mantendrá en un solo chunk)
  text = text.replace(/<li[^>]*>/gi, '\n• ');
  text = text.replace(/<\/li>/gi, '\n');

  // 4. Eliminar cualquier otra etiqueta HTML restante
  text = text.replace(/<[^>]+>/g, '');

  // 5. Decodificar entidades HTML neutrales al idioma
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&') 
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'');

  // 6. Dividir el texto gigante en bloques usando el marcador HTML
  const blockChunks = text.split(CHUNK_MARKER);

  const finalChunks: string[] = [];

  // 7. Limpiar cada bloque y SUB-DIVIDIR en oraciones 
  blockChunks.forEach(block => {
    let cleaned = block.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.replace(/^[ \t]+|[ \t]+$/gm, '');
    cleaned = cleaned.trim();

    if (cleaned.length === 0) return;

    const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [cleaned];

    sentences.forEach(sentence => {
      const cleanSentence = sentence.trim();
      
      if (cleanSentence.length > 1) {
        finalChunks.push(cleanSentence);
      }
    });
  });

  return finalChunks;
}

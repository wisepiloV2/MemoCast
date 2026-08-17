interface GenerateAudioParams {
  htmlContent: string;
  voiceId: string;
  documentId: number;
  startTask: (name: string, data?: unknown) => void;
}

export function generateAudio({ htmlContent, voiceId, documentId, startTask }: GenerateAudioParams) {
  if (!htmlContent || !voiceId) { return }

  startTask("Generate audio", {
    documentId,
    text: htmlContent,
    voiceId,
  });
}
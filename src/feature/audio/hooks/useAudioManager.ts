import { useTask } from "../../task/hooks/useTask";

export function useAudioManager() {
  const { startTask } = useTask();

  const generateAudio = ( documentId: string, text: string, voiceId: string ) => {
    startTask("Generating audio", {
      documentId,
      text,
      voiceId,
    });
  };

  return {
    generateAudio,
  };
}
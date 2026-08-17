import * as tts from "@realtimex/piper-tts-web";

interface GenerateMessage {
  type: "generate";
  text: string;
  voiceId: string;
}

interface WorkerMessage {
  type: "success";
  buffer: ArrayBuffer;
}

interface WorkerError {
  type: "error";
  error: string;
}

const postWorkerMessage = (message: WorkerMessage | WorkerError, transfer?: ArrayBuffer[]) => {
  (self.postMessage as unknown as (message: WorkerMessage | WorkerError, transfer?: ArrayBuffer[]) => void)(
    message,
    transfer
  );
};

self.onmessage = async (event: MessageEvent<GenerateMessage>) => {
  if (event.data.type !== "generate") { return }

  const { text, voiceId } = event.data;

  try {
    const blob = await tts.predict({
      text,
      voiceId,
    });

    const buffer = await blob.arrayBuffer();

    postWorkerMessage({ type: "success", buffer }, [buffer]);
  } catch (error) {
    postWorkerMessage({
      type: "error",
      error: error instanceof Error ? error.message : "Error generating audio",
    });
  }
};
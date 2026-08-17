import * as tts from "@realtimex/piper-tts-web";

export async function getInstalledVoiceIds(): Promise<string[]> {
  return await tts.stored();
}

export async function downloadVoice(id: string): Promise<void> {
  await tts.download(id);
}

export async function deleteVoice(id: string): Promise<void> {
  await tts.remove(id);
}

export async function deleteAllVoices(): Promise<void> {
  await tts.flush();
}
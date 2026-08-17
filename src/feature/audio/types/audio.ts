export interface AudioTaskData {
  documentId: number;
  text: string;
  voiceId: string;
}

export interface AudioTaskResult {
  audio: Blob;
}

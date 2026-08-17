import type { ExecuteTask, Task } from '../../task/context/TaskContext';
import { htmlToAudioText } from '../utils/htmlToAudioText';
import { mergeWavBuffers } from '../utils/wav';
import { audioService } from '../services/audioService';
import type { AudioTaskData } from '../types/audio';

export const executeAudioTask: ExecuteTask = (task: Task, onProgress) => {
  return new Promise<void>((resolve, reject) => {
    const data = task.data as AudioTaskData;
    const chunks = htmlToAudioText(data.text);

    if (chunks.length === 0) {
      reject(new Error('No text to convert'));
      return;
    }

    const worker = new Worker(
      new URL('../workers/piper.worker.ts', import.meta.url),
      { type: 'module' }
    );

    const audioBuffers: ArrayBuffer[] = [];
    let currentChunk = 0;

    const cleanup = () => {
      worker.terminate();
    };

    const finish = async () => {
      try {
        const finalBlob = mergeWavBuffers(audioBuffers);

        await audioService.save({ idDocument: data.documentId, audio: finalBlob });

        cleanup();
        resolve();
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    const generateNextChunk = () => {
      if (currentChunk >= chunks.length) {
        finish();
        return;
      }

      const chunk = chunks[currentChunk];

      worker.postMessage({
        type: 'generate',
        text: chunk,
        voiceId: data.voiceId,
      });
    };

    worker.onmessage = (event) => {
      if (event.data.type === 'error') {
        cleanup();
        reject(new Error(event.data.error));
        return;
      }

      if (event.data.type !== 'success') {
        return;
      }

      const buffer = event.data.buffer as ArrayBuffer;
      audioBuffers.push(buffer);
      currentChunk++;

      const progress = Math.round((currentChunk / chunks.length) * 100);
      onProgress(progress);

      generateNextChunk();
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      cleanup();
      reject(error);
    };

    generateNextChunk();
  });
};
interface WavInfo {
  sampleRate: number;
  numChannels: number;
  bitsPerSample: number;
  pcm: ArrayBuffer;
}

function readUint16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function findChunk(view: DataView, chunkId: string): number {
  for (let i = 12; i < view.byteLength - 8;) {
    const id = String.fromCharCode(
      view.getUint8(i),
      view.getUint8(i + 1),
      view.getUint8(i + 2),
      view.getUint8(i + 3)
    );
    const size = readUint32(view, i + 4);

    if (id === chunkId) {
      return i;
    }

    i += 8 + size;
  }
  return -1;
}

function parseWav(buffer: ArrayBuffer): WavInfo {
  const view = new DataView(buffer);
  const fmtOffset = findChunk(view, "fmt ");
  const dataOffset = findChunk(view, "data");

  if (fmtOffset === -1 || dataOffset === -1) {
    throw new Error("WAV inválido");
  }

  const numChannels = readUint16(view, fmtOffset + 10);
  const sampleRate = readUint32(view, fmtOffset + 12);
  const bitsPerSample = readUint16(view, fmtOffset + 22);
  const dataSize = readUint32(view, dataOffset + 4);
  const pcmStart = dataOffset + 8;

  return {
    sampleRate,
    numChannels,
    bitsPerSample,
    pcm: buffer.slice(pcmStart, pcmStart + dataSize),
  };
}

function createWav(
  pcm: ArrayBuffer,
  sampleRate: number,
  numChannels: number,
  bitsPerSample: number
): ArrayBuffer {
  const bytesPerSample = bitsPerSample / 8;
  const byteRate = sampleRate * numChannels * bytesPerSample;
  const blockAlign = numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcm.byteLength, true);

  // WAVE format
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);          // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);           // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcm.byteLength, true);

  // Write PCM audio data
  new Uint8Array(buffer, 44).set(new Uint8Array(pcm));

  return buffer;
}

export function mergeWavBuffers(buffers: ArrayBuffer[]): Blob {
  if (buffers.length === 0) {
    throw new Error("No audio buffers to merge");
  }

  const wavs = buffers.map(parseWav);
  const first = wavs[0];

  for (const wav of wavs) {
    if (
      wav.sampleRate !== first.sampleRate ||
      wav.numChannels !== first.numChannels ||
      wav.bitsPerSample !== first.bitsPerSample
    ) {
      throw new Error("Incompatible WAV formats");
    }
  }

  const totalSize = wavs.reduce((total, wav) => total + wav.pcm.byteLength, 0);
  const mergedPcm = new Uint8Array(totalSize);

  let offset = 0;
  for (const wav of wavs) {
    mergedPcm.set(new Uint8Array(wav.pcm), offset);
    offset += wav.pcm.byteLength;
  }

  const wavBuffer = createWav(
    mergedPcm.buffer,
    first.sampleRate,
    first.numChannels,
    first.bitsPerSample
  );

  return new Blob([wavBuffer], { type: "audio/wav" });
}
'use server';

/**
 * @fileOverview A flow for synthesizing a song from lyrics in a specified voice style.
 *
 * - synthesizeSong - A function that handles the song synthesis process.
 * - SynthesizeSongInput - The input type for the synthesizeSong function.
 * - SynthesizeSongOutput - The return type for the synthesizeSong function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const SynthesizeSongInputSchema = z.object({
  lyrics: z.string().describe('The Malayalam lyrics of the song to synthesize.'),
  voiceStyle: z
    .enum([
      'MaleBass',
      'MaleTenor',
      'MaleSoft',
      'FemaleSoprano',
      'FemaleAlto',
      'FemaleMelodic',
      'Childlike',
      'Robotic',
      'Cartoon',
    ])
    .describe("The desired voice style for the synthesized song.  Must be one of 'MaleBass', 'MaleTenor', 'MaleSoft', 'FemaleSoprano', 'FemaleAlto', 'FemaleMelodic', 'Childlike', 'Robotic', or 'Cartoon'."),
});
export type SynthesizeSongInput = z.infer<typeof SynthesizeSongInputSchema>;

const SynthesizeSongOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe("The synthesized song as a data URI in WAV format.  Can be directly played in an <audio> tag."),
});
export type SynthesizeSongOutput = z.infer<typeof SynthesizeSongOutputSchema>;

export async function synthesizeSong(input: SynthesizeSongInput): Promise<SynthesizeSongOutput> {
  return synthesizeSongFlow(input);
}

const voiceMap: {[key: string]: string} = {
  MaleBass: 'Algenib',
  MaleTenor: 'Acamar',
  MaleSoft: 'Polaris',
  FemaleSoprano: 'Hadar',
  FemaleAlto: 'Gienah',
  FemaleMelodic: 'Betria',
  Childlike: 'Vega',
  Robotic: 'Pollux',
  Cartoon: 'Spica',
};

const synthesizeSongFlow = ai.defineFlow(
  {
    name: 'synthesizeSongFlow',
    inputSchema: SynthesizeSongInputSchema,
    outputSchema: SynthesizeSongOutputSchema,
  },
  async input => {
    const voiceName = voiceMap[input.voiceStyle];
    if (!voiceName) {
      throw new Error(`Unknown voice style: ${input.voiceStyle}`);
    }

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: voiceName},
          },
        },
      },
      prompt: input.lyrics,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


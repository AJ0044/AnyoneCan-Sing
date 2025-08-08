
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
      'alnilam',
      'charon',
      'aoede',
      'achird',
    ])
    .describe("The desired voice style for the synthesized song."),
  makeDuet: z.boolean().optional().describe("Whether to leave silent gaps in the audio for a duet."),
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

const synthesizeSongFlow = ai.defineFlow(
  {
    name: 'synthesizeSongFlow',
    inputSchema: SynthesizeSongInputSchema,
    outputSchema: SynthesizeSongOutputSchema,
  },
  async input => {
    let promptText = input.lyrics;
    let voiceName: string = input.voiceStyle;

    if (input.makeDuet) {
        // Add SSML breaks between lines to create pauses for the duet
        const lines = input.lyrics.split('\n').filter(line => line.trim() !== '');
        const ssmlLines = lines.map(line => `<p>${line}</p><break time="2s"/>`);
        promptText = `<speak>${ssmlLines.join('')}</speak>`;
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
      prompt: promptText,
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

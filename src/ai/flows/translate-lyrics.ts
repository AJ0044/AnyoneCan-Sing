'use server';
/**
 * @fileOverview A flow to translate English song lyrics to Malayalam.
 *
 * - translateLyrics - A function that handles the translation process.
 * - TranslateLyricsInput - The input type for the translateLyrics function.
 * - TranslateLyricsOutput - The return type for the translateLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateLyricsInputSchema = z.object({
  englishLyrics: z.string().describe('The English song lyrics to translate.'),
});
export type TranslateLyricsInput = z.infer<typeof TranslateLyricsInputSchema>;

const TranslateLyricsOutputSchema = z.object({
  malayalamLyrics: z.string().describe('The translated Malayalam song lyrics.'),
});
export type TranslateLyricsOutput = z.infer<typeof TranslateLyricsOutputSchema>;

export async function translateLyrics(input: TranslateLyricsInput): Promise<TranslateLyricsOutput> {
  return translateLyricsFlow(input);
}

const translateLyricsPrompt = ai.definePrompt({
  name: 'translateLyricsPrompt',
  input: {schema: TranslateLyricsInputSchema},
  output: {schema: TranslateLyricsOutputSchema},
  prompt: `Translate the following English song lyrics to Malayalam:\n\n{{englishLyrics}}`,
});

const translateLyricsFlow = ai.defineFlow(
  {
    name: 'translateLyricsFlow',
    inputSchema: TranslateLyricsInputSchema,
    outputSchema: TranslateLyricsOutputSchema,
  },
  async input => {
    const {output} = await translateLyricsPrompt(input);
    return output!;
  }
);

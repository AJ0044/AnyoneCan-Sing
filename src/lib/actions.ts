
'use server';

import { translateLyrics, type TranslateLyricsInput } from "@/ai/flows/translate-lyrics";
import { synthesizeSong, type SynthesizeSongInput } from "@/ai/flows/synthesize-song";
import { z } from "zod";

const translateSchema = z.object({
  englishLyrics: z.string().min(1, { message: "Lyrics cannot be empty." }),
});

export async function handleTranslate(formData: FormData) {
  try {
    const validatedData = translateSchema.parse({
      englishLyrics: formData.get('englishLyrics'),
    });
    const result = await translateLyrics(validatedData as TranslateLyricsInput);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during translation.";
    return { success: false, error: errorMessage };
  }
}

const synthesizeSchema = z.object({
  lyrics: z.string().min(1),
  voiceStyle: z.enum([
    'alnilam',
    'charon',
    'aoede',
    'achird',
    'puck',
    'vindemiatrix',
  ]),
});

export async function handleSynthesize(formData: FormData) {
  try {
    const validatedData = synthesizeSchema.parse({
      lyrics: formData.get('lyrics'),
      voiceStyle: formData.get('voiceStyle'),
    });
    const result = await synthesizeSong(validatedData as SynthesizeSongInput);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during synthesis.";
    return { success: false, error: errorMessage };
  }
}

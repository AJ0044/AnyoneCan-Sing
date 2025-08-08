import type { VoiceStyle } from "@/components/melodia-lingua";

export type Song = {
  title: string;
  artist: string;
  lyrics: string;
  voice: VoiceStyle;
};

export const preloadedSongs: Song[] = [
  {
    title: "Twinkle, Twinkle, Little Star",
    artist: "Jane Taylor",
    voice: "Childlike",
    lyrics: `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, all the night.

Then the trav'ller in the dark,
Thanks you for your tiny spark,
He could not see which way to go,
If you did not twinkle so.`,
  },
  {
    title: "Amazing Grace",
    artist: "John Newton",
    voice: "FemaleAlto",
    lyrics: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

Through many dangers,toils, and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.`,
  },
  {
    title: "Row, Row, Row Your Boat",
    artist: "Traditional",
    voice: "MaleTenor",
    lyrics: `Row, row, row your boat,
Gently down the stream.
Merrily, merrily, merrily, merrily,
Life is but a dream.`,
  },
];

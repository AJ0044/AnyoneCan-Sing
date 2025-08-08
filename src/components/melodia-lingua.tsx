
"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LyricsPanel } from "@/components/lyrics-panel";
import { OutputPanel } from "@/components/output-panel";
import { handleTranslate, handleSynthesize } from "@/lib/actions";

export type VoiceStyle = 
  | 'MaleBass'
  | 'MaleTenor'
  | 'MaleSoft'
  | 'FemaleSoprano'
  | 'FemaleAlto'
  | 'FemaleMelodic'
  | 'Childlike'
  | 'Robotic'
  | 'Cartoon';

export const voiceStyles: { value: VoiceStyle, label: string }[] = [
  { value: 'MaleTenor', label: '🎤 Male (Tenor)' },
  { value: 'MaleBass', label: '🎤 Male (Bass)' },
  { value: 'MaleSoft', label: '🎤 Male (Soft)' },
  { value: 'FemaleSoprano', label: '🎤 Female (Soprano)' },
  { value: 'FemaleAlto', label: '🎤 Female (Alto)' },
  { value: 'FemaleMelodic', label: '🎤 Female (Melodic)' },
  { value: 'Childlike', label: '🧒 Child-like' },
  { value: 'Robotic', label: '🤖 Robotic' },
  { value: 'Cartoon', label: '🎭 Cartoon' },
];


export function MelodiaLingua() {
  const [englishLyrics, setEnglishLyrics] = useState<string>("");
  const [malayalamLyrics, setMalayalamLyrics] = useState<string>("");
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceStyle>('MaleTenor');
  
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  const { toast } = useToast();

  const onTranslate = async () => {
    if (!englishLyrics.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some English lyrics to translate.",
      });
      return;
    }
    setIsTranslating(true);
    setMalayalamLyrics("");
    setAudioDataUri(null);
    setShowPlayer(false);
    
    const formData = new FormData();
    formData.append('englishLyrics', englishLyrics);

    const result = await handleTranslate(formData);
    
    if (result.success) {
      setMalayalamLyrics(result.data.malayalamLyrics);
       toast({
        title: "Success!",
        description: "Lyrics translated to Malayalam.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: result.error,
      });
    }
    setIsTranslating(false);
  };

  const onSynthesize = async () => {
    if (!malayalamLyrics.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There are no Malayalam lyrics to synthesize.",
      });
      return;
    }
    setIsSynthesizing(true);
    setAudioDataUri(null);
    setShowPlayer(false);
    
    const formData = new FormData();
    formData.append('lyrics', malayalamLyrics);
    formData.append('voiceStyle', selectedVoice);

    const result = await handleSynthesize(formData);

    if (result.success) {
      setAudioDataUri(result.data.audioDataUri);
      setShowPlayer(true);
       toast({
        title: "Song Synthesized!",
        description: "Your Malayalam lyrics are ready to be played.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Synthesis Failed",
        description: result.error,
      });
    }
    setIsSynthesizing(false);
  };

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg overflow-hidden border-border/80 bg-card/80 backdrop-blur-lg">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 min-h-[70vh] divide-x divide-border/80">
          <LyricsPanel
            englishLyrics={englishLyrics}
            setEnglishLyrics={setEnglishLyrics}
            onTranslate={onTranslate}
            isTranslating={isTranslating}
            setSelectedVoice={setSelectedVoice}
          />
          <OutputPanel
            englishLyrics={englishLyrics}
            malayalamLyrics={malayalamLyrics}
            setMalayalamLyrics={setMalayalamLyrics}
            isTranslating={isTranslating}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            onSynthesize={onSynthesize}
            isSynthesizing={isSynthesizing}
            audioDataUri={audioDataUri}
            showPlayer={showPlayer}
            setShowPlayer={setShowPlayer}
          />
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioPlayer } from "@/components/audio-player";
import { KaraokeDisplay } from "@/components/karaoke-display";
import type { VoiceStyle } from "./melodia-lingua";
import { voiceStyles } from "./melodia-lingua";
import { Music2, Loader2, Edit, Music, Mic, Wand2, Upload, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface OutputPanelProps {
  englishLyrics: string;
  malayalamLyrics: string;
  setMalayalamLyrics: (lyrics: string) => void;
  isTranslating: boolean;
  selectedVoice: VoiceStyle;
  setSelectedVoice: (voice: VoiceStyle) => void;
  onSynthesize: (makeDuet: boolean) => void;
  isSynthesizing: boolean;
  audioDataUri: string | null;
  showPlayer: boolean;
  setShowPlayer: (show: boolean) => void;
}

export function OutputPanel({
  englishLyrics,
  malayalamLyrics,
  setMalayalamLyrics,
  isTranslating,
  selectedVoice,
  setSelectedVoice,
  onSynthesize,
  isSynthesizing,
  audioDataUri,
  showPlayer,
  setShowPlayer,
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = React.useState("translated");
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [karaokeState, setKaraokeState] = React.useState({
    isPlaying: false,
    currentLineIndex: -1,
  });
  const [customAudioDataUri, setCustomAudioDataUri] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [makeDuet, setMakeDuet] = React.useState(false);

  const lyricsToDisplay = activeTab === "original" ? englishLyrics : malayalamLyrics;
  const lyricsLines = lyricsToDisplay.split('\n').filter(line => line.trim() !== '');

  const handleTimeUpdate = (currentTime: number) => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (!isNaN(duration) && duration > 0) {
        const progress = currentTime / duration;
        const lineIndex = Math.floor(progress * lyricsLines.length);
        setKaraokeState(prev => ({ ...prev, currentLineIndex: lineIndex }));
      }
    }
  };

  const resetKaraoke = () => {
    setKaraokeState({ isPlaying: false, currentLineIndex: -1 });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setCustomAudioDataUri(result);
          setShowPlayer(true);
          toast({
            title: "Audio Loaded",
            description: `${file.name} is ready for karaoke.`,
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported File",
          description: "Please upload a valid audio file (e.g., MP3, WAV).",
        });
      }
      event.target.value = "";
    }
  };
  
  const handleEditClick = () => {
    setShowPlayer(false);
    setCustomAudioDataUri(null);
  }

  if (isTranslating) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!malayalamLyrics) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center text-muted-foreground h-full">
        <Wand2 className="h-16 w-16 mb-4" />
        <h3 className="font-headline text-2xl mb-2">Translation Output</h3>
        <p>Your translated lyrics will appear here once you press the translate button.</p>
      </div>
    );
  }
  
  const audioForPlayer = customAudioDataUri || audioDataUri;

  if (showPlayer && audioForPlayer) {
    return (
        <div className="p-6 flex flex-col gap-4 h-full bg-accent/20">
            <KaraokeDisplay 
                lyricsLines={lyricsLines}
                currentLineIndex={karaokeState.currentLineIndex}
                isOriginal={activeTab === 'original'}
            />
            <div className="mt-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="translated">Malayalam</TabsTrigger>
                        <TabsTrigger value="original">Original</TabsTrigger>
                    </TabsList>
                </Tabs>
                <AudioPlayer
                    ref={audioRef}
                    audioDataUri={audioForPlayer}
                    onPlay={() => setKaraokeState(prev => ({...prev, isPlaying: true}))}
                    onPause={resetKaraoke}
                    onEnded={resetKaraoke}
                    onTimeUpdate={handleTimeUpdate}
                 />
                <Button variant="outline" className="w-full mt-4" onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Lyrics & Voice
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <Tabs defaultValue="translated" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="translated">Translated</TabsTrigger>
          <TabsTrigger value="side-by-side">Side-by-Side</TabsTrigger>
          <TabsTrigger value="original">Original</TabsTrigger>
        </TabsList>
        <TabsContent value="translated" className="flex-grow mt-4">
          <Textarea
            value={malayalamLyrics}
            onChange={(e) => setMalayalamLyrics(e.target.value)}
            className="h-full resize-none text-base"
            placeholder="Editable Malayalam translation..."
          />
        </TabsContent>
        <TabsContent value="side-by-side" className="flex-grow mt-4 overflow-auto">
            <div className="grid grid-cols-2 gap-4 h-full">
                <Textarea value={englishLyrics} readOnly className="h-full resize-none text-base bg-muted/50" />
                <Textarea value={malayalamLyrics} onChange={(e) => setMalayalamLyrics(e.target.value)} className="h-full resize-none text-base" />
            </div>
        </TabsContent>
        <TabsContent value="original" className="flex-grow mt-4">
            <Textarea value={englishLyrics} readOnly className="h-full resize-none text-base bg-muted/50" />
        </TabsContent>
      </Tabs>
      
      <div className="space-y-2 pt-4 border-t">
        <Label htmlFor="voice-select" className="flex items-center gap-2 font-headline text-lg">
          <Mic className="h-5 w-5 text-primary" />
          Select a Voice
        </Label>
        <Select value={selectedVoice} onValueChange={(v) => setSelectedVoice(v as VoiceStyle)}>
          <SelectTrigger id="voice-select">
            <SelectValue placeholder="Choose a voice style..." />
          </SelectTrigger>
          <SelectContent>
            {voiceStyles.map(voice => (
                <SelectItem key={voice.value} value={voice.value}>{voice.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="duet-checkbox" checked={makeDuet} onCheckedChange={(checked) => setMakeDuet(Boolean(checked))} />
            <Label htmlFor="duet-checkbox" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Duet Track (Adds pauses)
            </Label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          size="lg"
          onClick={() => onSynthesize(makeDuet)}
          disabled={isSynthesizing || !malayalamLyrics.trim()}
          className="w-full font-bold text-lg"
        >
          {isSynthesizing ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Music2 />
          )}
          Synthesize Song
        </Button>
        <Button
            size="lg"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full font-bold text-lg"
        >
            <Upload className="mr-2 h-5 w-5" />
            Upload Karaoke Track
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

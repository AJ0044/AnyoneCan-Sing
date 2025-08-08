
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { preloadedSongs, type Song } from "@/lib/preloaded-songs";
import { Languages, Loader2, UploadCloud, BookMarked } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LyricsPanelProps {
  englishLyrics: string;
  setEnglishLyrics: (lyrics: string) => void;
  onTranslate: () => void;
  isTranslating: boolean;
}

export function LyricsPanel({
  englishLyrics,
  setEnglishLyrics,
  onTranslate,
  isTranslating,
}: LyricsPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSongSelect = (title: string) => {
    if (title === "none") {
      setEnglishLyrics("");
      return;
    }
    const song = preloadedSongs.find((s) => s.title === title);
    if (song) {
      setEnglishLyrics(song.lyrics);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setEnglishLyrics(text);
          toast({
            title: "File Loaded",
            description: `${file.name} lyrics have been loaded.`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported File",
          description: "Please upload a .txt file.",
        });
      }
      // Reset file input value to allow re-uploading the same file
      event.target.value = "";
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-card/50">
      <div className="space-y-2">
        <Label htmlFor="song-select" className="flex items-center gap-2 font-headline text-lg">
          <BookMarked className="h-5 w-5 text-primary" />
          Choose a Song
        </Label>
        <Select onValueChange={handleSongSelect}>
          <SelectTrigger id="song-select">
            <SelectValue placeholder="Select a preloaded song..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {preloadedSongs.map((song: Song) => (
              <SelectItem key={song.title} value={song.title}>
                {song.title} - {song.artist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-center text-sm text-muted-foreground">OR</div>

      <div className="flex-grow flex flex-col gap-2">
        <Label htmlFor="lyrics-input" className="font-headline text-lg">
          Enter English Lyrics
        </Label>
        <Textarea
          id="lyrics-input"
          placeholder="Paste or type your English song lyrics here..."
          className="flex-grow text-base resize-none"
          value={englishLyrics}
          onChange={(e) => setEnglishLyrics(e.target.value)}
        />
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud />
          Upload .txt File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt"
          onChange={handleFileChange}
        />
      </div>
      
      <Button
        size="lg"
        onClick={onTranslate}
        disabled={isTranslating || !englishLyrics.trim()}
        className="w-full font-bold text-lg"
      >
        {isTranslating ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Languages />
        )}
        Translate to Malayalam
      </Button>
    </div>
  );
}

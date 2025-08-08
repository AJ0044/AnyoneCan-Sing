
"use client";

import * as React from 'react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music } from 'lucide-react';

interface KaraokeDisplayProps {
  lyricsLines: string[];
  currentLineIndex: number;
  isOriginal: boolean;
}

export function KaraokeDisplay({ lyricsLines, currentLineIndex, isOriginal }: KaraokeDisplayProps) {
  const lineRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  React.useEffect(() => {
    if (currentLineIndex >= 0 && currentLineIndex < lyricsLines.length) {
      lineRefs.current[currentLineIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex, lyricsLines.length]);

  if (lyricsLines.length === 0) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground p-4">
          <Music className="h-16 w-16 mb-4" />
          <p>Lyrics will be displayed here during playback.</p>
        </div>
    );
  }

  return (
    <ScrollArea className="flex-grow h-96 bg-card rounded-lg border border-border/80 shadow-inner">
      <ul className="p-6 md:p-8">
        {lyricsLines.map((line, index) => (
          <li
            key={index}
            ref={el => lineRefs.current[index] = el}
            className={cn(
              "transition-all duration-300 ease-in-out py-2 text-2xl md:text-3xl text-center font-semibold tracking-wide",
              isOriginal ? 'font-sans' : 'font-serif', // Example of different font styles
              currentLineIndex === index
                ? "text-primary scale-105"
                : "text-muted-foreground/60 scale-100"
            )}
            style={{
                textShadow: currentLineIndex === index ? '0 0 10px hsl(var(--primary) / 0.5)' : 'none'
            }}
          >
            {line}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

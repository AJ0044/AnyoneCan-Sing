
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

interface AudioPlayerProps {
  audioDataUri: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export const AudioPlayer = React.forwardRef<HTMLAudioElement, AudioPlayerProps>(
  ({ audioDataUri, onPlay, onPause, onEnded, onTimeUpdate }, ref) => {
    const internalRef = React.useRef<HTMLAudioElement>(null);
    const audioRef = (ref || internalRef) as React.RefObject<HTMLAudioElement>;
    
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => { setIsPlaying(true); onPlay?.(); };
        const handlePause = () => { setIsPlaying(false); onPause?.(); };
        const handleEnded = () => { setIsPlaying(false); onEnded?.(); setProgress(0); };
        const handleTimeUpdateInternal = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
            onTimeUpdate?.(audio.currentTime);
        };
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', handleTimeUpdateInternal);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', handleTimeUpdateInternal);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [audioRef, onPlay, onPause, onEnded, onTimeUpdate]);
    
    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    };
    
    const handleRewind = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = audioDataUri;
        link.download = 'melodia-lingua-song.wav';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSliderChange = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = (value[0] / 100) * duration;
        }
    };

    return (
      <div className="w-full p-4 rounded-lg bg-card border border-border/80 shadow-inner mt-4">
        <audio ref={audioRef} src={audioDataUri} />
        <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <div className="flex-grow flex items-center gap-2">
                <span className="text-sm font-mono">{formatTime(audioRef.current?.currentTime ?? 0)}</span>
                <Slider
                    value={[progress]}
                    max={100}
                    step={1}
                    onValueChange={handleSliderChange}
                />
                <span className="text-sm font-mono">{formatTime(duration)}</span>
            </div>
            <Button size="icon" variant="ghost" onClick={handleRewind}>
                <RotateCcw className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDownload}>
                <Download className="h-5 w-5" />
            </Button>
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

import { MelodiaLingua } from '@/components/melodia-lingua';
import { Music } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 text-center border-b border-border/80 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-center gap-3">
          <Music className="text-primary h-8 w-8" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            MelodiaLingua
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Instantly translate English song lyrics into Malayalam and listen to an AI-generated vocal performance.
        </p>
      </header>
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <MelodiaLingua />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm border-t border-border/80 mt-8">
        <p>Created with AI by Firebase Studio</p>
      </footer>
    </div>
  );
}

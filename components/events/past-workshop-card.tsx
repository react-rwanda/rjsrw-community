import { Play, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PastWorkshopCardProps {
  sessionNumber: number;
  title: string;
  date: string;
  duration: string;
  slidesUrl?: string;
  videoUrl?: string;
}

export function PastWorkshopCard({
  sessionNumber,
  title,
  date,
  duration,
  slidesUrl,
  videoUrl,
}: PastWorkshopCardProps) {
  return (
    <div className="flex flex-col border border-neutral-200 h-full">
      <div className="bg-[#111111] p-6 md:p-8 flex flex-col relative overflow-hidden h-[180px]">
        <div className="font-mono text-cyan-400 uppercase text-[12px] font-semibold tracking-widest mb-4">
          SESSION #{sessionNumber}
        </div>
        <h3 className="text-white text-[24px] font-bold leading-[1.3] relative z-10 max-w-[85%]">
          {title}
        </h3>
        <div className="absolute -bottom-6 -right-6 text-neutral-600 opacity-60 rotate-12 pointer-events-none">
          <Monitor className="w-32 h-32" strokeWidth={1.5} />
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 flex flex-col grow">
        <div className="flex items-center justify-between font-mono text-[12px] text-neutral-500 mb-6 uppercase tracking-wider">
          <span>{date}</span>
          <span>{duration}</span>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button variant="outline" className="flex-1 text-[11px] h-10 tracking-widest" asChild>
            <a href={slidesUrl || "#"}>
              <Play className="w-[14px] h-[14px]" />
              SLIDES
            </a>
          </Button>
          <Button variant="outline" className="flex-1 text-[11px] h-10 tracking-widest" asChild>
            <a href={videoUrl || "#"}>
              <Play className="w-[14px] h-[14px]" />
              VIDEO
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

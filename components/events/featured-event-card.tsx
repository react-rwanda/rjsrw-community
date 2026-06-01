import Image from "next/image";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

export function FeaturedEventCard() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 border border-neutral-200 bg-white flex flex-col">
        <div className="relative aspect-[21/9] sm:aspect-[16/9] lg:aspect-[2/1] w-full bg-neutral-100 border-b border-neutral-200">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt="Featured Event Cover"
            fill
            priority
            className="object-cover"
          />
          
          <div className="absolute top-4 left-4 bg-neutral-950 text-white font-mono px-3 py-1.5 text-[11px] font-semibold tracking-wider">
            OCT 24, 2024
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col grow">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-[24px] md:text-[32px] font-black uppercase tracking-[-0.01em] text-neutral-900 leading-none">
              Kigali React Night
            </h2>
            <button aria-label="View event details" className="shrink-0 flex items-center justify-center w-12 h-12 border border-neutral-900 hover:bg-neutral-50 transition-colors">
              <ArrowRight className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-neutral-600 mb-6">
            <MapPin className="w-[16px] h-[16px] text-primary-600" />
            <span className="text-[14px] text-neutral-600">
              Norrsken House Kigali, Townhall
            </span>
          </div>

          <p className="text-[15px] text-neutral-600 leading-relaxed max-w-3xl mb-8">
            Join us for our signature monthly meetup. We'll be discussing the latest React 19 features, Concurrent Rendering in production, and local success stories from Rwandan startups.
          </p>

          <div className="mt-auto pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 border-2 border-white overflow-hidden relative z-0 bg-neutral-100"
                  style={{ borderRadius: '10px' }}
                >
                  <Image
                    src={`https://i.pravatar.cc/100?img=${i + 15}`}
                    alt="Attendee avatar"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ))}
              <div 
                className="w-8 h-8 border-2 border-white bg-[#38BDF8] flex items-center justify-center text-[10px] font-bold text-white z-10"
                style={{ borderRadius: '10px' }}
              >
                +42
              </div>
            </div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.04em]">
              Developers Attending
            </span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[340px] shrink-0 border border-neutral-200 bg-white flex flex-col p-6 md:p-8">
        <div className="mb-4">
          <span className="font-mono text-[11px] font-semibold text-primary-600 uppercase tracking-widest">
            Next Workshop
          </span>
        </div>
        
        <h3 className="text-[20px] md:text-[24px] font-bold text-neutral-900 leading-[1.2] mb-3">
          Advanced Tailwind & React Patterns
        </h3>
        
        <p className="text-[14px] text-neutral-600 leading-relaxed mb-8">
          A deep-dive session into building maintainable UI libraries with Radix UI and Tailwind CSS.
        </p>
        
        <div className="mt-auto space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-[18px] h-[18px] text-neutral-400" strokeWidth={1.5} />
            <span className="text-[14px] font-medium text-neutral-900">
              Nov 02, 2024
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-[18px] h-[18px] text-neutral-400" strokeWidth={1.5} />
            <span className="text-[14px] font-medium text-neutral-900">
              10:00 AM - 01:00 PM
            </span>
          </div>
        </div>

        <button className="w-full bg-neutral-950 text-white hover:bg-neutral-800 transition-colors h-12 text-[12px] font-semibold uppercase tracking-[0.06em]">
          Register Seat
        </button>
      </div>
    </div>
  );
}

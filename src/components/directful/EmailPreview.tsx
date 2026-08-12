import defaultHero from "@/assets/tpl-default.jpg";
import valleyHero from "@/assets/tpl-valley.jpg";
import editorialHero from "@/assets/tpl-editorial.jpg";

export type PreviewVariant = "default" | "valley" | "editorial";

/**
 * Miniature but realistic renderings of the actual email designs.
 * Colors here are intentional brand renderings of the emails themselves,
 * not app chrome, so they use literal email palettes.
 */
export function EmailPreview({ variant }: { variant: PreviewVariant }) {
  if (variant === "valley") {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex flex-col items-center gap-1 py-4">
          <svg viewBox="0 0 40 20" className="h-4 w-10 text-[#1f4d3a]" aria-hidden>
            <path d="M8 16 13 6l5 10zM20 16 26 4l6 12z" fill="currentColor" />
          </svg>
          <p className="font-serif text-[10px] tracking-[0.28em] text-[#1f4d3a] uppercase">
            Valley Lodge
          </p>
          <p className="text-[5.5px] tracking-[0.3em] text-[#8a9a91] uppercase">Mountain Resort</p>
        </div>
        <img
          src={valleyHero}
          alt="Mountain lodge infinity pool overlooking a green valley"
          loading="lazy"
          width={976}
          height={688}
          className="h-[46%] w-full object-cover"
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="font-serif text-[15px] leading-tight text-[#12241c]">Escape to Nature</p>
          <p className="text-[8px] text-[#6b7a72]">Unwind in comfort. Adventure awaits.</p>
          <span className="mt-1 rounded-[3px] bg-[#1f4d3a] px-3 py-1.5 text-[7.5px] font-semibold tracking-wide text-white">
            Book Your Stay
          </span>
        </div>
        <div className="border-t border-[#eceeec] py-2 text-center text-[5.5px] tracking-[0.2em] text-[#a9b3ae] uppercase">
          Valley Lodge · Unsubscribe
        </div>
      </div>
    );
  }

  if (variant === "editorial") {
    return (
      <div className="grid h-full grid-cols-[1fr_0.85fr] bg-[#f7f6f3]">
        <div className="flex flex-col justify-center gap-2.5 px-5">
          <div>
            <p className="font-serif text-[13px] leading-none text-[#1b2a33]">W</p>
            <p className="text-[5.5px] tracking-[0.34em] text-[#8d9aa2] uppercase">Hotels</p>
          </div>
          <p className="font-serif text-[15px] leading-[1.15] text-[#12222b]">
            A New
            <br />
            Perspective
          </p>
          <p className="text-[7.5px] leading-relaxed text-[#65757e]">
            Curated experiences for
            <br />
            the modern traveler.
          </p>
          <span className="w-fit rounded-[2px] bg-[#12222b] px-2.5 py-1.5 text-[7px] font-semibold text-white">
            Discover More
          </span>
          <div className="mt-1 h-px w-10 bg-[#d6d2c9]" />
          <p className="text-[5.5px] tracking-[0.18em] text-[#a6a49c] uppercase">
            Suites · Dining · Spa
          </p>
        </div>
        <img
          src={editorialHero}
          alt="Tropical resort pool framed by palm trees"
          loading="lazy"
          width={672}
          height={992}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-col items-center gap-0.5 bg-[#f6f7f9] py-3">
        <p className="text-[9px] font-semibold tracking-[0.2em] text-[#16233a] uppercase">
          ◆ Wyndham Grand
        </p>
        <p className="text-[5.5px] tracking-[0.28em] text-[#93a0b4] uppercase">Istanbul Levent</p>
      </div>
      <img
        src={defaultHero}
        alt="Hotel suite with mountain view at dusk"
        loading="lazy"
        width={976}
        height={688}
        className="h-[48%] w-full object-cover"
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-serif text-[15px] text-[#16233a]">Your Next Stay Awaits</p>
        <p className="text-[8px] text-[#6d7b90]">We can&apos;t wait to welcome you.</p>
        <span className="mt-1 rounded-[3px] bg-[#16233a] px-3 py-1.5 text-[7.5px] font-semibold tracking-wide text-white">
          Explore Offers
        </span>
      </div>
      <div className="border-t border-[#eef0f3] py-2 text-center text-[5.5px] tracking-[0.2em] text-[#aab3c1] uppercase">
        Wyndham Grand · Preferences
      </div>
    </div>
  );
}

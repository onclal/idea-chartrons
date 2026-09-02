import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loc } from '../lib/locale';
import { HERO_SLIDE_ROTATION_MS, type HeroSlide } from '../lib/heroSlides';

interface DefaultHeroSlide {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

interface HeroCarouselProps {
  /** Toujours present, inchange : le visuel de bienvenue actuel. */
  defaultSlide: DefaultHeroSlide;
  /** Slides evenement/sponsor programmes en plus, s'il y en a. */
  extraSlides: HeroSlide[];
}

/**
 * Le rectangle photo d'accueil. Sans slide programme, il rend exactement le
 * meme visuel qu'avant (memes dimensions, meme mise en page) : rien ne change
 * pour un habitant tant que l'association n'a rien programme dans l'admin.
 */
export function HeroCarousel({ defaultSlide, extraSlides }: HeroCarouselProps) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const total = 1 + extraSlides.length;

  useEffect(() => {
    setIndex(0);
  }, [extraSlides.length]);

  useEffect(() => {
    if (total <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, HERO_SLIDE_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [total]);

  const extra = index > 0 ? extraSlides[index - 1] : null;

  const image = extra ? extra.imageUrl : defaultSlide.imageSrc;
  const title = extra ? loc(i18n.language, extra.title) : defaultSlide.title;
  const description = extra ? loc(i18n.language, extra.subtitle) : defaultSlide.description;
  const alt = extra ? title : defaultSlide.imageAlt;
  const ctaLabel = extra ? loc(i18n.language, extra.ctaLabel) : '';
  const sponsorLabel = extra?.kind === 'sponsor' ? extra.sponsorName || t('home.heroSponsoredDefault') : null;

  return (
    <div className="overflow-hidden rounded-3xl shadow-card">
      <div className="relative h-52 bg-gradient-to-br from-chartrons-green to-chartrons-beige">
        <img src={image} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-chartrons-green via-chartrons-green/45 to-chartrons-green/10" />

        {sponsorLabel && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide bg-white/85 text-chartrons-olive-dark px-2 py-1 rounded-full">
            {sponsorLabel}
          </span>
        )}

        <div className="relative h-full flex flex-col justify-end p-5 text-white">
          <h2 className="text-2xl font-bold leading-tight">{title}</h2>
          <p className="text-sm text-white/85 leading-relaxed mt-1.5 max-w-sm">{description}</p>
          {extra && extra.ctaUrl && (
            <Link
              to={extra.ctaUrl}
              className="mt-2 inline-flex w-fit items-center gap-1 text-xs font-semibold underline underline-offset-2"
            >
              {ctaLabel} →
            </Link>
          )}
        </div>

        {total > 1 && (
          <div className="absolute bottom-2.5 right-3 flex gap-1.5" aria-hidden>
            {Array.from({ length: total }).map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  dotIndex === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

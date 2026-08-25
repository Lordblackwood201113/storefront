"use client";

import Image from "next/image";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import type { HeroSlide } from "@/lib/hero-slides";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

/**
 * Fond défilant du bandeau d'accueil. Se place en `absolute inset-0` derrière
 * le texte : le contenu du bandeau reste rendu côté serveur, seul ce fond est
 * un composant client.
 */
export function HeroCarousel({ slides }: HeroCarouselProps): ReactElement {
  // Respecte le réglage système « réduire les animations » : sans lui, un
  // carrousel qui défile seul est un facteur connu de gêne vestibulaire.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <SwiperComponent
      className="hero-carousel h-full w-full"
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={900}
      loop={slides.length > 1}
      allowTouchMove={slides.length > 1}
      autoplay={
        reducedMotion || slides.length < 2
          ? false
          : { delay: 5500, disableOnInteraction: false }
      }
      pagination={slides.length > 1 ? { clickable: true } : false}
      a11y={{ enabled: true }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.src}>
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            /* La première image est l'élément le plus grand de la page :
               on la précharge pour ne pas dégrader le LCP. */
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </SwiperSlide>
      ))}
    </SwiperComponent>
  );
}

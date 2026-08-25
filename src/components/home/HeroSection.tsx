import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/lib/hero-slides";
import { getStoreName } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath, locale }: HeroSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });
  const storeName = getStoreName();

  // Tableau vide dans hero-slides.ts => retour au bandeau sobre sur fond blanc.
  const slides = HERO_SLIDES;
  const hasSlides = slides.length > 0;

  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden border-b border-gray-200",
        // La hauteur mobile est volontairement conservée : globals.css s'y
        // adosse pour différer le rendu des produits en vedette sous la ligne
        // de flottaison.
        "min-h-[823px] md:min-h-[560px]",
      )}
    >
      {hasSlides && (
        <>
          {/* Swiper force `position: relative` sur son conteneur racine, ce
              qui écrase un `absolute` posé en classe utilitaire. On l'enveloppe
              donc dans un conteneur positionné plutôt que de surenchérir en
              spécificité CSS. */}
          <div className="absolute inset-0">
            <HeroCarousel slides={slides} />
          </div>
          {/* Voile assombrissant : sans lui, le texte blanc devient illisible
              dès qu'une image comporte des zones claires. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-gradient-to-b from-black/45 via-black/35 to-black/65"
          />
        </>
      )}

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1
            className={cn(
              "text-4xl md:text-5xl font-bold tracking-tight",
              hasSlides
                ? "text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.45)]"
                : "text-gray-900",
            )}
          >
            {t("welcome", { storeName })}
          </h1>
          <p
            className={cn(
              "mt-4 text-lg max-w-2xl mx-auto",
              hasSlides
                ? "text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]"
                : "text-gray-600",
            )}
          >
            {t("heroDescription")}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              asChild
              className={cn(
                hasSlides &&
                  "bg-white text-gray-900 shadow-lg hover:bg-white/90 focus-visible:ring-white",
              )}
            >
              <Link href={`${basePath}/products`}>{t("shopNow")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

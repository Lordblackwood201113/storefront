/**
 * Slides du carrousel de la page d'accueil.
 *
 * Les fichiers vivent dans `public/hero/`. Pour changer les visuels, remplacez
 * les images (format paysage, 1920x1080 recommandé) et ajustez les `alt`, qui
 * sont lus par les lecteurs d'écran et indexés par les moteurs de recherche.
 *
 * Laisser ce tableau vide désactive le carrousel : la page d'accueil revient
 * alors au bandeau sobre sur fond blanc.
 */
export interface HeroSlide {
  src: string;
  alt: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/hero/hero-1.jpg",
    alt: "Sélection de vêtements suspendus à un portant",
  },
  {
    src: "/hero/hero-2.jpg",
    alt: "Canapé en tissu orange avec coussin rose et filet à provisions jaune",
  },
  {
    src: "/hero/hero-3.jpg",
    alt: "Salon lumineux avec canapé gris et coussins turquoise",
  },
];

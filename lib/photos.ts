import type { Photo } from "@/components/PhotoGrid";

const windsOfChange: Photo = { src: "/images/winds-of-change.jpg", title: "Winds of Change", width: 6240, height: 4160 };
const sight: Photo = { src: "/images/sight.jpg", title: "Sight", width: 4160, height: 6240 };
const heritage: Photo = { src: "/images/heritage.jpg", title: "Heritage", width: 6240, height: 4160 };
const theViewFromStoa: Photo = { src: "/images/the-view-from-stoa.jpg", title: "The View from Stoa", width: 6240, height: 4160 };
const opal: Photo = { src: "/images/opal.jpg", title: "Opal", width: 6240, height: 4160 };
const trident: Photo = { src: "/images/trident.jpg", title: "Trident", width: 6240, height: 4160 };
const mightOfTheSea: Photo = { src: "/images/might-of-the-sea.jpg", title: "Might of the Sea", width: 4160, height: 6240 };
const pastorale: Photo = { src: "/images/pastorale.jpg", title: "Pastorale", width: 4160, height: 6240 };
const ornament: Photo = { src: "/images/ornament.jpg", title: "Ornament", width: 4160, height: 6240 };
const acros: Photo = { src: "/images/acros.jpg", title: "Acros", width: 4160, height: 6240 };
const surrealist: Photo = { src: "/images/surrealist.JPG", title: "Surrealist", width: 6240, height: 4160 };

// Full gallery — order chosen deliberately so the masonry columns fit
// tidily (e.g. opal sits flush to the right of surrealist, the view from
// stoa sits between heritage and ornament).
export const photos: Photo[] = [
  windsOfChange,
  sight,
  heritage,
  trident,
  mightOfTheSea,
  pastorale,
  theViewFromStoa,
  ornament,
  acros,
  surrealist,
  opal,
];

// Curated subset for the home page "glimpse" section, capped at 3 columns
// (see PhotoGrid's `columns` prop on the home page) so 6 photos divide
// evenly into 2 per column instead of leaving a short 4th column.
export const glimpsePhotos: Photo[] = [
  windsOfChange,
  trident,
  sight,
  heritage,
  opal,
  ornament,
];

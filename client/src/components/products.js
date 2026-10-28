
const products = [
  // PRINTS
  {
    id: 1,
    name: "Classic Photo Prints",
    category: "PRINTS",
    description: "High-quality prints that bring your favorite moments to life.",
    price: 12.99,
    image: `${import.meta.env.BASE_URL}images/classic-prints.jpg`,
  },
  {
    id: 2,
    name: "Fine Art Prints",
    category: "PRINTS",
    description: "Elegant fine art prints with beautiful detail and rich tones.",
    price: 19.99,
    image: `${import.meta.env.BASE_URL}images/fine-art-prints.jpg`,
  },
  {
    id: 3,
    name: "Framed Photo Print",
    category: "PRINTS",
    description: "A timeless framed photograph, ready to display and cherish.",
    price: 29.99,
    image: `${import.meta.env.BASE_URL}images/framed-print.jpg`,
  },

  // ALBUMS
  {
    id: 4,
    name: "Classic Memory Album",
    category: "ALBUMS",
    description: "A beautiful album for keeping your most treasured memories.",
    price: 34.99,
    image: `${import.meta.env.BASE_URL}images/classic-album.jpg`,
  },
  {
    id: 5,
    name: "Premium Wedding Album",
    category: "ALBUMS",
    description: "An elegant album designed for life's most special celebrations.",
    price: 59.99,
    image: `${import.meta.env.BASE_URL}images/wedding-album.jpg`,
  },
  {
    id: 6,
    name: "Travel Memories Album",
    category: "ALBUMS",
    description: "Keep your favorite adventures together in one special place.",
    price: 44.99,
    image: `${import.meta.env.BASE_URL}images/travel-album.jpg`,
  },

  // KEEPSAKES
  {
    id: 7,
    name: "Memory Keepsake Box",
    category: "KEEPSAKES",
    description: "A thoughtful box for photographs and meaningful little treasures.",
    price: 24.99,
    image: `${import.meta.env.BASE_URL}images/keepsake-box.jpg`,
  },
  {
    id: 8,
    name: "Personalized Photo Gift",
    category: "KEEPSAKES",
    description: "A personal gift that turns a favorite moment into a lasting memory.",
    price: 17.99,
    image: `${import.meta.env.BASE_URL}images/photo-gift.jpg`,
  },
  {
    id: 9,
    name: "Memory Gift Set",
    category: "KEEPSAKES",
    description: "A curated set of keepsakes made for meaningful occasions.",
    price: 39.99,
    image: `${import.meta.env.BASE_URL}images/memory-gift-set.jpg`,
  },
];

export default products;

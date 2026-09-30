// Edit the shop here. image = https link, or "" for a placeholder.
export const SHOP = { name: 'Kaneko', handle: '@yourbot_admin', logo: '' };

export const CATEGORIES = [
  'Skincare',
  'Makeup',
  'Nutrition',
  'Daily Necessities',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const PRODUCTS = [
  {
    id: 1,
    name: 'Skincare 1',
    cat: 'Skincare',
    price: 2.5,
    sizes: SIZES,
    popular: true,
    image: '',
  },
  {
    id: 2,
    name: 'Box ណត',
    cat: 'Box',
    price: 1.9,
    sizes: ['00', '0', 'A', 'AA', 'B', 'C', 'D', 'E'],
    popular: true,
    image: '',
  },
  {
    id: 3,
    name: 'Box Khmer Clear Stock',
    cat: 'Box',
    price: 1.8,
    was: 1.9,
    sizes: ['00', '0', 'AA', 'A', 'B', 'C'],
    image: '',
  },
  {
    id: 4,
    name: 'Box Pink Ribbon',
    cat: 'Box',
    price: 2.7,
    was: 3.0,
    sizes: ['00', '0', 'A', 'B'],
    image: '',
  },
  {
    id: 5,
    name: 'Poly Mailer',
    cat: 'Poly Mailer',
    price: 0.15,
    sizes: ['S', 'M', 'L'],
    image: '',
  },
  {
    id: 6,
    name: 'Thank You Sticker',
    cat: 'Card / Tape / Sticker',
    price: 0.05,
    sizes: [],
    image: '',
  },
];

export const initialRooms = [
  {
    id: 'room-101',
    roomNumber: '101',
    name: 'Grand Horizon Presidential Suite',
    category: 'Presidential Suite',
    tier: 'Luxury',
    pricePerNight: 480,
    capacity: 4,
    sizeSqFt: 850,
    bedType: '1 King + 1 Queen Sleeper',
    floor: 'Penthouse Floor 10',
    status: 'available',
    rating: 4.96,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Panoramic Ocean View', 'Private Jacuzzi & Balcony', 'Butler Service 24/7', 'Marble Bathroom', 'Complimentary Champagne'],
    description: 'Immerse yourself in unparalleled luxury with panoramic coastline views, hand-carved mahogany furnishings, an expansive marble bathroom, and 24/7 private concierge and butler service.'
  },
  {
    id: 'room-102',
    roomNumber: '204',
    name: 'Serenity Deluxe King Suite',
    category: 'Deluxe Suite',
    tier: 'Premium',
    pricePerNight: 295,
    capacity: 2,
    sizeSqFt: 520,
    bedType: '1 California King',
    floor: 'Garden Wing Floor 2',
    status: 'occupied',
    rating: 4.88,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Courtyard Garden View', 'Soaking Bathtub', 'High-speed Wi-Fi 6', 'Nespresso Coffee Bar', 'Smart Climate Control'],
    description: 'A serene haven designed for restorative stays. Featuring plush Belgian linen, a standalone deep-soaking bathtub, and natural garden lighting.'
  },
  {
    id: 'room-103',
    roomNumber: '312',
    name: 'Metropolitan Executive Studio',
    category: 'Executive Room',
    tier: 'Business Luxury',
    pricePerNight: 240,
    capacity: 2,
    sizeSqFt: 440,
    bedType: '1 King Bed',
    floor: 'Tower Floor 3',
    status: 'available',
    rating: 4.82,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Ergonomic Herman Miller Desk', 'City Skyline View', 'Executive Lounge Access', 'Soundproof Windows', 'Fast Wireless Charging'],
    description: 'Tailored for discerning travelers and executives. Seamlessly blends productive workspace ergonomics with five-star hospitality and quiet comfort.'
  },
  {
    id: 'room-104',
    roomNumber: '118',
    name: 'Azure Garden Family Villa',
    category: 'Family Suite',
    tier: 'Signature',
    pricePerNight: 390,
    capacity: 5,
    sizeSqFt: 720,
    bedType: '2 Queens + 1 Daybed',
    floor: 'Ground Floor Private Courtyard',
    status: 'cleaning',
    rating: 4.92,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Direct Pool & Garden Access', 'Kitchenette & Dining Corner', 'Double Vanity Bath', 'Child-Friendly Amenities', 'Private Patio'],
    description: 'Spacious multi-zone comfort for families and groups, featuring a sunlit garden patio, child safety touches, and easy poolside relaxation.'
  },
  {
    id: 'room-105',
    roomNumber: '405',
    name: 'Celestial Penthouse Loft',
    category: 'Presidential Suite',
    tier: 'Ultra Luxury',
    pricePerNight: 550,
    capacity: 3,
    sizeSqFt: 920,
    bedType: '1 Custom Emperor Bed',
    floor: 'Top Floor 12',
    status: 'available',
    rating: 4.99,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Skylight Stargazing Ceiling', 'Private Sauna & Steam Room', 'Fireplace', 'Bang & Olufsen Sound System', 'Private Bar & Sommelier Choice'],
    description: 'The pinnacle of architectural splendor. Gaze at the stars from bed through glass ceiling panels and unwind in your private steam wellness suite.'
  },
  {
    id: 'room-106',
    roomNumber: '215',
    name: 'Boutique Classic Queen',
    category: 'Classic Room',
    tier: 'Comfort',
    pricePerNight: 165,
    capacity: 2,
    sizeSqFt: 340,
    bedType: '1 Plush Queen',
    floor: 'Atrium Level 2',
    status: 'available',
    rating: 4.75,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Crisp 400TC Egyptian Cotton', 'Rainfall Shower', 'Artisanal Tea Station', 'Designer Vanity Mirror', 'Eco-friendly Climate'],
    description: 'Affordable luxury without compromise. Warm ambient lighting, handcrafted minimalist oak decor, and restorative peace for solo or couple travelers.'
  }
];

export const initialBookings = [
  {
    id: 'bk-8821',
    bookingCode: 'HP-882194',
    userId: 'u1',
    guestName: 'Eleanor Vance',
    guestEmail: 'guest@hotelpro.com',
    guestPhone: '+1 (555) 234-5678',
    roomId: 'room-102',
    roomNumber: '204',
    roomName: 'Serenity Deluxe King Suite',
    roomCategory: 'Deluxe Suite',
    checkInDate: '2026-10-25',
    checkOutDate: '2026-10-29',
    guestsCount: 2,
    totalNights: 4,
    nightlyRate: 295,
    subtotal: 1180,
    taxesAndFees: 141.6,
    totalAmount: 1321.6,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    transactionId: 'txn_992384102',
    status: 'checked_in',
    specialRequests: 'Late evening arrival, feather-free hypoallergenic pillows requested.',
    createdAt: '2026-10-20T14:22:00Z'
  },
  {
    id: 'bk-9140',
    bookingCode: 'HP-914022',
    userId: 'u1',
    guestName: 'Eleanor Vance',
    guestEmail: 'guest@hotelpro.com',
    guestPhone: '+1 (555) 234-5678',
    roomId: 'room-101',
    roomNumber: '101',
    roomName: 'Grand Horizon Presidential Suite',
    roomCategory: 'Presidential Suite',
    checkInDate: '2026-11-05',
    checkOutDate: '2026-11-08',
    guestsCount: 3,
    totalNights: 3,
    nightlyRate: 480,
    subtotal: 1440,
    taxesAndFees: 172.8,
    totalAmount: 1612.8,
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay / UPI Express',
    transactionId: 'txn_771829031',
    status: 'confirmed',
    specialRequests: 'Champagne on arrival for anniversary celebration.',
    createdAt: '2026-10-24T09:15:00Z'
  }
];

export const initialServiceRequests = [
  {
    id: 'sr-1',
    roomNumber: '204',
    guestName: 'Eleanor Vance',
    category: 'Housekeeping',
    detail: 'Extra fresh organic bath towels and lavender pillow mist',
    status: 'in_progress',
    timestamp: '2026-10-26T18:40:00Z'
  },
  {
    id: 'sr-2',
    roomNumber: '101',
    guestName: 'VIP Reservation',
    category: 'In-Room Dining',
    detail: 'Artisanal cheese platter and chilled Moët & Chandon at 8:00 PM',
    status: 'pending',
    timestamp: '2026-10-26T19:10:00Z'
  }
];

export const sampleUsers = [
  {
    id: 'u1',
    name: 'Eleanor Vance',
    email: 'guest@hotelpro.com',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'u2',
    name: 'Marcus Sterling',
    email: 'staff@hotelpro.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    department: 'Front Desk & Operations'
  },
  {
    id: 'u3',
    name: 'Victoria Hawthorne',
    email: 'admin@hotelpro.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    department: 'Executive General Manager'
  }
];

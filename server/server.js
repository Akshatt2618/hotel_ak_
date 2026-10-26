import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory Database Store with initial seed data
let users = [
  {
    id: 'u1',
    name: 'Eleanor Vance',
    email: 'guest@hotelpro.com',
    passwordHash: bcrypt.hashSync('guest123', 10),
    role: 'guest',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'Marcus Sterling',
    email: 'staff@hotelpro.com',
    passwordHash: bcrypt.hashSync('staff123', 10),
    role: 'staff',
    department: 'Front Desk & Concierge',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u3',
    name: 'Victoria Hawthorne',
    email: 'admin@hotelpro.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+1 (555) 444-8888',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  }
];

let rooms = [
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
    status: 'available', // available, occupied, maintenance, cleaning
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

let bookings = [
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
    paymentStatus: 'paid', // paid, pending, refunded
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    transactionId: 'txn_992384102',
    status: 'checked_in', // confirmed, checked_in, checked_out, cancelled
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

let serviceRequests = [
  {
    id: 'sr-1',
    roomNumber: '204',
    guestName: 'Eleanor Vance',
    category: 'Housekeeping',
    detail: 'Extra fresh organic bath towels and lavender pillow mist',
    status: 'in_progress', // pending, in_progress, completed
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

let notifications = [
  {
    id: 'notif-1',
    recipientRole: 'all',
    title: 'Booking Confirmed',
    message: 'Reservation #HP-914022 for Grand Horizon Presidential Suite is confirmed.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    recipientRole: 'staff',
    title: 'Check-In Completed',
    message: 'Guest Eleanor Vance checked into Room 204 successfully.',
    time: '5 hours ago',
    read: true
  }
];

// Helper: JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid or expired' });
    req.user = user;
    next();
  });
};

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash, ...userData } = user;
  res.json({ token, user: userData });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: 'u_' + Date.now(),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: role || 'guest',
    phone: phone || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash, ...userData } = newUser;
  res.status(201).json({ token, user: userData });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...userData } = user;
  res.json({ user: userData });
});

// ----------------------------------------------------
// ROOMS API
// ----------------------------------------------------
app.get('/api/rooms', (req, res) => {
  const { category, minPrice, maxPrice, status, guests, search } = req.query;
  let filtered = [...rooms];

  if (category && category !== 'All') {
    filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }
  if (status && status !== 'All') {
    filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (guests) {
    filtered = filtered.filter(r => r.capacity >= parseInt(guests, 10));
  }
  if (minPrice) {
    filtered = filtered.filter(r => r.pricePerNight >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(r => r.pricePerNight <= parseFloat(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }

  res.json({ count: filtered.length, rooms: filtered });
});

app.get('/api/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

app.post('/api/rooms', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const { name, roomNumber, category, tier, pricePerNight, capacity, features, description, image } = req.body;
  const newRoom = {
    id: 'room-' + Date.now(),
    roomNumber: roomNumber || String(Math.floor(100 + Math.random() * 400)),
    name: name || 'New Boutique Luxury Suite',
    category: category || 'Deluxe Suite',
    tier: tier || 'Premium',
    pricePerNight: Number(pricePerNight) || 250,
    capacity: Number(capacity) || 2,
    sizeSqFt: 480,
    bedType: '1 King Bed',
    floor: 'Floor 3',
    status: 'available',
    rating: 5.0,
    reviewsCount: 1,
    image: image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    gallery: [image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
    features: features || ['Smart TV', 'High-speed Wi-Fi', 'Rain Shower', 'City View'],
    description: description || 'Luxurious modern hospitality suite equipped with premium amenities.'
  };

  rooms.unshift(newRoom);
  res.status(201).json(newRoom);
});

app.patch('/api/rooms/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  room.status = status;
  res.json({ message: 'Room status updated', room });
});

// ----------------------------------------------------
// BOOKINGS API
// ----------------------------------------------------
app.get('/api/bookings', authenticateToken, (req, res) => {
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    return res.json(bookings);
  }
  // If guest, return only their bookings
  const userBookings = bookings.filter(b => b.userId === req.user.id || b.guestEmail === req.user.email);
  res.json(userBookings);
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const {
    roomId,
    checkInDate,
    checkOutDate,
    guestsCount,
    paymentMethod,
    specialRequests
  } = req.body;

  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ error: 'Selected room not found' });

  // Calculate nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 1;

  const subtotal = room.pricePerNight * totalNights;
  const taxesAndFees = Number((subtotal * 0.12).toFixed(2));
  const totalAmount = Number((subtotal + taxesAndFees).toFixed(2));

  const newBooking = {
    id: 'bk-' + Math.floor(1000 + Math.random() * 9000),
    bookingCode: 'HP-' + Math.floor(100000 + Math.random() * 900000),
    userId: req.user.id,
    guestName: req.user.name,
    guestEmail: req.user.email,
    guestPhone: req.body.guestPhone || '+1 (555) 789-0123',
    roomId: room.id,
    roomNumber: room.roomNumber,
    roomName: room.name,
    roomCategory: room.category,
    checkInDate,
    checkOutDate,
    guestsCount: Number(guestsCount) || 1,
    totalNights,
    nightlyRate: room.pricePerNight,
    subtotal,
    taxesAndFees,
    totalAmount,
    paymentStatus: 'paid',
    paymentMethod: paymentMethod || 'Secure Credit Card (Instant)',
    transactionId: 'txn_' + Date.now(),
    status: 'confirmed',
    specialRequests: specialRequests || 'None',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  // Update room status
  room.status = 'occupied';

  // Add system notification
  notifications.unshift({
    id: 'notif-' + Date.now(),
    recipientRole: 'all',
    title: 'New Booking Created',
    message: `${req.user.name} booked ${room.name} (${room.roomNumber}) for ${totalNights} night(s).`,
    time: 'Just now',
    read: false
  });

  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body; // confirmed, checked_in, checked_out, cancelled
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = status;

  // Sync room status if check in/out
  const room = rooms.find(r => r.id === booking.roomId);
  if (room) {
    if (status === 'checked_in') room.status = 'occupied';
    if (status === 'checked_out') room.status = 'cleaning';
    if (status === 'cancelled') room.status = 'available';
  }

  res.json({ message: 'Booking status updated successfully', booking });
});

// ----------------------------------------------------
// SERVICE REQUESTS & HOUSEKEEPING
// ----------------------------------------------------
app.get('/api/services', authenticateToken, (req, res) => {
  res.json(serviceRequests);
});

app.post('/api/services', authenticateToken, (req, res) => {
  const { roomNumber, category, detail } = req.body;
  const newReq = {
    id: 'sr-' + Date.now(),
    roomNumber: roomNumber || '204',
    guestName: req.user.name,
    category: category || 'Housekeeping',
    detail: detail || 'Guest requested assistance',
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  serviceRequests.unshift(newReq);
  res.status(201).json(newReq);
});

app.patch('/api/services/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const sr = serviceRequests.find(s => s.id === req.params.id);
  if (!sr) return res.status(404).json({ error: 'Service request not found' });
  sr.status = status;
  res.json({ message: 'Service status updated', serviceRequest: sr });
});

// ----------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// ----------------------------------------------------
// ANALYTICS / STATS
// ----------------------------------------------------
app.get('/api/stats', authenticateToken, (req, res) => {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning' || r.status === 'maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const activeCheckIns = bookings.filter(b => b.status === 'checked_in').length;
  const pendingRequests = serviceRequests.filter(s => s.status === 'pending').length;

  res.json({
    totalRooms,
    occupiedRooms,
    availableRooms,
    cleaningRooms,
    occupancyRate,
    totalRevenue: Math.round(totalRevenue),
    activeCheckIns,
    pendingRequests,
    totalBookings: bookings.length
  });
});

app.listen(PORT, () => {
  console.log(`🏨 HotelPro / Roomly Backend API running gracefully on port ${PORT}`);
});

import React, { useState } from 'react';
import {
  Sparkles,
  BedDouble,
  ShieldCheck,
  UserCheck,
  Search,
  Calendar,
  Users,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  LogOut,
  Bell,
  Hotel,
  Layers,
  ChevronRight,
  Filter,
  Eye,
  X,
  CreditCard,
  Printer,
  Sparkle,
  PhoneCall,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialRooms, initialBookings, initialServiceRequests, sampleUsers } from './mockData';

export default function App() {
  // App navigation state: 'explore', 'my_bookings', 'staff_portal', 'admin_dashboard', 'room_detail'
  const [activeTab, setActiveTab] = useState('explore');
  const [currentUser, setCurrentUser] = useState(sampleUsers[0]); // default Eleanor (Guest)
  const [rooms, setRooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  const [serviceRequests, setServiceRequests] = useState(initialServiceRequests);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceMax, setPriceMax] = useState(600);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('2026-11-01');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-04');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Invoice Modal
  const [invoiceBooking, setInvoiceBooking] = useState(null);

  // New Room Creation Modal (Admin / Staff)
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    roomNumber: '',
    category: 'Deluxe Suite',
    tier: 'Premium',
    pricePerNight: 280,
    capacity: 2,
    sizeSqFt: 500,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: ''
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Helper calculation for Booking
  const calculateNights = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return isNaN(diff) ? 1 : diff;
  };

  const bookingNights = calculateNights(checkInDate, checkOutDate);
  const bookingSubtotal = bookingRoom ? bookingRoom.pricePerNight * bookingNights : 0;
  const bookingTaxes = Number((bookingSubtotal * 0.12).toFixed(2));
  const bookingTotal = (bookingSubtotal + bookingTaxes).toFixed(2);

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || room.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    const matchesPrice = room.pricePerNight <= priceMax;
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  // Handle Room Booking Submission
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      const newBooking = {
        id: 'bk-' + Math.floor(1000 + Math.random() * 9000),
        bookingCode: 'HP-' + Math.floor(100000 + Math.random() * 900000),
        userId: currentUser.id,
        guestName: currentUser.name,
        guestEmail: currentUser.email,
        guestPhone: currentUser.phone || '+1 (555) 019-2831',
        roomId: bookingRoom.id,
        roomNumber: bookingRoom.roomNumber,
        roomName: bookingRoom.name,
        roomCategory: bookingRoom.category,
        checkInDate,
        checkOutDate,
        guestsCount: guestCount,
        totalNights: bookingNights,
        nightlyRate: bookingRoom.pricePerNight,
        subtotal: bookingSubtotal,
        taxesAndFees: bookingTaxes,
        totalAmount: Number(bookingTotal),
        paymentStatus: 'paid',
        paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : 'Razorpay Express',
        transactionId: 'TXN-' + Date.now().toString().slice(-8),
        status: 'confirmed',
        specialRequests: specialRequests || 'Standard VIP arrival package requested',
        createdAt: new Date().toISOString()
      };

      setBookings([newBooking, ...bookings]);
      
      // Update room to occupied
      setRooms(rooms.map(r => r.id === bookingRoom.id ? { ...r, status: 'occupied' } : r));
      
      setIsProcessingPayment(false);
      setIsBookingModalOpen(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast(`Reservation Confirmed! Reference: ${newBooking.bookingCode}`);
      setInvoiceBooking(newBooking);
    }, 1200);
  };

  // Staff Check-In / Check-Out Actions
  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(b => {
      if (b.id === bookingId) {
        // Also update room status
        if (newStatus === 'checked_in') {
          setRooms(rooms.map(r => r.id === b.roomId ? { ...r, status: 'occupied' } : r));
        } else if (newStatus === 'checked_out') {
          setRooms(rooms.map(r => r.id === b.roomId ? { ...r, status: 'cleaning' } : r));
        } else if (newStatus === 'cancelled') {
          setRooms(rooms.map(r => r.id === b.roomId ? { ...r, status: 'available' } : r));
        }
        return { ...b, status: newStatus };
      }
      return b;
    }));
    showToast(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  const handleUpdateRoomStatus = (roomId, newStatus) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    showToast(`Room status updated to ${newStatus}`);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const created = {
      ...newRoomData,
      id: 'room-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      status: 'available',
      bedType: '1 Custom King Bed',
      floor: 'Level 4 Executive Wing',
      gallery: [newRoomData.image],
      features: ['Balcony View', 'Climate Control', 'Minibar', 'Smart 4K TV']
    };
    setRooms([created, ...rooms]);
    setIsAddRoomModalOpen(false);
    showToast(`Room #${created.roomNumber} added to inventory!`);
  };

  // Role Switcher helper
  const switchRole = (role) => {
    const user = sampleUsers.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      if (role === 'staff') setActiveTab('staff_portal');
      else if (role === 'admin') setActiveTab('admin_dashboard');
      else setActiveTab('explore');
      showToast(`Switched view to ${user.name} (${role.toUpperCase()})`);
    }
  };

  // Analytics Stats
  const totalOccupied = rooms.filter(r => r.status === 'occupied').length;
  const totalAvailable = rooms.filter(r => r.status === 'available').length;
  const totalCleaning = rooms.filter(r => r.status === 'cleaning' || r.status === 'maintenance').length;
  const occupancyRate = Math.round((totalOccupied / rooms.length) * 100);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="app-container">
      {/* TOP NOTIFICATION / PROMO BAR */}
      <div style={{
        background: 'linear-gradient(90deg, #12151c 0%, #202634 100%)',
        color: '#e5e8ef',
        padding: '0.45rem 1rem',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
          <Sparkles size={14} color="#d4af37" />
          <span>Welcome to <strong>HotelPro Grand Hospitality Suite</strong> — Safe, encrypted reservations & 5-star digital concierge</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: '#9ba3af', fontSize: '0.75rem' }}>Demo Role Mode:</span>
          {sampleUsers.map(u => (
            <button
              key={u.role}
              onClick={() => switchRole(u.role)}
              style={{
                background: currentUser.role === u.role ? '#d4af37' : 'rgba(255,255,255,0.12)',
                color: currentUser.role === u.role ? '#111' : '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {u.role}
            </button>
          ))}
        </div>
      </div>

      {/* LUXURY HEADER NAVBAR */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e7eaee',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('explore')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d4af37 0%, #a47b19 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(197, 155, 39, 0.3)'
            }}>
              <Hotel size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontFamily: 'Playfair Display', fontSize: '1.45rem', fontWeight: 700, color: '#12151c', letterSpacing: '-0.02em' }}>HotelPro</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fdf3d8', color: '#977218', borderRadius: '4px', fontWeight: 700 }}>MERN</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#7e8797', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-2px' }}>Resort & Suites</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => { setActiveTab('explore'); setSelectedRoom(null); }}
              className={`btn ${activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              <BedDouble size={16} /> Explore Suites
            </button>

            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`btn ${activeTab === 'my_bookings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              <FileText size={16} /> My Reservations ({bookings.filter(b => b.userId === currentUser.id).length})
            </button>

            {(currentUser.role === 'staff' || currentUser.role === 'admin') && (
              <button
                onClick={() => setActiveTab('staff_portal')}
                className={`btn ${activeTab === 'staff_portal' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                <Layers size={16} /> Staff Operations
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin_dashboard')}
                className={`btn ${activeTab === 'admin_dashboard' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                <TrendingUp size={16} /> Admin Analytics
              </button>
            )}
          </nav>

          {/* User Profile Info & Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37' }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#12151c' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#8891a2', textTransform: 'capitalize' }}>Role: <strong>{currentUser.role}</strong></div>
            </div>
          </div>
        </div>
      </header>

      {/* TOAST MESSAGE BANNER */}
      {toastMessage && (
        <div className="toast-banner">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {/* ============================================================ */}
        {/* VIEW 1: EXPLORE SUITES & GUEST SEARCH */}
        {/* ============================================================ */}
        {activeTab === 'explore' && !selectedRoom && (
          <div>
            {/* HERO BANNER */}
            <div style={{
              background: 'linear-gradient(180deg, #fbf7ee 0%, #fbfbfd 100%)',
              padding: '3.5rem 0 2.5rem',
              borderBottom: '1px solid #f0eada'
            }}>
              <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#9e7616',
                  background: '#faeed0',
                  padding: '0.3rem 0.9rem',
                  borderRadius: '999px',
                  marginBottom: '1rem',
                  letterSpacing: '0.04em'
                }}>
                  <Sparkle size={14} /> EXCLUSIVE FIVE-STAR HOSPITALITY
                </span>
                <h1 style={{ marginBottom: '1rem' }}>
                  Elevate Your Stay with Unmatched Luxury and Serenity
                </h1>
                <p style={{ color: '#5b6475', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Discover meticulously curated suites, bespoke guest amenities, real-time booking confirmation, and transparent rates.
                </p>

                {/* SEARCH BAR WIDGET */}
                <div className="luxury-card" style={{
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-floating)'
                }}>
                  <div>
                    <label className="form-label" style={{ textAlign: 'left' }}>Keywords / Suite</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e6ed', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                      <Search size={16} color="#8d97a8" />
                      <input
                        type="text"
                        placeholder="Penthouse, Ocean, King..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ textAlign: 'left' }}>Category</label>
                    <select
                      className="form-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.875rem' }}
                    >
                      <option value="All">All Categories</option>
                      <option value="Presidential Suite">Presidential Suite</option>
                      <option value="Deluxe Suite">Deluxe Suite</option>
                      <option value="Executive Room">Executive Room</option>
                      <option value="Family Suite">Family Suite</option>
                      <option value="Classic Room">Classic Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ textAlign: 'left' }}>Status</label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.875rem' }}
                    >
                      <option value="All">Any Status</option>
                      <option value="available">Available Now</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ textAlign: 'left' }}>Max Price (${priceMax}/nt)</label>
                    <input
                      type="range"
                      min="150"
                      max="600"
                      step="25"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#c59b27' }}
                    />
                  </div>

                  <button
                    onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setStatusFilter('All'); setPriceMax(600); }}
                    className="btn btn-secondary btn-sm"
                    title="Reset filters"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* ROOMS LISTING GRID */}
            <div className="container" style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <div>
                  <h2>Available Accommodations</h2>
                  <p style={{ color: '#687285', fontSize: '0.9rem' }}>Showing {filteredRooms.length} luxury suites ready for booking</p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['All', 'Presidential Suite', 'Deluxe Suite', 'Executive Room', 'Family Suite'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '999px',
                        border: '1px solid ' + (categoryFilter === cat ? '#c59b27' : '#e0e4ec'),
                        background: categoryFilter === cat ? '#fef8e7' : '#ffffff',
                        color: categoryFilter === cat ? '#977218' : '#4f5767',
                        fontWeight: categoryFilter === cat ? '600' : '500',
                        fontSize: '0.825rem',
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '2rem'
              }}>
                {filteredRooms.map(room => (
                  <div key={room.id} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Image with status badge */}
                    <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                      <img
                        src={room.image}
                        alt={room.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        <span className={`badge badge-${room.status}`}>
                          {room.status === 'available' && <CheckCircle2 size={12} />}
                          {room.status === 'occupied' && <Clock size={12} />}
                          {room.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(18, 21, 28, 0.75)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Star size={13} fill="#fbbf24" color="#fbbf24" />
                        <span>{room.rating}</span>
                        <span style={{ color: '#9ba3af' }}>({room.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c59b27', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Room #{room.roomNumber} • {room.category}
                          </span>
                          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>{room.name}</h3>
                        </div>
                      </div>

                      <p style={{ color: '#687285', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.2rem', flex: 1 }}>
                        {room.description.length > 115 ? room.description.substring(0, 115) + '...' : room.description}
                      </p>

                      {/* Amenities pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        {room.features.slice(0, 3).map((feat, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.72rem',
                            background: '#f4f5f8',
                            color: '#555f70',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 500
                          }}>
                            {feat}
                          </span>
                        ))}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f0f2f6'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#12151c' }}>${room.pricePerNight}</span>
                            <span style={{ fontSize: '0.8rem', color: '#7a8597' }}>/ night</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Taxes & fees included in preview</span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setSelectedRoom(room)}
                            className="btn btn-secondary btn-sm"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              setBookingRoom(room);
                              setIsBookingModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm"
                            disabled={room.status !== 'available'}
                            style={{ opacity: room.status !== 'available' ? 0.6 : 1 }}
                          >
                            {room.status === 'available' ? 'Book Now' : 'Reserved'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: ROOM DETAILS MODAL / PAGE */}
        {/* ============================================================ */}
        {selectedRoom && (
          <div className="container" style={{ paddingTop: '2.5rem' }}>
            <button
              onClick={() => setSelectedRoom(null)}
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: '1.5rem' }}
            >
              ← Back to Room Directory
            </button>

            <div className="luxury-card" style={{ padding: '2rem', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                <div>
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1rem' }}
                  />
                  {selectedRoom.gallery && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {selectedRoom.gallery.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Gallery thumbnail"
                          style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #e0e4ec' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${selectedRoom.status}`}>{selectedRoom.status}</span>
                    <span style={{ fontSize: '0.8rem', color: '#c59b27', fontWeight: 700 }}>Suite #{selectedRoom.roomNumber}</span>
                  </div>

                  <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedRoom.name}</h1>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#687285', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={15} fill="#fbbf24" color="#fbbf24" /> {selectedRoom.rating} ({selectedRoom.reviewsCount} verified reviews)
                    </span>
                    <span>•</span>
                    <span>{selectedRoom.bedType}</span>
                    <span>•</span>
                    <span>{selectedRoom.sizeSqFt} sq ft</span>
                  </div>

                  <p style={{ color: '#4d5666', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                    {selectedRoom.description}
                  </p>

                  <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Signature Features & Amenities</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '2rem' }}>
                    {selectedRoom.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#374151' }}>
                        <CheckCircle2 size={15} color="#c59b27" /> {feat}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '1.25rem',
                    background: '#fcfaf4',
                    border: '1px solid #ebd99f',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#12151c' }}>
                        ${selectedRoom.pricePerNight} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#6b7280' }}>/ night</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Best price guarantee • Free cancellation up to 48 hrs</span>
                    </div>

                    <button
                      onClick={() => {
                        setBookingRoom(selectedRoom);
                        setIsBookingModalOpen(true);
                      }}
                      className="btn btn-primary"
                      disabled={selectedRoom.status !== 'available'}
                    >
                      {selectedRoom.status === 'available' ? 'Reserve Suite' : 'Currently Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: GUEST BOOKINGS & INVOICES */}
        {/* ============================================================ */}
        {activeTab === 'my_bookings' && (
          <div className="container" style={{ paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h2>My Hospitality Itinerary</h2>
                <p style={{ color: '#687285', fontSize: '0.9rem' }}>Review all current and past stays, view digital hotel pass and invoices</p>
              </div>
              <button onClick={() => setActiveTab('explore')} className="btn btn-primary btn-sm">
                + Book Another Suite
              </button>
            </div>

            {bookings.filter(b => b.userId === currentUser.id).length === 0 ? (
              <div className="luxury-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <BedDouble size={48} color="#d4af37" style={{ margin: '0 auto 1rem' }} />
                <h3>No active reservations found</h3>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You haven't placed any bookings under this profile yet.</p>
                <button onClick={() => setActiveTab('explore')} className="btn btn-primary">
                  Explore Suites
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {bookings.filter(b => b.userId === currentUser.id).map(booking => (
                  <div key={booking.id} className="luxury-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: '#fbf5e5',
                        border: '1px solid #ecdca8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Hotel size={28} color="#b3881e" />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{booking.roomName}</span>
                          <span className={`badge badge-${booking.status}`}>{booking.status.replace('_', ' ')}</span>
                          <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#4b5563' }}>
                            Conf: #{booking.bookingCode}
                          </span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          📅 <strong>Check-In:</strong> {booking.checkInDate} &nbsp;→&nbsp; <strong>Check-Out:</strong> {booking.checkOutDate} ({booking.totalNights} nights) • {booking.guestsCount} Guests
                        </p>
                        <p style={{ color: '#8d97a8', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                          Special Requests: {booking.specialRequests}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#12151c' }}>${booking.totalAmount}</span>
                        <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Payment Paid: {booking.paymentMethod}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setInvoiceBooking(booking)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Printer size={14} /> Receipt / Invoice
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626' }}
                          >
                            Cancel Stay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: STAFF DASHBOARD & HOUSEKEEPING */}
        {/* ============================================================ */}
        {activeTab === 'staff_portal' && (
          <div className="container" style={{ paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h2>Front Desk & Housekeeping Operations</h2>
                <p style={{ color: '#687285', fontSize: '0.9rem' }}>Real-time check-in desk, turnover cleaning status, and in-room service requests</p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#065f46', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600 }}>
                  Active Guests Checked In: {bookings.filter(b => b.status === 'checked_in').length}
                </span>
                <span style={{ fontSize: '0.8rem', background: '#fffbeb', color: '#92400e', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600 }}>
                  Rooms in Turnover: {totalCleaning}
                </span>
              </div>
            </div>

            {/* TABBED CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              {/* RESERVATIONS & CHECK IN DESK */}
              <div>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={20} color="#c59b27" /> Guest Check-In & Departure Desk
                </h3>
                <div className="luxury-card" style={{ padding: '1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e8ef', color: '#717b8c' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Code</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Guest & Suite</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Dates</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #f4f5f8' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>#{b.bookingCode.slice(-4)}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#111827' }}>{b.guestName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Room {b.roomNumber} • {b.roomCategory}</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#4b5563' }}>
                            {b.checkInDate.slice(5)} to {b.checkOutDate.slice(5)}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                            {b.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'checked_in')}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                              >
                                Check In
                              </button>
                            )}
                            {b.status === 'checked_in' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'checked_out')}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                              >
                                Check Out
                              </button>
                            )}
                            {b.status === 'checked_out' && (
                              <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROOM STATUS & TURNOVER CHANGER */}
              <div>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="#c59b27" /> Room Status & Housekeeping
                </h3>
                <div className="luxury-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {rooms.map(room => (
                      <div key={room.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: '#fbfbfd',
                        borderRadius: '8px',
                        border: '1px solid #eceef3'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Room {room.roomNumber} - {room.name.slice(0, 22)}...</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Floor: {room.floor}</div>
                        </div>

                        <select
                          className="form-select"
                          value={room.status}
                          onChange={(e) => handleUpdateRoomStatus(room.id, e.target.value)}
                          style={{
                            width: 'auto',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="cleaning">Cleaning</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GUEST IN-ROOM SERVICES */}
                <h3 style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Coffee size={20} color="#c59b27" /> Guest In-Room Requests
                </h3>
                <div className="luxury-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {serviceRequests.map(sr => (
                      <div key={sr.id} style={{
                        padding: '0.75rem',
                        borderLeft: `3px solid ${sr.status === 'completed' ? '#10b981' : '#f59e0b'}`,
                        background: '#fafbfc',
                        borderRadius: '0 8px 8px 0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                          <span>Room {sr.roomNumber} ({sr.guestName})</span>
                          <span style={{ color: sr.status === 'completed' ? '#059669' : '#d97706' }}>{sr.status}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '0.25rem' }}>{sr.detail}</p>
                        {sr.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setServiceRequests(serviceRequests.map(s => s.id === sr.id ? { ...s, status: 'completed' } : s));
                              showToast('Request marked as completed');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: '0.5rem', fontSize: '0.7rem', padding: '2px 8px' }}
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: ADMIN DASHBOARD & REVENUE ANALYTICS */}
        {/* ============================================================ */}
        {activeTab === 'admin_dashboard' && (
          <div className="container" style={{ paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h2>Executive General Manager Dashboard</h2>
                <p style={{ color: '#687285', fontSize: '0.9rem' }}>Occupancy analytics, RevPAR, real-time inventory management, and platform audit</p>
              </div>

              <button
                onClick={() => setIsAddRoomModalOpen(true)}
                className="btn btn-primary"
              >
                <PlusCircle size={16} /> Add Suite to Inventory
              </button>
            </div>

            {/* KPI METRIC CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              <div className="luxury-card" style={{ padding: '1.5rem', borderTop: '4px solid #c59b27' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#687285' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>TOTAL REVENUE</span>
                  <DollarSign size={20} color="#c59b27" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12151c', marginTop: '0.5rem' }}>
                  ${totalRevenue.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>+18.4% vs last cycle</span>
              </div>

              <div className="luxury-card" style={{ padding: '1.5rem', borderTop: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#687285' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>OCCUPANCY RATE</span>
                  <TrendingUp size={20} color="#3b82f6" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12151c', marginTop: '0.5rem' }}>
                  {occupancyRate}%
                </div>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>{totalOccupied} of {rooms.length} suites occupied</span>
              </div>

              <div className="luxury-card" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#687285' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>AVAILABLE SUITES</span>
                  <BedDouble size={20} color="#10b981" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12151c', marginTop: '0.5rem' }}>
                  {totalAvailable}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Ready for immediate booking</span>
              </div>

              <div className="luxury-card" style={{ padding: '1.5rem', borderTop: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#687285' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>TOTAL RESERVATIONS</span>
                  <FileText size={20} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12151c', marginTop: '0.5rem' }}>
                  {bookings.length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>All encrypted via JWT</span>
              </div>
            </div>

            {/* OCCUPANCY BREAKDOWN & INVENTORY TABLE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Room Inventory & Pricing Matrix</h3>
                <div className="luxury-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e8ef', color: '#717b8c' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Room #</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Name & Category</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Nightly Rate</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Capacity</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f4f5f8' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>#{r.roomNumber}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#12151c' }}>{r.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{r.category} ({r.tier})</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>${r.pricePerNight}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{r.capacity} Guests</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`badge badge-${r.status}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECURITY & AUDIT LOG */}
              <div>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="#10b981" /> Security & Audit Log
                </h3>
                <div className="luxury-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {[
                      { event: 'JWT Token verified for Victoria Hawthorne (admin)', time: '2 mins ago', status: 'success' },
                      { event: 'Payment verified: TXN-771829031 via Razorpay', time: '14 mins ago', status: 'success' },
                      { event: 'Rate updated for Grand Horizon Penthouse to $480', time: '1 hr ago', status: 'info' },
                      { event: 'Housekeeping dispatched to Room 204', time: '2 hrs ago', status: 'info' },
                      { event: 'Daily system health backup completed (0 err)', time: '4 hrs ago', status: 'success' }
                    ].map((log, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: log.status === 'success' ? '#10b981' : '#3b82f6',
                          marginTop: '5px'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#1f2937', fontWeight: 500 }}>{log.event}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>{log.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: INSTANT ROOM BOOKING & PAYMENT */}
      {/* ============================================================ */}
      {isBookingModalOpen && bookingRoom && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c59b27', letterSpacing: '0.04em' }}>STEP 1 OF 1 • INSTANT CONFIRMATION</span>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>Reserve {bookingRoom.name}</h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#687285' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div style={{
                background: '#fcfaf4',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #ebd99f',
                marginBottom: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <img
                  src={bookingRoom.image}
                  alt={bookingRoom.name}
                  style={{ width: '90px', height: '65px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Suite #{bookingRoom.roomNumber} - {bookingRoom.category}</div>
                  <div style={{ fontSize: '0.8rem', color: '#687285' }}>${bookingRoom.pricePerNight} per night • Max {bookingRoom.capacity} Guests</div>
                </div>
              </div>

              {/* DATES & GUEST SELECTION */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Check-In Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Check-Out Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Guests</label>
                  <select
                    className="form-select"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].slice(0, bookingRoom.capacity).map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Requests (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Late arrival, high floor, anniversary champagne..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {/* PAYMENT SELECTION */}
              <div className="form-group">
                <label className="form-label">Payment Processing Gateway</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: '1px solid ' + (paymentMethod === 'card' ? '#c59b27' : '#e0e4ec'),
                    borderRadius: '8px',
                    background: paymentMethod === 'card' ? '#fdfbf4' : '#fff',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={18} color="#c59b27" /> Credit / Debit Card
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: '1px solid ' + (paymentMethod === 'razorpay' ? '#c59b27' : '#e0e4ec'),
                    borderRadius: '8px',
                    background: paymentMethod === 'razorpay' ? '#fdfbf4' : '#fff',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    <Sparkles size={18} color="#c59b27" /> Razorpay / UPI Instant
                  </label>
                </div>
              </div>

              {/* PRICE SUMMARY */}
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#4b5563' }}>
                  <span>${bookingRoom.pricePerNight} × {bookingNights} night(s)</span>
                  <span>${bookingSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#4b5563' }}>
                  <span>State Hospitality Taxes & Service Fees (12%)</span>
                  <span>${bookingTaxes}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #e2e8f0',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#0f172a'
                }}>
                  <span>Total Amount</span>
                  <span>${bookingTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Securing Reservation with JWT...' : `Confirm & Pay $${bookingTotal}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: PRINTABLE INVOICE / RECEIPT */}
      {/* ============================================================ */}
      {invoiceBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2.5rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #111827', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: '#111827' }}>HotelPro</h2>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>OFFICIAL HOSPITALITY TAX INVOICE</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700 }}>Invoice #{invoiceBooking.bookingCode}</div>
                <div style={{ color: '#6b7280' }}>Date: {new Date(invoiceBooking.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div>
                <strong style={{ color: '#374151' }}>Guest Details:</strong>
                <div>{invoiceBooking.guestName}</div>
                <div style={{ color: '#6b7280' }}>{invoiceBooking.guestEmail}</div>
                <div style={{ color: '#6b7280' }}>{invoiceBooking.guestPhone}</div>
              </div>
              <div>
                <strong style={{ color: '#374151' }}>Stay Information:</strong>
                <div>Room #{invoiceBooking.roomNumber} - {invoiceBooking.roomName}</div>
                <div style={{ color: '#6b7280' }}>{invoiceBooking.checkInDate} to {invoiceBooking.checkOutDate} ({invoiceBooking.totalNights} nights)</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.6rem', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '0.6rem', textAlign: 'center' }}>Rate</th>
                  <th style={{ padding: '0.6rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem' }}>Suite Accommodation ({invoiceBooking.roomCategory})</td>
                  <td style={{ padding: '0.6rem', textAlign: 'center' }}>${invoiceBooking.nightlyRate}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'center' }}>{invoiceBooking.totalNights}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right' }}>${invoiceBooking.subtotal.toFixed(2)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem' }}>Hospitality Tax & Tourism Cess (12%)</td>
                  <td style={{ padding: '0.6rem', textAlign: 'center' }}>12%</td>
                  <td style={{ padding: '0.6rem', textAlign: 'center' }}>1</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right' }}>${invoiceBooking.taxesAndFees}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 800, fontSize: '1rem', borderTop: '2px solid #e5e7eb' }}>
                  <td colSpan="3" style={{ padding: '0.75rem 0.6rem' }}>Grand Total Paid</td>
                  <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', color: '#c59b27' }}>${invoiceBooking.totalAmount}</td>
                </tr>
              </tfoot>
            </table>

            <div style={{
              background: '#ecfdf5',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.8rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} /> Payment Verified via {invoiceBooking.paymentMethod} (Txn: {invoiceBooking.transactionId})
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
              >
                <Printer size={15} /> Print Invoice
              </button>
              <button
                onClick={() => setInvoiceBooking(null)}
                className="btn btn-primary btn-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ADD NEW SUITE INVENTORY (ADMIN) */}
      {/* ============================================================ */}
      {isAddRoomModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3>Add New Suite to Inventory</h3>
              <button onClick={() => setIsAddRoomModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 502"
                    required
                    value={newRoomData.roomNumber}
                    onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newRoomData.category}
                    onChange={(e) => setNewRoomData({ ...newRoomData, category: e.target.value })}
                  >
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Deluxe Suite">Deluxe Suite</option>
                    <option value="Executive Room">Executive Room</option>
                    <option value="Family Suite">Family Suite</option>
                    <option value="Classic Room">Classic Room</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Suite Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Royal Crown Terrace Suite"
                  required
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nightly Rate ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newRoomData.pricePerNight}
                    onChange={(e) => setNewRoomData({ ...newRoomData, pricePerNight: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Guest Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newRoomData.capacity}
                    onChange={(e) => setNewRoomData({ ...newRoomData, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={newRoomData.image}
                  onChange={(e) => setNewRoomData({ ...newRoomData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Briefly describe the view, bed type, and amenities..."
                  value={newRoomData.description}
                  onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Create & Publish Suite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e7eaee',
        padding: '2.5rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#687285' }}>
          <div>
            <span style={{ fontWeight: 700, color: '#12151c' }}>HotelPro / Roomly</span> © 2026. Built with modern MERN Architecture.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>🔒 256-bit SSL Data Encryption</span>
            <span>💳 Stripe & Razorpay Certified</span>
            <span>⚡ Real-Time Availability Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

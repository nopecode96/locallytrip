'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminContext';
import AdminNavbar from '@/components/AdminNavbar';

// Sample data for demonstration
const sampleBookings = [
  {
    id: 'BK001',
    experienceTitle: 'Balinese Cooking Class',
    traveller: 'John Smith',
    host: 'Maria Garcia',
    date: '2024-02-15',
    guests: 2,
    totalAmount: 150,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-01-20'
  },
  {
    id: 'BK002',
    experienceTitle: 'Bangkok Street Food Tour',
    traveller: 'Sarah Johnson',
    host: 'Somchai Thai',
    date: '2024-02-18',
    guests: 1,
    totalAmount: 85,
    status: 'pending',
    paymentStatus: 'pending',
    bookingDate: '2024-01-22'
  },
  {
    id: 'BK003',
    experienceTitle: 'Mountain Hiking Adventure',
    traveller: 'Mike Wilson',
    host: 'Ram Sherpa',
    date: '2024-02-10',
    guests: 4,
    totalAmount: 320,
    status: 'completed',
    paymentStatus: 'paid',
    bookingDate: '2024-01-15'
  }
];

const BookingsPage = () => {
  const { user } = useAdminAuth();
  const [bookings, setBookings] = useState(sampleBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');

  // Check if user has permission to manage bookings
  if (!user || !['super_admin', 'admin', 'finance'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.experienceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.traveller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesPayment = selectedPaymentStatus === 'all' || booking.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const handlePaymentStatusChange = (bookingId: string, newPaymentStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, paymentStatus: newPaymentStatus }
        : booking
    ));
  };

  const totalRevenue = bookings.reduce((sum, booking) => 
    booking.paymentStatus === 'paid' ? sum + booking.totalAmount : sum, 0
  );

  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bookings & Payments</h1>
              <p className="text-gray-600 mt-1">Manage bookings and payment transactions</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Export Report
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Manual Booking
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{bookings.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl">📅</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${totalRevenue}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{pendingPayments}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <span className="text-white text-xl">⏳</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{completedBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Bookings</label>
                <input
                  type="text"
                  placeholder="Search by ID, experience, or traveller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traveller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                        <div className="text-sm text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.experienceTitle}</div>
                        <div className="text-sm text-gray-500">Host: {booking.host}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.traveller}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                          
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Confirm
                            </button>
                          )}
                          
                          {booking.paymentStatus === 'pending' && (
                            <button 
                              onClick={() => handlePaymentStatusChange(booking.id, 'paid')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Mark Paid
                            </button>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Complete
                            </button>
                          )}
                          
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📅</div>
                <p className="text-gray-500">No bookings found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;

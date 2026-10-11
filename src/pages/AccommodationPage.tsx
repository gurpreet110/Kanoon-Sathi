import { useState } from 'react';
import { Search, MapPin, Building, Star, CheckCircle, Clock } from 'lucide-react';

interface Accommodation {
  id: string;
  name: string;
  type: 'PG' | 'Flat' | 'Hostel';
  distance: string;
  rating: number;
  vacancies: number;
  price: string;
  address: string;
  amenities: string[];
}

const MOCK_ACCOMMODATIONS: Accommodation[] = [
  {
    id: '1',
    name: 'Sunrise PG for Students',
    type: 'PG',
    distance: '0.5 km from Campus',
    rating: 4.5,
    vacancies: 3,
    price: '₹8,000/month',
    address: '123 University Road, Knowledge Park',
    amenities: ['Wi-Fi', 'AC', 'Meals Included', 'Laundry'],
  },
  {
    id: '2',
    name: 'Green View Apartments',
    type: 'Flat',
    distance: '1.2 km from Campus',
    rating: 4.2,
    vacancies: 1,
    price: '₹15,000/month',
    address: '45 Green Valley, Sector 4',
    amenities: ['Fully Furnished', 'Power Backup', 'Gym', 'Parking'],
  },
  {
    id: '3',
    name: 'Elite Boys Hostel',
    type: 'Hostel',
    distance: '0.8 km from Campus',
    rating: 4.0,
    vacancies: 5,
    price: '₹6,500/month',
    address: '78 Student Alley',
    amenities: ['Wi-Fi', 'Library', 'Security 24/7'],
  }
];

export function AccommodationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredAccommodations = MOCK_ACCOMMODATIONS.filter(acc => 
    (typeFilter === 'All' || acc.type === typeFilter) &&
    (acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || acc.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative overflow-hidden bg-background-light dark:bg-background-dark min-h-screen text-gray-800 dark:text-gray-200">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary-600/10 dark:bg-primary-600/5 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-800/10 dark:bg-blue-800/5 rounded-full filter blur-[90px] animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="app-container relative z-10 py-12 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white dark:bg-gradient-to-r dark:from-white dark:to-blue-200 dark:bg-clip-text dark:text-transparent mb-4">
            Nearby Accommodation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the perfect PG, flat, or hostel near your location. View real-time vacancies and book your stay securely.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-lg mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {['All', 'PG', 'Flat', 'Hostel'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid and Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Listings */}
          <div className="lg:col-span-2 space-y-4">
            {filteredAccommodations.length > 0 ? (
              filteredAccommodations.map((acc) => (
                <div key={acc.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-primary-500/50 transition-all shadow-sm hover:shadow-md group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                          {acc.type}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{acc.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        {acc.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <MapPin size={14} />
                        {acc.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
                        {acc.price}
                      </div>
                      <div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                        acc.vacancies > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {acc.vacancies > 0 ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {acc.vacancies > 0 ? `${acc.vacancies} Vacancies` : 'Full'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {acc.amenities.map(amenity => (
                      <span key={amenity} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <Building size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No accommodations found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Interactive Map (Placeholder) */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden h-[500px] lg:h-auto flex flex-col relative shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-primary-500" />
                Live Map View
              </h3>
            </div>
            <div className="flex-grow bg-blue-50/50 dark:bg-blue-950/20 relative flex items-center justify-center p-6">
              {/* Fake Map Background */}
              <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
              
              <div className="text-center relative z-10">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20 animate-bounce">
                  <MapPin size={28} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Interactive Map Area</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Map integration will load available PGs and Flats with their precise locations.
                </p>
                <button className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Enable Location Services
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

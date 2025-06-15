import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Plus, Filter,
  Bell, Trash2, Edit, DollarSign,
  MapPin, Clock, Tag, ChevronDown
} from 'lucide-react';
import Loading from '@/utils/Loading'

export default function Events({ session, setActiveTab }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [events, setEvents] = useState([]);
  const [x, y] = useState(true)

  const filteredEvents = events
    .filter(event => filterType === 'all' || event.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_At) - new Date(a.created_At);
      } else if (sortBy === 'montant') {
        return parseFloat(b.depenses.montant) - parseFloat(a.depenses.montant);
      } else {
        return a.titre.localeCompare(b.titre);
      }
    });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/evenements/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        y(false)
      }
    };

    fetchEvents();
  }, []);

  if (x) {
    return (
      <div className='w-screen flex justify-center items-center maxtop'>
        <Loading />
      </div>
    )
  }

  return (
    <div className="pt-4 pb-16 md:px-22" dir="rtl">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-amber-200 rounded-lg py-2 pr-4 pl-10 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">ترتيب حسب التاريخ</option>
              <option value="montant">ترتيب حسب التكلفة</option>
              <option value="titre">ترتيب حسب العنوان</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-amber-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 border border-amber-100"
          >
            {/* Header */}
            <div className="p-5 border-b border-amber-100 bg-amber-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{event.titre}</h3>
                  <div className="flex items-center text-sm text-amber-700 mt-1">
                    <Calendar className="w-4 h-4 ml-1" />
                    <span>{new Date(event.created_At).toLocaleDateString('ar-EG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                {new Date(event.created_At) > new Date() &&
                  <div className='px-1 py-2 rounded-lg bg-gray-600'>
                    ماضي
                  </div>
                }
              </div>
            </div>

            {/* Image */}
            <div className="aspect-w-16 aspect-h-9 bg-amber-50">
              <img
                src={event.img ? atob(event.img.split(',')[1]) : "formation.jpg"}
                alt={event.titre}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-700">{event.descr}</p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 ml-2 text-amber-600" />
                  <span>{event.lieu}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 ml-2 text-amber-600" />
                  <span className="capitalize">{event.type || 'غير محدد'}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 ml-2 text-amber-600" />
                  <span>{event.participants || 'مفتوح للجميع'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-700">
          <Calendar className="w-16 h-16 text-amber-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">لم يتم العثور على أحداث</h3>
          <p className="text-gray-500 max-w-md mb-4">
            لا توجد أحداث تطابق معايير البحث الحالية.
          </p>
          <button
            className="bg-amber-100 text-amber-800 px-5 py-2 rounded-lg hover:bg-amber-200 transition-colors"
            onClick={() => {
              setSortBy('date');
              setFilterType('all');
            }}
          >
            إعادة تعيين المرشحات
          </button>
        </div>
      )}
    </div>
  );
}
import type { City, Locality } from '@/types/location.types'

export const MOCK_CITIES: City[] = [
  { id: 'city-01', name: 'Gurugram', state: 'Haryana', userCount: 843, localityCount: 12 },
  { id: 'city-02', name: 'Bengaluru', state: 'Karnataka', userCount: 762, localityCount: 15 },
  { id: 'city-03', name: 'Mumbai', state: 'Maharashtra', userCount: 654, localityCount: 18 },
  { id: 'city-04', name: 'Delhi', state: 'Delhi', userCount: 598, localityCount: 14 },
  { id: 'city-05', name: 'Hyderabad', state: 'Telangana', userCount: 421, localityCount: 9 },
  { id: 'city-06', name: 'Pune', state: 'Maharashtra', userCount: 389, localityCount: 10 },
  { id: 'city-07', name: 'Chennai', state: 'Tamil Nadu', userCount: 356, localityCount: 11 },
  { id: 'city-08', name: 'Noida', state: 'Uttar Pradesh', userCount: 287, localityCount: 7 },
]

export const MOCK_LOCALITIES: Locality[] = [
  { id: 'loc-01', name: 'Cyber City', cityId: 'city-01', cityName: 'Gurugram', userCount: 214 },
  { id: 'loc-02', name: 'DLF Phase 2', cityId: 'city-01', cityName: 'Gurugram', userCount: 187 },
  { id: 'loc-03', name: 'Sector 62', cityId: 'city-01', cityName: 'Gurugram', userCount: 96 },
  { id: 'loc-04', name: 'Indiranagar', cityId: 'city-02', cityName: 'Bengaluru', userCount: 178 },
  { id: 'loc-05', name: 'Whitefield', cityId: 'city-02', cityName: 'Bengaluru', userCount: 154 },
  { id: 'loc-06', name: 'Andheri West', cityId: 'city-03', cityName: 'Mumbai', userCount: 142 },
  { id: 'loc-07', name: 'Bandra', cityId: 'city-03', cityName: 'Mumbai', userCount: 128 },
  { id: 'loc-08', name: 'Lajpat Nagar', cityId: 'city-04', cityName: 'Delhi', userCount: 121 },
  { id: 'loc-09', name: 'Madhapur', cityId: 'city-05', cityName: 'Hyderabad', userCount: 118 },
  { id: 'loc-10', name: 'Baner', cityId: 'city-06', cityName: 'Pune', userCount: 104 },
  { id: 'loc-11', name: 'OMR', cityId: 'city-07', cityName: 'Chennai', userCount: 99 },
  { id: 'loc-12', name: 'Satellite', cityId: 'city-08', cityName: 'Noida', userCount: 87 },
]

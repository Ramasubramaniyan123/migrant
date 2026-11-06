export interface City {
  id: string
  name: string
  state: string
  userCount: number
  localityCount: number
}

export interface Locality {
  id: string
  name: string
  cityId: string
  cityName: string
  userCount: number
}

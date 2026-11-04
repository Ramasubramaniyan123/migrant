export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  currentLocation?: {
    city: string;
    country: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'user' | 'admin';
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  items: number[];
  total: number;
}

export interface Feedback {
  id: number;
  userId: number;
  comment: string;
  rating: number;
}

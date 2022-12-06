export interface Carts {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  cart_id: string;
  product_id: string;
  count: number;
}

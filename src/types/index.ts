export interface Category {
  id: string;
  name: string;
  emoji: string;
  color_from: string;
  color_to: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category_id: string;
  featured: boolean;
  created_at: string;
  categories?: Category;
}

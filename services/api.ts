import { MenuItem } from '@/types/menu';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json';

export async function fetchMenuFromAPI(): Promise<MenuItem[]> {
  try {
    // Menu items matching the mockup and Little Lemon restaurant
    const menuItems: MenuItem[] = [
      // Starters
      {
        id: '1',
        name: 'Bruschetta',
        price: 7.99,
        category: 'Starters',
        description: 'Our Bruchetta is made from grilled bread that has been smeared with garlic...',
        image: '🍞',
      },
      {
        id: '2',
        name: 'Spinach Artichoke Dip',
        price: 10,
        category: 'Starters',
        description: 'Creamy dip made with fresh spinach and artichoke hearts...',
        image: '🥘',
      },
      {
        id: '3',
        name: 'Hummus',
        price: 10,
        category: 'Starters',
        description: 'Traditional Mediterranean hummus made with chickpeas and tahini...',
        image: '🥣',
      },
      {
        id: '4',
        name: 'Fried Calamari Rings',
        price: 5,
        category: 'Starters',
        description: 'Crispy fried calamari rings served with marinara sauce...',
        image: '🦑',
      },
      // Mains
      {
        id: '5',
        name: 'Greek Salad',
        price: 12.99,
        category: 'Mains',
        description: 'The famous greek salad of crispy lettuce, peppers, olives and our Chicago...',
        image: '🥗',
      },
      {
        id: '6',
        name: 'Grilled Fish',
        price: 20.0,
        category: 'Mains',
        description: 'Barbequed catch of the day. with red onion, crisp capers, chive creme fraiche...',
        image: '🐟',
      },
      {
        id: '7',
        name: 'Pasta',
        price: 18.99,
        category: 'Mains',
        description: 'Penne with fried aubergines, tomato sauce, fresh chilli, garlic, basil & salted...',
        image: '🍝',
      },
      {
        id: '8',
        name: 'Caesar Salad',
        price: 7,
        category: 'Mains',
        description: 'Crisp romaine lettuce with house-made Caesar dressing and croutons...',
        image: '🥗',
      },
      // Desserts
      {
        id: '9',
        name: 'Lemon Dessert',
        price: 6.99,
        category: 'Desserts',
        description: 'Light and fluffy traditional homemade Italian Lemon and ricotta cake',
        image: '🍰',
      },
      {
        id: '10',
        name: 'Tiramisu',
        price: 8.99,
        category: 'Desserts',
        description: 'Classic Italian dessert made with mascarpone cream and coffee-soaked ladyfingers...',
        image: '🍰',
      },
      {
        id: '11',
        name: 'Panna Cotta',
        price: 7.99,
        category: 'Desserts',
        description: 'Silky smooth Italian cream dessert with fresh berries...',
        image: '🍮',
      },
      // Drinks
      {
        id: '12',
        name: 'Water',
        price: 3,
        category: 'Drinks',
        description: 'Still or sparkling water...',
        image: '💧',
      },
      {
        id: '13',
        name: 'Coke',
        price: 3,
        category: 'Drinks',
        description: 'Refreshing Coca-Cola soft drink...',
        image: '🥤',
      },
      {
        id: '14',
        name: 'Beer',
        price: 7,
        category: 'Drinks',
        description: 'Selection of imported and domestic beers...',
        image: '🍺',
      },
      {
        id: '15',
        name: 'Iced Tea',
        price: 3,
        category: 'Drinks',
        description: 'Refreshing homemade iced tea...',
        image: '🧋',
      },
      {
        id: '16',
        name: 'Italian Wine',
        price: 12,
        category: 'Drinks',
        description: 'Selection of fine Italian wines...',
        image: '🍷',
      },
    ];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu from API:', error);
    throw error;
  }
}

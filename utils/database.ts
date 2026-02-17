import * as SQLite from 'expo-sqlite';
import { MenuItem, UserProfile } from '@/types/menu';

const DATABASE_NAME = 'little_lemon.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        image TEXT
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT,
        email TEXT NOT NULL,
        phoneNumber TEXT,
        avatar TEXT,
        orderStatusesNotification INTEGER DEFAULT 1,
        passwordChangesNotification INTEGER DEFAULT 1,
        specialOffersNotification INTEGER DEFAULT 1,
        newsletterNotification INTEGER DEFAULT 1
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS onboarding (
        id TEXT PRIMARY KEY NOT NULL,
        completed INTEGER DEFAULT 0,
        firstName TEXT,
        email TEXT
      );
    `);
    
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function saveMenuItems(menuItems: MenuItem[]) {
  if (!db) {
    await initDatabase();
  }
  
  try {
    // Clear existing data
    await db!.execAsync('DELETE FROM menu;');
    
    // Insert new data
    for (const item of menuItems) {
      await db!.runAsync(
        'INSERT INTO menu (id, name, price, category, description, image) VALUES (?, ?, ?, ?, ?, ?);',
        [item.id, item.name, item.price, item.category, item.description || '', item.image || '']
      );
    }
    
    console.log('Menu items saved to database');
  } catch (error) {
    console.error('Error saving menu items:', error);
    throw error;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const result = await db!.getAllAsync<MenuItem>('SELECT * FROM menu;');
    return result;
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
}

export async function filterByCategory(category: string): Promise<MenuItem[]> {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const result = await db!.getAllAsync<MenuItem>(
      'SELECT * FROM menu WHERE category = ?;',
      [category]
    );
    return result;
  } catch (error) {
    console.error('Error filtering by category:', error);
    throw error;
  }
}

export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const result = await db!.getAllAsync<MenuItem>(
      'SELECT * FROM menu WHERE name LIKE ? COLLATE NOCASE;',
      [`%${query}%`]
    );
    return result;
  } catch (error) {
    console.error('Error searching menu items:', error);
    throw error;
  }
}

// User Profile functions
export async function saveUserProfile(profile: UserProfile) {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const id = profile.id || 'user_1';
    await db!.runAsync(
      `INSERT OR REPLACE INTO user_profile 
       (id, firstName, lastName, email, phoneNumber, avatar, 
        orderStatusesNotification, passwordChangesNotification, 
        specialOffersNotification, newsletterNotification) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        profile.firstName,
        profile.lastName || '',
        profile.email,
        profile.phoneNumber || '',
        profile.avatar || '',
        profile.orderStatusesNotification ? 1 : 0,
        profile.passwordChangesNotification ? 1 : 0,
        profile.specialOffersNotification ? 1 : 0,
        profile.newsletterNotification ? 1 : 0,
      ]
    );
    console.log('User profile saved');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const result = await db!.getFirstAsync<any>(
      'SELECT * FROM user_profile WHERE id = ?',
      ['user_1']
    );
    
    if (!result) return null;
    
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName || '',
      email: result.email,
      phoneNumber: result.phoneNumber || '',
      avatar: result.avatar || '',
      orderStatusesNotification: result.orderStatusesNotification === 1,
      passwordChangesNotification: result.passwordChangesNotification === 1,
      specialOffersNotification: result.specialOffersNotification === 1,
      newsletterNotification: result.newsletterNotification === 1,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Onboarding functions
export async function checkOnboardingStatus(): Promise<boolean> {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const result = await db!.getFirstAsync<any>(
      'SELECT completed FROM onboarding WHERE id = ?',
      ['onboarding_1']
    );
    return result?.completed === 1 || false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function completeOnboarding(firstName: string, email: string) {
  if (!db) {
    await initDatabase();
  }
  
  try {
    await db!.runAsync(
      `INSERT OR REPLACE INTO onboarding (id, completed, firstName, email) 
       VALUES (?, ?, ?, ?)`,
      ['onboarding_1', 1, firstName, email]
    );
    
    // Also save as user profile
    await saveUserProfile({
      firstName,
      lastName: '',
      email,
      orderStatusesNotification: true,
      passwordChangesNotification: true,
      specialOffersNotification: true,
      newsletterNotification: true,
    });
    
    console.log('Onboarding completed');
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

export async function resetOnboarding() {
  if (!db) {
    await initDatabase();
  }
  
  try {
    await db!.runAsync(
      'DELETE FROM onboarding WHERE id = ?',
      ['onboarding_1']
    );
    console.log('Onboarding reset');
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    throw error;
  }
}

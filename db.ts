import * as SQLite from 'expo-sqlite';

// Create a promise that will resolve to the database
const dbPromise = (async () => {
  try {
    // Use openDatabaseAsync instead of openDatabase
    const db = await SQLite.openDatabaseAsync('prayers.db');
    
    // Initialize database schema if needed
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS PrayerTimes (
        _id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        Fajr TEXT NOT NULL,
        Sunrise TEXT NOT NULL,
        Dhuhr TEXT NOT NULL,
        Asr TEXT NOT NULL, 
        Maghrib TEXT NOT NULL,
        Isha TEXT NOT NULL
      );
    `);
    
    console.log('[SQLite] Database initialized successfully');
    return db;
  } catch (error) {
    console.error('[SQLite Init Error]:', error);
    throw error;
  }
})();

export default dbPromise;

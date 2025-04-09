import * as FileSystem from 'expo-file-system'; // Import FileSystem module for file operations
import * as SQLite from 'expo-sqlite'; // Import SQLite module for interacting with SQLite databases
import { Asset } from 'expo-asset'; // Import Asset module for handling assets bundled with the app

// Function to load the database
async function loadDatabase() {
  const dbName = 'prayersTime.db'; // Define the database name
  const dbAsset = require('../../assets/prayersTime.db'); // Require the database file from the assets folder
  const dbUri = `${FileSystem.documentDirectory}SQLite/${dbName}`; // Set the target URI for the database in the document directory

  // DELETE OLD FILE - ONLY TEMPORARILY FOR DEBUGGING
  // Deletes the old database file if it exists to ensure a fresh copy during development
  await FileSystem.deleteAsync(dbUri, { idempotent: true });
  console.log('[SQLite] Deleted old db to force copy again.');

  // Check if the database file already exists in the document directory
  const file = await FileSystem.getInfoAsync(dbUri);
  if (!file.exists) { // If the database doesn't exist, copy it from assets
    const asset = Asset.fromModule(dbAsset); // Create an asset reference from the bundled database file
    await asset.downloadAsync(); // Download the asset to the local filesystem

    // Check if the directory for SQLite exists, create it if not
    const dir = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite`);
    if (!dir.exists) {
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true }); // Create the directory
    }

    // Copy the database from the asset to the target URI
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: dbUri,
    });

    console.log('[SQLite] prayersTime.db copied successfully.');
  } else {
    console.log('[SQLite] prayersTime.db already exists.'); // If the database exists, log that no action is needed
  }

  // Open the SQLite database
  const db = await SQLite.openDatabaseAsync(dbName);
  return db; // Return the opened database instance
}

export default loadDatabase; // Export the loadDatabase function to be used elsewhere
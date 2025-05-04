ROESALAH - MOBILE PRAYER APP
Overview
RoeSalah is a mobile application developed to supoort Muslim students and staff at the University of Roehampton by providing reliable access to daily prayer times, Qibla direction, and islamic resources. the app is built with React Native (Expo) and uses SQLite for offline prayer time storage. it is designed to be lightweight, intuitive and accessible across both Android and iOS platforms.

FEATURES
- Daily Prayer times: Pulled from a local SQLite database for Roehampton
- Qibla Compass; shows real-time direction to the Kaaba using the device's magnetometer.
- Surah List: Displays name of all 114 Surahs from the Quran.
- Calendar: Basic Gregorian calendar with plans to integrate Hijri Support.
- Settings: Allows 12/24-Hour format switching using local device storage.

INSTALLATION REQUIREMENTS
- Node.js
- Expo CLI (npm install -g expo-cli)
- Visual Studio Code

STEPS
- Clone repository: git clone https://github.com/your-username/roeSalah-app.git
cd roeSalah-app
- Instal Dependencies: npm install
-Start the app: npx expo start
- Lastly Scan the QR code with the Expo Go App on your chosen mobile device (Android or iOS) to see the app.


DATABASE
Prayer times are locally stored using SQLite. The data was extracted and cleaned from Salah Times Website for Roehampton prayer timings , then imported into a structured SQLite database file for use offline.

PROJECT MANAGEMENT
This project was version controlled using GitHub, where all source code, updates, and commits were managed.

LICENSE
This project is for academic use as part of a BSc dissertation at the University of Roehampton. Not intended for commercial distribution.

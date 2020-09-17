// ==================
// Puerto
// ==================
process.env.PORT = process.env.PORT || 3000;

// ================================
// Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Base de dAtos
// ================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://A302367:eDGtPN1V10ojN2Ok@cluster0.rha88.mongodb.net/cafe'
}

process.env.URLDB = urlDB;
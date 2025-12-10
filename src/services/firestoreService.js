import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc 
} from "firebase/firestore";

// --- FUNGSI NAMBAH KE WATCHLIST ---
// Menggunakan struktur: users -> {userId} -> watchlist -> {movieId}
// Kita pakai setDoc agar ID dokumen = ID Film. Ini otomatis mencegah duplikasi.
export const addToWatchlist = async (userId, movieData) => {
  try {
    // Pastikan ID dijadikan string
    const docId = String(movieData.movieId);
    
    // Referensi ke dokumen spesifik
    const watchlistRef = doc(db, "users", userId, "watchlist", docId);

    // Simpan data
    await setDoc(watchlistRef, {
      movieId: movieData.movieId,
      title: movieData.title,
      posterPath: movieData.posterPath || null, // Handle jika tidak ada gambar
      voteAverage: movieData.voteAverage || 0,
      addedAt: new Date()
    });
    
    return true; // Berhasil
  } catch (error) {
    console.error("Error adding to watchlist: ", error);
    return false; // Gagal
  }
};

// --- FUNGSI AMBIL WATCHLIST ---
export const getUserWatchlist = async (userId) => {
  const result = [];
  try {
    // Ambil semua dokumen di sub-collection 'watchlist' milik user
    const querySnapshot = await getDocs(collection(db, "users", userId, "watchlist"));
    
    querySnapshot.forEach((doc) => {
      // Masukkan data ke array result
      result.push({ firestoreId: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error getting watchlist: ", error);
  }
  return result;
};

// --- FUNGSI HAPUS DARI WATCHLIST ---
export const removeFromWatchlist = async (userId, movieId) => {
  try {
    const docId = String(movieId);
    // Hapus dokumen spesifik berdasarkan ID film
    await deleteDoc(doc(db, "users", userId, "watchlist", docId));
    return true;
  } catch (error) {
    console.error("Error removing: ", error);
    return false;
  }
};
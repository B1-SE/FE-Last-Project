import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

// Interface for FakeStoreAPI product
interface FakeProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

// Load service account key dynamically
async function loadServiceAccount() {
  try {
    const serviceAccount = await import('../../serviceAccountKey.json', { with: { type: 'json' } });
    return serviceAccount.default; // Use .default for ES module JSON
  } catch (error) {
    console.error('Error loading serviceAccountKey.json:', error);
    throw error;
  }
}

// Initialize Firebase Admin
async function initializeFirebase() {
  const serviceAccount = await loadServiceAccount();
  const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
  return getFirestore(app);
}

async function seedProducts() {
  try {
    const db = await initializeFirebase();

    // Fetch products from FakeStoreAPI
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const products: FakeProduct[] = await response.json();

    // Seed in batch (all 20 products)
    const batch = db.batch();
    for (const prod of products) {
      const docRef = db.collection('products').doc(); // Auto-generate ID
      batch.set(docRef, {
        title: prod.title,
        price: prod.price,
        category: prod.category,
        description: prod.description,
        image: prod.image,
        rating: prod.rating,
      });
    }

    await batch.commit();
    console.log('Successfully seeded 20 products to Firestore!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    process.exit();
  }
}

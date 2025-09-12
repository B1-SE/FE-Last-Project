import admin, { type ServiceAccount } from 'firebase-admin';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface FakeProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

async function loadServiceAccount() {
  try {
    const serviceAccount = await import('../../serviceAccountKey.json', { with: { type: 'json' } });
    return serviceAccount.default;
  } catch (error) {
    console.error('Error loading serviceAccountKey.json:', error);
    throw error;
  }
}

async function initializeFirebase() {
  try {
    const serviceAccount = await loadServiceAccount();
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount), // Correct type assertion
      databaseURL: `https://${process.env.VITE_FIREBASE_PROJECT_ID as string}.firebaseio.com`,
    });
    return admin.firestore(app);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

function generateFakeProduct(id: number): FakeProduct {
  return {
    id: `${id}`,
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    image: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'technics' }), // Using a specific category for better stability
    rating: {
      rate: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      count: faker.number.int({ min: 10, max: 1000 })
    },
  };
}

async function seedProducts() {
  try {
    const db = await initializeFirebase();
    console.log('Fetching products from FakeStoreAPI...');
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const apiProducts: FakeProduct[] = await response.json();

    const generatedProducts: FakeProduct[] = Array.from({ length: 480 }, (_, index) =>
      generateFakeProduct(index + 21)
    );
    const allProducts = [...apiProducts, ...generatedProducts];

    const existingDocs = await db.collection('products').get();
    const existingTitles = new Set(existingDocs.docs.map(doc => doc.data().title));
    const uniqueProducts = allProducts.filter(prod => !existingTitles.has(prod.title));

    if (uniqueProducts.length === 0) {
      console.log('No new unique products to seed. Exiting.');
      process.exit(0);
    }

    const batchSize = 50;
    for (let i = 0; i < uniqueProducts.length; i += batchSize) {
      const batch = db.batch();
      const batchProducts = uniqueProducts.slice(i, i + batchSize);
      for (const prod of batchProducts) {
        const docRef = db.collection('products').doc();
        batch.set(docRef, {
          title: prod.title,
          price: prod.price,
          category: prod.category,
          description: prod.description,
          image: prod.image,
          rating: prod.rating,
        });
      }
      console.log(`Committing batch of ${batchProducts.length} products...`);
      await batch.commit();
    }

    console.log(`Successfully seeded ${uniqueProducts.length} unique products to Firestore!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
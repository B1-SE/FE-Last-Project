// scripts/seed.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// 1. Firebase config (make sure your .env has these values)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
};

// 2. Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Sanitize products before saving
function sanitizeProduct(product: any) {
  return {
    id: String(product.id ?? ""),
    title: product.title ?? "",
    price: Number(product.price) || 0,
    description: product.description ?? "",
    category: product.category ?? "unknown",
    image: product.image ?? "",
    rating: {
      rate: Number(product.rating?.rate) || 0,
      count: Number(product.rating?.count) || 0,
    },
  };
}

// 4. Seed function
async function seed() {
  console.log("Fetching products from FakeStoreAPI...");
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  console.log(`Fetched ${products.length} products. Seeding Firestore...`);

  for (const product of products) {
    const cleanProduct = sanitizeProduct(product);

    try {
      await setDoc(doc(db, "products", cleanProduct.id), cleanProduct);
      console.log(`✅ Added/Updated: ${cleanProduct.title}`);
    } catch (err) {
      console.error(`❌ Failed to add: ${cleanProduct.title}`, err);
    }
  }
}

// 5. Run
seed().catch((err) => {
  console.error("❌ Seeding script failed:", err);
  process.exit(1);
});

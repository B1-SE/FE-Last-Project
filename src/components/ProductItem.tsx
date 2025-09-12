import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Product, CartItem } from '../types/types';
import homeStyles from '../pages/Home.module.css';
import styles from './ProductItem.module.css';
import ImageWithFallback from './ImageWithFallback';

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const cartItem: CartItem = { ...product, quantity: 1 };
    dispatch(addToCart(cartItem));
  };

  return (
    <div className={homeStyles.productCard}>
      <ImageWithFallback
        src={product.image}
        alt={product.title}
        className={homeStyles.productImage}
        fallbackSrc="https://via.placeholder.com/200"
      />
      <h2 className={homeStyles.productName}>{product.title}</h2>
      <p className={styles.productCategory}>{product.category}</p>
      <p className={homeStyles.productPrice}>${product.price.toFixed(2)}</p>
      <p className={styles.productDescription}>{product.description}</p>
      <div className={styles.productRating}>
        <span>⭐ {product.rating?.rate ?? 'N/A'}</span>
        <span style={{ marginLeft: 8, color: '#888', fontSize: '0.95em' }}>({product.rating?.count ?? 0} reviews)</span>
      </div>
      <button
        className={styles.addToCartButton}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;
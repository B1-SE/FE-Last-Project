import type { Product } from "../types/types";
import { useAppDispatch } from "../redux/store";
import { addToCart } from "../redux/CartSlice";
import "../App.css";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity: 1 }));
    };

    return (
        <div className="product-card">
            <img
                src={product.image}
                alt={product.title}
                className="product-image"
                onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/200";
                }}
            />
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p>Category: {product.category}</p>
                <p>{product.description}</p>
                <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
                <button className="product-button" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
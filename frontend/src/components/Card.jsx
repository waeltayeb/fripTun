import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

function Card({ id, title, price, newprice, imageUrl, isSold }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        setIsAdding(true);

        // Create cart item
        const item = {
            id,
            title,
            price,
            newPrice: newprice,
            imageUrl,
            isSold
        };

        // Add to cart
        addToCart(item);

        // Show feedback
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    return (
        <div className="bg-white shadow rounded overflow-hidden group cursor-pointer text-lg my-12">
            <Link to={`/article?id=${id}`}>
                <div className="relative justify-center">
                    <img
                        src={imageUrl}
                        alt="ProductImg"
                        className="w-full h-72 justify-center items-center"
                    />
                </div>
                <div className="pt-4 pb-3 px-4">
                    <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                        {title}
                    </h4>
                    <div className="flex items-baseline mb-1 space-x-2">
                        {isSold ? (
                            <>
                                <p className="text-xl text-primary font-semibold">{newprice} dt</p>
                                <p className="text-sm text-red-400 line-through">{price} dt</p>
                            </>
                        ) : (
                            <p className="text-xl text-primary font-semibold">{price} dt</p>
                        )}
                    </div>
                </div>
            </Link>
            <button
                onClick={handleAddToCart}
                
                className={`flex items-center justify-center w-full py-2 text-center text-white 
                    ${
                        isAdding 
                            ? 'bg-green-500 border-green-500' 
                            : 'bg-primary border-primary hover:bg-transparent hover:text-primary'
                    } 
                    border rounded-b transition duration-300 ease-in-out`}
            >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {
                    isAdding 
                        ? 'Added!' 
                        : 'Add to Cart'
                }
            </button>
        </div>
    );
}

export default Card;

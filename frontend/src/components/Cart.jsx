import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function Cart({ readonly }) {
  const { 
    cart, 
    removeFromCart, 
    getCartTotal,
    clearCart
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="col-span-4 border border-gray-200 p-6 rounded bg-white">
        <div className="text-center">
          <h4 className="text-gray-800 text-xl mb-4 font-medium">Your cart is empty</h4>
          <p className="text-gray-600 mb-4">Browse our products and find something you like!</p>
          <Link 
            to="/shop" 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-4 border border-gray-200 p-4 rounded bg-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-gray-800 text-lg font-medium uppercase">Order Summary</h4>
        {!readonly && (
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        )}
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-4">
            <div className="flex gap-4 items-center flex-1">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h5 className="text-gray-800 font-medium">{item.title}</h5>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                {item.isSold ? (
                  <>
                    <p className="text-primary font-medium">{item.newPrice} dt</p>
                    <p className="text-sm text-gray-400 line-through">{item.price} dt</p>
                  </>
                ) : (
                  <p className="text-primary font-medium">{item.price} dt</p>
                )}
              </div>
              {!readonly && (
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between border-b border-gray-200 py-3">
          <p className="text-gray-800 font-medium">Subtotal</p>
          <p className="text-gray-800 font-medium">{getCartTotal()} dt</p>
        </div>

        <div className="flex justify-between py-3">
          <p className="text-gray-800 font-semibold">Total</p>
          <p className="text-primary font-semibold">{getCartTotal()} dt</p>
        </div>

        {!readonly && (
          <Link
            to="/checkout"
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
          >
            Proceed to Checkout
          </Link>
        )}
      </div>
    </div>
  );
}

export default Cart;

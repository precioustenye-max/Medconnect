import { FaTimes } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import API from "../../services/api";
import { useAuthStore } from "../../store/auth.store";

const CartPage = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [checkoutError, setCheckoutError] = React.useState("");
  const [checkoutSuccess, setCheckoutSuccess] = React.useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = React.useState(false);
  const user = useAuthStore((state) => state.user);

  if (!open) return null;

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckoutSuccess("");

    if (!user) {
      setCheckoutError("Please log in as a patient before checkout.");
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      setCheckoutError("Checkout is available for patient accounts only.");
      return;
    }

    if (!cartItems.length) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    const pharmacyIds = [...new Set(cartItems.map((item) => Number(item.pharmacyId)).filter(Boolean))];
    if (pharmacyIds.length !== 1) {
      setCheckoutError("Cart items must belong to one pharmacy. Please clear cart and try again.");
      return;
    }

    const payload = {
      pharmacyId: pharmacyIds[0],
      items: cartItems.map((item) => ({
        drugId: Number(item.id),
        quantity: Number(item.qty),
      })),
    };

    try {
      setIsSubmittingOrder(true);
      const response = await API.post("/orders", payload);
      clearCart();
      setCheckoutSuccess(`Order #${response.data.order.id} created successfully.`);
    } catch (error) {
      if (error?.response?.status === 401) {
        setCheckoutError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      setCheckoutError(error.response?.data?.error || error.response?.data?.message || "Checkout failed");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-96 max-w-md bg-white z-50
        transform transition-transform duration-300 translate-x-0"
      >
        <div className="p-4 flex justify-between items-center border-b-1 border-gray-400">
          <h2 className="text-2xl text-gray-800 font-semibold">Shopping Cart</h2>
          <button onClick={onClose}>
            <FaTimes className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Cart items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-210px)]">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Review your items and proceed to checkout</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.price} frs</p>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                  </div>

                  <button
                    className="text-red-500 text-xs"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <p className="font-bold mb-3">Total: {cartTotal} frs</p>
            {checkoutError && <p className="text-red-500 text-xs mb-2">{checkoutError}</p>}
            {checkoutSuccess && <p className="text-green-600 text-xs mb-2">{checkoutSuccess}</p>}
            <button
              onClick={handleCheckout}
              disabled={isSubmittingOrder}
              className="w-full bg-teal-600 text-white py-3 rounded-lg disabled:opacity-60"
            >
              {isSubmittingOrder ? "Processing..." : "Checkout"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartPage;

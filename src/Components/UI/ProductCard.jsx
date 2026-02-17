import React from "react";
import Button from "./Button";
import {
  FaShoppingCart,
} from "react-icons/fa";


const ProductCard = ({ product, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-gray-200 border rounded-lg  hover:shadow-lg transition-shadow w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-600"
      aria-label={`View details for ${product.name}`}
    >
      <img
        src={product.src}
        alt={product.alt || product.name}
        className="w-full h-48 object-cover mb-4 rounded" 
      />

      <div className="p-4">
      <button className="text-black font-semibold mb-2 border border-gray-600 rounded-lg px-3">
     {product.category}
      </button>

      <h4 className="text-lg font-medium text-gray-900 mb-2">
        {product.name}
      </h4>


      <span
        className={`text-xs px-2 py-1 rounded inline-block
          ${
            product.prescriptionRequired
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
      >
        {product.prescriptionRequired
          ? "Prescription Required"
          : "No Prescription Needed"}
      </span>

      <div className="flex items-center gap-3 justify-between   ">
          <div className="text-blue-600 font-semibold mt-4 flex items-center justify-center text-sm md:text-2xl mb-4">
        {product.price} frs
      </div>
        <Button
          to={`/product/${product.id}`}
          color="black"
          className=" mt-4 py-2 flex gap-2 md:text-xl items-center"
        >
           <FaShoppingCart className="" />
          Cart
        </Button>

      </div>
      </div>
    </button>
  );
};

export default ProductCard;

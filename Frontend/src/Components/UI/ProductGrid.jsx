import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  px-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelect(product)}
        />
      ))}
    </div>
  );
};
export default ProductGrid;

const ProductImage = ({ src, alt = "" }) => {
  return <img src={src} alt={alt} className="h-40 w-full object-cover" />;
};

export default ProductImage;

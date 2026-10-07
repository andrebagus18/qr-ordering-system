const ProductImage = ({ src, alt = "" }) => {
  return <img src={src} alt={alt} className="h-30 w-full object-cover" />;
};

export default ProductImage;

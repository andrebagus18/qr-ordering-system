const Price = ({ value, className = "" }) => {
  return (
    <span className={`font-semibold ${className}`}>
      Rp {Number(value).toLocaleString("id-ID")}
    </span>
  );
};

export default Price;

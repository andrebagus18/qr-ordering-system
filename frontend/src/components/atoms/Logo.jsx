const Logo = ({ className = "" }) => {
  return (
    <div className={`font-bold text-xl ${className}`}>
      Kopi<span className="text-sm text-amber-600 font-bold">.kita</span>
    </div>
  );
};

export default Logo;

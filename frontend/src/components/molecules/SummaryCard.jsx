const SummaryCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-gray-100/50 bg-white/10 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-md text-white">{title}</p>
        <Icon size={20} className="text-white" />
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default SummaryCard;

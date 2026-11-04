const SummaryCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={20} className="text-gray-500" />
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default SummaryCard;

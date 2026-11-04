import { Wallet, ShoppingBag, CheckCircle } from "lucide-react";

import SummaryCard from "../molecules/SummaryCard";

const SummarySection = () => {
  const summary = [
    {
      title: "Konfirmasi Cash",
      value: 4,
      icon: Wallet,
    },
    {
      title: "Order Masuk",
      value: 8,
      icon: ShoppingBag,
    },
    {
      title: "QRIS Berhasil",
      value: 6,
      icon: CheckCircle,
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {summary.map((item) => (
        <SummaryCard key={item.title} {...item} />
      ))}
    </section>
  );
};

export default SummarySection;

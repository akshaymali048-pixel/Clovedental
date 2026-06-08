const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "3 Lakh+", label: "Patients Treated" },
  { value: "50+", label: "Treatments Offered" },
];

export function TrustBar() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-slate-200 px-4 py-8 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="px-2 text-center sm:px-6">
            <p className="font-serif text-2xl font-bold text-[#0d6e6e] sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

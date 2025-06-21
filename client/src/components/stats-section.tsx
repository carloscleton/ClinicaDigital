export default function StatsSection() {
  const stats = [
    { number: "15+", label: "Anos de Experiência" },
    { number: "20+", label: "Especialidades" },
    { number: "50+", label: "Médicos Especializados" },
    { number: "10k+", label: "Pacientes Atendidos" },
  ];

  return (
    <div className="bg-white -mt-16 relative z-10 mx-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

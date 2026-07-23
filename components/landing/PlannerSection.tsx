import Image from 'next/image'
import { Brush, Settings2, Tent, Sofa, Wine } from 'lucide-react'

const planItems = [
  { icon: Tent, label: 'Toldo Imperial Silk' },
  { icon: Sofa, label: 'Sillas Louis XV (200)' },
  { icon: Wine, label: 'Set de Cristal de Roca' },
]

export default function PlannerSection() {
  return (
    <section id="locaciones" className="relative bg-surface/30 py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center">
          <div className="absolute top-6 left-6 w-64 md:w-72 p-6 bg-surface/70 backdrop-blur-xl border border-border-brand/50 rounded-xl z-20">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-accent">Tu Plan</span>
              <div className="bg-accent w-8 h-8 rounded-full flex items-center justify-center text-bg text-xs font-bold">
                {planItems.length}
              </div>
            </div>
            <ul className="space-y-4">
              {planItems.map((item, i) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-3 text-muted-brand text-sm ${
                    i < planItems.length - 1 ? 'border-b border-border-brand/30 pb-3' : ''
                  }`}
                >
                  <item.icon className="text-accent" size={18} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full h-full rounded-2xl overflow-hidden relative border border-border-brand/30">
            <Image
              src="https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=1000&q=80"
              alt="Planner de bodas con muestras de tela y bocetos"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="font-display text-2xl md:text-3xl text-text-brand mb-8">El Planner Inteligente</h2>
          <p className="text-base text-muted-brand mb-10 leading-relaxed">
            Nuestra plataforma le permite visualizar y construir cada rincón de su celebración. Seleccione mobiliario, mantelería y servicios con la confianza de que cada pieza ha sido curada bajo los más altos estándares de lujo.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Brush className="text-accent shrink-0" size={28} />
              <div>
                <h4 className="font-display text-lg text-text-brand">Diseño Personalizado</h4>
                <p className="text-sm text-muted-brand">Adaptamos cada estructura a la topografía de su locación.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Settings2 className="text-accent shrink-0" size={28} />
              <div>
                <h4 className="font-display text-lg text-text-brand">Logística de Precisión</h4>
                <p className="text-sm text-muted-brand">Montajes impecables realizados por equipos expertos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

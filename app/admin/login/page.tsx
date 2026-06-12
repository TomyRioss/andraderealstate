'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!result || result.error) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      setLoading(false)
      return
    }

    window.location.href = '/admin/dashboard'
  }

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: '#E8F4FD' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 flex-shrink-0 px-14 py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1296&auto=format&fit=crop')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(13,59,102,0.85) 0%, rgba(13,59,102,0.55) 50%, rgba(13,59,102,0.92) 100%)' }}
        />
        <div className="relative flex-1 flex items-center justify-center">
          <Image
            src="/andrade_realstate_logo.png"
            alt="Andrade & Co Real Estate"
            width={240}
            height={104}
            className="brightness-[1.8]"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Image
              src="/andrade_realstate_logo.png"
              alt="Andrade & Co Real Estate"
              width={140}
              height={60}
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-light mb-2" style={{ color: '#0D3B66', fontFamily: 'Georgia, serif' }}>
              Bienvenido
            </h1>
            <p className="text-sm" style={{ color: '#4A7BA7' }}>
              Accedé al panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold tracking-[0.1em] uppercase" style={{ color: '#4A7BA7' }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all"
                style={{ backgroundColor: '#E8F4FD', border: '1px solid #AED6F1', color: '#0D3B66' }}
                onFocus={(e) => { e.target.style.borderColor = '#1A5F9E'; e.target.style.boxShadow = '0 0 0 3px rgba(26,95,158,0.12)' }}
                onBlur={(e) => { e.target.style.borderColor = '#AED6F1'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold tracking-[0.1em] uppercase" style={{ color: '#4A7BA7' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 text-sm rounded-lg outline-none transition-all"
                  style={{ backgroundColor: '#E8F4FD', border: '1px solid #AED6F1', color: '#0D3B66' }}
                  onFocus={(e) => { e.target.style.borderColor = '#1A5F9E'; e.target.style.boxShadow = '0 0 0 3px rgba(26,95,158,0.12)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#AED6F1'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                  style={{ color: '#4A7BA7' }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(185,28,28,0.08)', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold tracking-[0.08em] uppercase rounded-lg transition-all duration-200 mt-1 text-white"
              style={{
                backgroundColor: loading ? '#AED6F1' : '#0D3B66',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#1A5F9E' }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#0D3B66' }}
            >
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

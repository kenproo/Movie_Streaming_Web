import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'

export function ForbiddenPage() {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #07111f 0%, #020617 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          padding: '48px 40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(234, 179, 8, 0.1)',
            color: '#eab308',
            marginBottom: '28px',
          }}
        >
          <ShieldAlert size={40} />
        </div>

        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#eab308',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '8px',
          }}
        >
          Truy Cập Bị Từ Chối (403)
        </div>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: 800,
            margin: '0 0 12px 0',
            color: '#f8fafc',
            letterSpacing: '-0.02em',
          }}
        >
          Không Có Quyền Truy Cập
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#94a3b8',
            lineHeight: 1.6,
            margin: '0 0 32px 0',
          }}
        >
          Tài khoản của bạn không được phân quyền để truy cập trang này. Vui lòng đăng nhập bằng tài khoản Quản trị viên (Admin) hoặc liên hệ quản trị hệ thống.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(to right, #eab308, #ca8a04)',
              color: '#020617',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <ArrowLeft size={18} />
            Quay Lại
          </button>
          <button
            onClick={handleGoHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 24px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
          >
            <Home size={18} />
            Trang Chủ
          </button>
        </div>
      </div>
    </div>
  )
}

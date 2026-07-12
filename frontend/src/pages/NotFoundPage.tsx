import { Link } from 'react-router-dom'

export function NotFoundPage() {
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
          maxWidth: '480px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          padding: '48px 40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '80px',
            fontWeight: 900,
            background: 'linear-gradient(to right, #6366f1, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            margin: '0 0 12px 0',
            color: '#f8fafc',
            letterSpacing: '-0.02em',
          }}
        >
          Trang không tồn tại
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#94a3b8',
            lineHeight: 1.6,
            margin: '0 0 32px 0',
          }}
        >
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '12px 32px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '15px',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Về Trang Chủ
        </Link>
      </div>
    </div>
  )
}

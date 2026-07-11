interface AnimatedBotProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function AnimatedBot({ className = '', size = 'md' }: AnimatedBotProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 sm:h-5 sm:w-5',
    md: 'h-7 w-7 sm:h-8 sm:w-8',
    lg: 'h-10 w-10 sm:h-12 sm:w-12',
    xl: 'h-14 w-14 sm:h-16 sm:w-16',
  }

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes bot-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes bot-blink {
            0%, 94%, 98%, 100% { transform: scaleY(1); }
            96% { transform: scaleY(0.1); }
          }
          @keyframes bot-wiggle {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
          }
          @keyframes bot-pulse {
            0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.4)); }
            50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(6, 180, 212, 0.7)); }
          }
          .animate-bot-body {
            animation: bot-float 3s ease-in-out infinite;
            transform-origin: center bottom;
          }
          .animate-bot-eyes {
            animation: bot-blink 5.5s infinite;
            transform-origin: 50% 54px;
          }
          .animate-bot-antenna {
            animation: bot-wiggle 2.5s ease-in-out infinite;
            transform-origin: 50% 32px;
          }
          .animate-bot-light {
            animation: bot-pulse 2s ease-in-out infinite;
          }
        `}
      </style>
      
      <g className="animate-bot-body">
        {/* Antenna */}
        <g className="animate-bot-antenna">
          {/* Stem */}
          <rect x="47" y="15" width="6" height="18" rx="3" fill="url(#botGradient)" />
          {/* Bulb */}
          <circle cx="50" cy="12" r="6" fill="#06b6d4" className="animate-bot-light" />
        </g>

        {/* Ears / Side bolts */}
        <rect x="14" y="44" width="8" height="20" rx="4" fill="#334155" />
        <rect x="78" y="44" width="8" height="20" rx="4" fill="#334155" />
        
        {/* Head Outer */}
        <rect x="20" y="30" width="60" height="48" rx="16" fill="url(#botGradient)" stroke="#1e293b" strokeWidth="2" />
        
        {/* Screen/Face */}
        <rect x="26" y="36" width="48" height="36" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

        {/* Eyes */}
        <g className="animate-bot-eyes">
          <circle cx="40" cy="54" r="5" fill="#10b981" />
          <circle cx="60" cy="54" r="5" fill="#10b981" />
          {/* Eye shines */}
          <circle cx="38.5" cy="52.5" r="1.5" fill="white" />
          <circle cx="58.5" cy="52.5" r="1.5" fill="white" />
        </g>

        {/* Mouth (cute smile) */}
        <path d="M44 64 Q50 68 56 64" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      <defs>
        <linearGradient id="botGradient" x1="20" y1="30" x2="80" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

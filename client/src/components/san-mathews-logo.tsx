interface SanMathewsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function SanMathewsLogo({ className = "", size = "md" }: SanMathewsLogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12", 
    lg: "h-16",
    xl: "h-20"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        viewBox="0 0 300 120" 
        className={`${sizeClasses[size]} w-auto`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Símbolo S estilizado baseado no original */}
        <path
          d="M150 15 C 170 5, 180 15, 175 25 C 170 35, 160 30, 150 35 C 140 40, 145 50, 155 55 C 165 60, 175 65, 170 75 C 165 85, 150 80, 140 75 C 130 70, 125 60, 135 55"
          fill="#7DB46C"
          stroke="none"
        />
        
        {/* Segundo elemento do S */}
        <path
          d="M150 25 C 165 15, 175 25, 170 35 C 165 45, 155 40, 150 45 C 145 50, 150 60, 160 65 C 170 70, 180 75, 175 85 C 170 95, 155 90, 145 85"
          fill="#9BC53D"
          stroke="none"
          opacity="0.8"
        />
        
        {/* Texto SanMathews */}
        <text
          x="20"
          y="75"
          fontSize="28"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="600"
          fill="#7DB46C"
          className="dark:fill-green-400"
        >
          SanMathews
        </text>
        
        {/* Linha sutil */}
        <line
          x1="20"
          y1="82"
          x2="280"
          y2="82"
          stroke="#9BC53D"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Texto Clínica e Laboratório */}
        <text
          x="80"
          y="100"
          fontSize="14"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="400"
          fill="#7DB46C"
          className="dark:fill-green-300"
          opacity="0.9"
        >
          Clínica e Laboratório
        </text>
      </svg>
    </div>
  );
}
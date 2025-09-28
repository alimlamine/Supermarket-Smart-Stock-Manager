
import React from "react";

interface SpotlightProps {
  fill?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({ fill = "white" }) => {
  return (
    <div
      className={`pointer-events-none h-[600px] w-[600px] rounded-full blur-3xl opacity-70 mix-blend-screen animate-spotlight`}
      style={{
        background: `radial-gradient(circle at center, ${fill}, transparent 70%)`,
      }}
    />
  );
};

export default Spotlight;
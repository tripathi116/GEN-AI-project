import React, { useState, useEffect } from 'react';

const AnimatedHeading = ({ text, className = '', style = {} }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const lines = text.split('\n');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 200); // 200ms initial delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        return (
          <span key={lineIndex} className="block whitespace-nowrap">
            {line.split('').map((char, charIndex) => {
              const delay = (lineIndex * lineLength * 30) + (charIndex * 30);
              const isSpace = char === ' ';

              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all"
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? 'translateX(0)' : 'translateX(-18px)',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'ease',
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {isSpace ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

export default AnimatedHeading;

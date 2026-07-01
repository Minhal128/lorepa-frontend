import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import "../components/portfolio.css";
import Responsive from "./Responsive";
import CanadaFlag from "./CanadaFlag";

export default function BounceCards({
  className = "Bouncy",
  images = [],
  labels = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)",
  ],
  enableHover = true,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      gsap.fromTo(
        ".card",
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      );
    }
  }, [animationDelay, animationStagger, easeType, isMobile]);

  if (isMobile) {
    return <Responsive images={images} labels={labels} />;
  }

  const getNoRotationTransform = (transformStr) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    } else if (transformStr === "none") {
      return "rotate(0deg)";
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === "none"
        ? `translate(${offsetX}px)`
        : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (hoveredIdx) => {
    if (!enableHover) return;

    images.forEach((_, i) => {
      const selector = `.card-${i}`;
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || "none";

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(selector, {
          transform: pushedTransform,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover) return;

    images.forEach((_, i) => {
      const selector = `.card-${i}`;
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || "none";
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      className={`Bouncy relative flex items-center justify-center ${className} mx-55`}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`Bouncy card card-${idx} mt-18 absolute w-[200px] aspect-square cursor-pointer`}
          style={{ transform: transformStyles[idx] || "none" }}
          onMouseEnter={() => {
            pushSiblings(idx);
            setHoveredIdx(idx);
          }}
          onMouseLeave={() => {
            resetSiblings();
            setHoveredIdx(null);
          }}
          onClick={() => labels[idx] && navigate(`/trailers?city=${labels[idx]}`)}
        >
          <div
            className="w-full h-full border-8 border-white rounded-[30px] overflow-hidden"
            style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}
          >
            <img
              className="w-full h-full object-cover Bouncy"
              src={src}
              alt={labels[idx] || `card-${idx}`}
            />
          </div>
          {labels[idx] && (
            <div
              className={`absolute left-1/2 -bottom-9 -translate-x-1/2 whitespace-nowrap bg-white text-gray-900 text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-300 ${
                hoveredIdx === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
              }`}
            >
              <CanadaFlag className="w-4 h-3 rounded-[1px] shrink-0" />
              {labels[idx]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

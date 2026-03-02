import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const triggerRef = useRef(null);
  const rocketRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#0a0a0a";
    document.body.style.backgroundColor = "#0a0a0a";

    const ctx = gsap.context(() => {
      const container = triggerRef.current;
      const rocket = rocketRef.current;
      const letters = document.querySelectorAll(".value-letter");

      // Calculate total travel distance
      const totalWidth = container.offsetWidth;
      const rocketWidth = rocket.offsetWidth;
      const maxTravel = totalWidth - rocketWidth - 40; // 40px padding

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=1500",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onRefresh: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = "#0a0a0a";
          }
        },
      });

      tl.to(rocket, {
        x: maxTravel,
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          const currentRocketX = progress * maxTravel;
          
          // LETTER OVERTAKE LOGIC
          letters.forEach((letter) => {
            // Get the letter's position relative to the container
            const letterLeft = letter.offsetLeft;
            
            // If the rocket's front has passed the letter's start position
            if (currentRocketX + (rocketWidth / 2) >= letterLeft) {
              letter.style.opacity = "1";
              letter.style.color = "#4ade80";
              letter.style.filter = "drop-shadow(0 0 10px rgba(74, 222, 128, 0.6))";
            } else {
              letter.style.opacity = "0.1";
              letter.style.color = "white";
              letter.style.filter = "none";
            }
          });

          if (trailRef.current) {
            trailRef.current.style.width = `${progress * 100}%`;
          }

          // STATS LOGIC (Halfway mark)
          document.querySelectorAll(".stat-card").forEach((card, i) => {
            const startPoint = 0.5 + (i * 0.1);
            const cardProgress = Math.min(Math.max((progress - startPoint) / 0.2, 0), 1);
            card.style.opacity = cardProgress;
            card.style.transform = `translateY(${(1 - cardProgress) * 30}px) scale(${0.9 + (0.1 * cardProgress)})`;
          });
        },
      }, 0);

    }, triggerRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const headline = "WELCOME ITZFIZZ".split("");

  return (
    <div className="w-full bg-[#0a0a0a]">
      <section
        ref={triggerRef}
        className="relative bg-[#0a0a0a] text-white h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute w-[500px] h-[500px] bg-green-900/10 blur-[150px] rounded-full" />

        <div className="flex flex-wrap justify-center gap-2 md:gap-6 mb-24 z-10 px-6">
          {headline.map((char, i) => (
            <span
              key={i}
              className="value-letter text-5xl md:text-8xl font-black tracking-tighter opacity-10 transition-all duration-200"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Track */}
        <div className="relative w-full h-[1px] bg-white/10 flex items-center px-6">
          <div ref={trailRef} className="absolute left-0 h-[2px] bg-green-400 shadow-[0_0_15px_#4ade80]" style={{ width: "0%" }}></div>
          <div ref={rocketRef} className="absolute left-0 z-30 text-4xl filter drop-shadow-[0_0_10px_#4ade80]">🚀</div>
        </div>

        {/* Stats */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="grid grid-cols-2 gap-x-48 gap-y-64 md:gap-x-96 md:gap-y-80">
            <StatBox value="58%" label="Efficiency" color="text-green-400" />
            <StatBox value="23%" label="Performance" color="text-blue-400" />
            <StatBox value="99%" label="Uptime" color="text-purple-400" />
            <StatBox value="40%" label="Design" color="text-orange-400" />
          </div>
        </div>
      </section>
      
      <section className="h-[20vh] bg-[#0a0a0a]" /> 
    </div>
  );
};

const StatBox = ({ value, label, color }) => (
  <div className="stat-card p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0">
    <span className={`text-4xl font-bold block ${color}`}>{value}</span>
    <p className="text-[10px] tracking-widest uppercase text-gray-500 font-medium">{label}</p>
  </div>
);

export default HeroSection;
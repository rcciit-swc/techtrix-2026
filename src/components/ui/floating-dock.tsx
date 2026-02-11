'use client';
/* eslint-disable */
import { cn } from '@/lib/utils/cn';
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import { useRef } from 'react';

export const FloatingDock = ({
  items,
  desktopClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  desktopClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
    </>
  );
};
const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      animate={{
        boxShadow: [
          '0 0 40px rgba(0,247,255,0.3)',
          '0 0 60px rgba(0,247,255,0.5)',
          '0 0 40px rgba(0,247,255,0.3)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn(
        'mx-auto flex h-20 md:h-20 items-center gap-3 md:gap-6 rounded-[2rem] px-4 md:px-8 bg-black/90 backdrop-blur-2xl border-2 border-[#00f7ff]/40',
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Only use opacity transform, no size changes
  let opacityTransform = useTransform(distance, [-150, 0, 150], [0.7, 1, 0.7]);
  let glowTransform = useTransform(distance, [-150, 0, 150], [0, 1, 0]);

  let opacity = useSpring(opacityTransform, {
    stiffness: 250,
    damping: 20,
  });

  let glowIntensity = useSpring(glowTransform, {
    stiffness: 250,
    damping: 20,
  });

  return onClick ? (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <motion.div
        ref={ref}
        style={{
          opacity,
          boxShadow: useTransform(
            glowIntensity,
            [0, 1],
            ['0 0 0px rgba(0,247,255,0)', '0 0 20px rgba(0,247,255,0.6)']
          ),
        }}
        className="relative flex w-11 h-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f7ff]/10 to-[#00f7ff]/5 hover:from-[#00f7ff]/15 hover:to-[#00f7ff]/8 border border-[#00f7ff]/30 hover:border-[#00f7ff]/60 transition-colors"
      >
        <div className="w-6 h-6 flex items-center justify-center text-[#00f7ff]">
          {icon}
        </div>
      </motion.div>
      <motion.span
        style={{ opacity }}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-[#00f7ff] transition-colors whitespace-nowrap"
      >
        {title}
      </motion.span>
    </button>
  ) : (
    <a href={href} className="flex flex-col items-center gap-2 group">
      <motion.div
        ref={ref}
        style={{
          opacity,
          boxShadow: useTransform(
            glowIntensity,
            [0, 1],
            ['0 0 0px rgba(0,247,255,0)', '0 0 20px rgba(0,247,255,0.6)']
          ),
        }}
        className="relative flex w-11 h-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f7ff]/10 to-[#00f7ff]/5 hover:from-[#00f7ff]/15 hover:to-[#00f7ff]/8 border border-[#00f7ff]/30 hover:border-[#00f7ff]/60 transition-colors"
      >
        <div className="w-6 h-6 flex items-center justify-center text-[#00f7ff]">
          {icon}
        </div>
      </motion.div>
      <motion.span
        style={{ opacity }}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-[#00f7ff] transition-colors whitespace-nowrap"
      >
        {title}
      </motion.span>
    </a>
  );
}

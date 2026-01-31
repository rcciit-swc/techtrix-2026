'use client';
/* eslint-disable */
import { cn } from '@/lib/utils/cn';
import { IconLayoutNavbarCollapse } from '@tabler/icons-react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import { useRef, useState } from 'react';

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
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
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-4 flex flex-col gap-3"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    key={item.title}
                    className="flex h-12 items-center gap-3 px-4 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-purple-500/30 whitespace-nowrap"
                  >
                    <div className="h-6 w-6">{item.icon}</div>
                    <span className="text-white text-sm font-medium">
                      {item.title}
                    </span>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    key={item.title}
                    className="flex h-12 items-center gap-3 px-4 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-purple-500/30 whitespace-nowrap"
                  >
                    <div className="h-6 w-6">{item.icon}</div>
                    <span className="text-white text-sm font-medium">
                      {item.title}
                    </span>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-110 active:scale-95"
      >
        <IconLayoutNavbarCollapse className="h-7 w-7 text-white" />
      </button>
    </div>
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
      className={cn(
        'mx-auto hidden h-24 items-center gap-8 rounded-[2.5rem] px-10 md:flex bg-neutral-900/80 backdrop-blur-2xl border-2 border-purple-500/30 shadow-[0_0_50px_-15px_rgba(168,85,247,0.4)]',
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

  let widthTransform = useTransform(distance, [-150, 0, 150], [48, 64, 48]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [48, 64, 48]);
  let yTransform = useTransform(distance, [-150, 0, 150], [0, -15, 0]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [24, 36, 24]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [24, 36, 24]
  );

  let opacityTransform = useTransform(distance, [-150, 0, 150], [0.5, 1, 0.5]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 15,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 15,
  });
  let y = useSpring(yTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 15,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 15,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 15,
  });

  let opacity = useSpring(opacityTransform, {
    stiffness: 150,
    damping: 15,
  });

  return onClick ? (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <motion.div
        ref={ref}
        style={{ width, height, y }}
        className="relative flex aspect-square items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-2xl"
      >
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full" />
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-white relative z-10"
        >
          {icon}
        </motion.div>
      </motion.div>
      <motion.span
        style={{ opacity, y }}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-[#EDF526] transition-colors whitespace-nowrap"
      >
        {title}
      </motion.span>
    </button>
  ) : (
    <a href={href} className="flex flex-col items-center gap-2 group">
      <motion.div
        ref={ref}
        style={{ width, height, y }}
        className="relative flex aspect-square items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-2xl"
      >
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full" />
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-white relative z-10"
        >
          {icon}
        </motion.div>
      </motion.div>
      <motion.span
        style={{ opacity, y }}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-[#EDF526] transition-colors whitespace-nowrap"
      >
        {title}
      </motion.span>
    </a>
  );
}

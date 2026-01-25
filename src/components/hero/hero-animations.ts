export const cinematicEase: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const bgReveal = {
  hidden: {
    opacity: 0,
    scale: 1.12,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.8,
      ease: cinematicEase,
    },
  },
};

export const imageReveal = {
  hidden: {
    opacity: 0,
    y: 120,
    scale: 0.82,
    rotateX: 22,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.2,
      ease: cinematicEase,
    },
  },
};

export const floating = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const floatingSubtle = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, -1, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const floatingStrong = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 3, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const titleReveal = {
  hidden: {
    opacity: 0,
    scale: 0.55,
    rotateZ: -14,
    y: 80,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateZ: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.4,
      ease: cinematicEase,
    },
  },
};

export const textReveal = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.6,
      ease: cinematicEase,
    },
  },
};

export const buttonReveal = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.4,
      ease: cinematicEase,
    },
  },
};

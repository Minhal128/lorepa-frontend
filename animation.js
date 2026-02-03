export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
};

export const flipIn = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: { rotateY: 0, opacity: 1, transition: { duration: 1 } },
};

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 1 } },
};

export const zoomBounce = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, duration: 1.2 },
  },
};

export const blurIn = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.2 },
  },
};
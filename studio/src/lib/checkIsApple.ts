export const checkIsApple = () => {
  if (typeof window === `undefined` || typeof navigator === `undefined`)
    return false;

  if (/Mac/.test(navigator.userAgent)) return true;

  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

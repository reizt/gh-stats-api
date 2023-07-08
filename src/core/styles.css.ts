import { keyframes, style } from '@vanilla-extract/css';

const scaleInAnimation = keyframes({
  from: {
    transform: 'translateY(5px) scale(0)',
  },
  to: {
    transform: 'translateY(0px) scale(1)',
  },
});
const fadeInAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const langName = style({
  font: '400 11px "Segoe UI", Ubuntu, Sans-Serif',
  fill: '#000',
  animation: '0.8s ease-in-out forwards',
  animationName: fadeInAnimation,
});
export const langRate = style({
  font: '700 10px "Segoe UI", Ubuntu, Sans-Serif',
  fill: '#000',
  animation: '0.4s ease-in-out forwards',
  animationName: scaleInAnimation,
});

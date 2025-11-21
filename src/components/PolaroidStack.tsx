import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Polaroid from './Polaroid';

const polaroids = [
  // Left side
  { imageSrc: 'https://lh3.googleusercontent.com/d/1c8giD21EjYyTDlPH-qeYUFRPmCVXPxj6' },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1I9-tQqHxnoHP8R8lmw8xQEKf4E5df7Xr' },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1_3F666LB7Ic0LXmlVa5ocqKKupsiP3Jo' },
  // Right side
  { imageSrc: 'https://lh3.googleusercontent.com/d/1FoEniZs14U8p9Phof6HiJaAs4_9hxVGh' },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1K0uZrCgJxUa529YuUfOOirZPTIAPyIGP' },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1Zs7G1ceoY1bCY9mOHIjiQOUXKdQHFanr' },
].map((p, i) => ({ ...p, id: i }));

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const trans = (r: number, s: number) => `perspective(1500px) rotateZ(${r}deg) scale(${s})`;

const PolaroidStack: React.FC = () => {
  const [gone] = useState(() => new Set());
  const [isResetting, setIsResetting] = useState(false);
  
  // Store initial props to reset cards to their original state
  const [initialProps] = useState(() => polaroids.map((_, i) => to(i)));

  const [props, api] = useSprings(polaroids.length, i => ({
    ...initialProps[i]
  }));

  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity }) => {
    if (isResetting) return;

    const trigger = velocity[0] > 0.2;
    const dir = xDir < 0 ? -1 : 1;

    if (!active && trigger) {
      gone.add(index);
    }

    api.start(i => {
      if (index !== i) return;

      const isGone = gone.has(index);

      // When the card is released without a flick, spring it back to its original position
      if (!active && !isGone) {
        return { ...initialProps[i], delay: undefined }; // Return to initial state, remove delay
      }

      const x = isGone ? (200 + window.innerWidth) * dir : mx;
      // Add drag-based rotation to the initial random rotation.
      // If it's flicked, add a velocity-based spin.
      const rot = initialProps[i].rot + (mx / 10) + (isGone ? dir * 10 * velocity[0] : 0);
      const scale = active ? 1.1 : 1;

      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
      };
    });

    if (!active && gone.size === polaroids.length) {
      setIsResetting(true);
      setTimeout(() => {
        gone.clear();
        api.start(i => {
          // Check if it's the last animation
          if (i === polaroids.length - 1) {
            // Re-enable dragging after the last card has reset
            return { ...initialProps[i], onRest: () => setIsResetting(false) };
          }
          return initialProps[i];
        });
      }, 600);
    }
  });

  return (
    <div className="flex items-center justify-center w-full h-full">
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className="absolute w-[80vw] h-[100vw] max-w-sm max-h-[30rem]" key={i} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
            }}
            className="w-full h-full"
          >
            {/* The Polaroid component's rotation is now fully controlled by the spring */}
            <Polaroid imageSrc={polaroids[i].imageSrc} rotation={0} isMobile={true} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
};

export default PolaroidStack;

import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Polaroid from './Polaroid';

const polaroids = [
  // Left side
  { imageSrc: 'https://lh3.googleusercontent.com/d/1c8giD21EjYyTDlPH-qeYUFRPmCVXPxj6', rotation: -15 },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1I9-tQqHxnoHP8R8lmw8xQEKf4E5df7Xr', rotation: 5 },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1_3F666LB7Ic0LXmlVa5ocqKKupsiP3Jo', rotation: -10 },

  // Right side
  { imageSrc: 'https://lh3.googleusercontent.com/d/1FoEniZs14U8p9Phof6HiJaAs4_9hxVGh', rotation: 10 },
  { imageSrc: 'https://lh3.googleusercontent.com/d/1m9iZkX2YJ8PIKriTGXi-ELRsXJcDFJsn', rotation: -5 },
  { imageSrc: 'https://lh3.googleusercontent.com/d/13KQRH2bEsC518nXMyrNjv6wWjhHPP8Vn', rotation: 15 },
].map((p, i) => ({ ...p, id: i }));


// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateZ(${r}deg) scale(${s})`;

const PolaroidStack: React.FC = () => {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(polaroids.length, i => ({
    ...to(i)
  })); // Create a bunch of springs using the helpers above

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity[0] > 0.2; // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
    if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    api.start(i => {
      if (index !== i) return; // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise it's either dragged or back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * velocity[0] : 0); // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1; // Active cards lift up a bit
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
    if (!down && gone.size === polaroids.length)
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
      }, 600);
  });
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <div className="flex items-center justify-center w-full h-full">
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className="absolute w-[80vw] h-[100vw] max-w-sm max-h-[30rem]" key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
            }}
            className="w-full h-full"
          >
            <Polaroid imageSrc={polaroids[i].imageSrc} rotation={0} isMobile={true} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
};

export default PolaroidStack;

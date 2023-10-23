# react-native-liquid-gauge-tutorial
<!-- Intro for tutorial for liquid gauge progress indicator for react native, with react-native-skia and react-native-reanimated -->
Some time ago I saw this cool [Liquid Fill Gauge Gist](https://gist.github.com/brattonc/5e5ce9beee483220e2f6) with cool animated web svg component. Immediatly I thought it would be cool to have it in react native. It took me some effort to make it works. So I decided to make a tutorial for it. I will use [react-native-skia](https://shopify.github.io/react-native-skia/) and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/).


<!-- TODO: better demo gif where we can see progress animation --> 
<!-- insert image from docs/demo.gif -->
![demo](docs/thumbnail.gif)


First of all, let's install [react-native-skia](https://shopify.github.io/react-native-skia/) (please follow official docs for it). Now let's create new component and draw circle.

```typescript 
import { Canvas, Circle } from "@shopify/react-native-skia";

type Props = {
  size: number;
};

export const LiquidGaugeProgress = ({ size }: Props) => {
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;

  return (
    <Canvas style={{ width: size, height: size }}>
      <Circle
        cx={radius}
        cy={radius}
        r={radius - circleThickness * 0.5}
        color="#178BCA"
        style="stroke"
        strokeWidth={circleThickness}
      />
    </Canvas>
  );
}; 
```

Render everything inside the Canvas with width and height of size. Draw Circle which fits canvas size. We will use `stroke` style to draw only border of the circle. We will use `strokeWidth` to set thickness of the border. 

Now let's add inner circle which will represent water wave later with clip path.

```typescript
  ...

  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;

  return (
    <Canvas style={{ width: size, height: size }}>
      <Circle
          ...
      />

      <Circle
        cx={radius}
        cy={radius}
        r={fillCircleRadius}
        color="#178BCA"
      />
    </Canvas>
  );
```

<!-- TODO: add image for each step -->

We draw another circle which fill space inside. And we want to clip this circle with SVG path. We will use `d3` library to generate this path, so let's install it. 

```bash
npx expo install d3 @types/d3
```

```typescript
  ...

  const waveClipCount = 2;

  // Data for building the clip wave area.
  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

```










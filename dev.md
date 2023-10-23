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

Now we will have quate big code snippet of clipped inner circle with wave form path. Let's have it whole and then describe by smaller parts.

```typescript
import { Canvas, Circle, Group, Path, Skia } from "@shopify/react-native-skia";
import { area, scaleLinear } from "d3";

type Props = {
  size: number;
  value: number;
};

export const LiquidGaugeProgress = ({ size, value }: Props) => {
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;

  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;

  const minValue = 0;
  const maxValue = 100;
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;
  const relativeWaveHeight = 0.1;
  const waveHeightScale = scaleLinear()
    .range([relativeWaveHeight, relativeWaveHeight])
    .domain([0, 100]);

  const waveCount = 1;
  const waveClipCount = waveCount + 1;
  const waveLength = (fillCircleRadius * 2) / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

  // Data for building the clip wave area.
  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area()
    .x(function (d) {
      return waveScaleX(d[0]);
    })
    .y0(function (d) {
      return waveScaleY(
        Math.sin(Math.PI * 2 * (1 - waveCount) + d[1] * 2 * Math.PI),
      );
    })
    .y1(function (_d) {
      return fillCircleRadius * 2 + waveHeight * 5;
    });

  const clipSvgPath = clipArea(data);
  const clipPath = Skia.Path.MakeFromSVGString(clipSvgPath);
  const transformMatrix = Skia.Matrix();
  transformMatrix.translate(
    0,
    fillCircleMargin + (1 - fillPercent) * fillCircleRadius * 2,
  );
  clipPath.transform(transformMatrix);

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

      <Group clip={clipPath}>
        <Circle cx={radius} cy={radius} r={fillCircleRadius} color="#178BCA" />
      </Group>
    </Canvas>
  );
};

```

<!-- TODO: add image for each step -->










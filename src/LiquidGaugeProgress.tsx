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

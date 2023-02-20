import { useMemo } from "react";
import { ScaleLinear } from "d3";

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  height: number;
  xaxis: string[];
};

// tick length
const TICK_LENGTH = 10;

export const AxisBottom = ({ xScale, height, xaxis }: AxisBottomProps) => {

  const ticks = useMemo(() => {
    const numberOfTicksTarget = Math.floor(xaxis.length);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      index: value,
      value: xaxis[value],
      xOffset: xScale(value),
    }));
  }, [xScale]);

  return (
    <>
      {/* Ticks and labels */}
      {ticks.map(({ index, value, xOffset }) => (
        <g
          key={index}
          transform={`translate(${xOffset}, 0)`}
          shapeRendering={"crispEdges"}
        >
          <line
            y1={TICK_LENGTH}
            y2={-height - TICK_LENGTH}
            stroke="#D2D7D3"
            strokeWidth={0.5}
          />
          <text
            key={index}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
              fill: "#D2D7D3",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

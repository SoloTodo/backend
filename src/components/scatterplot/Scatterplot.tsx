import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { ProductsData } from "../api_form/ApiFormCompareChart";
import { useState } from "react";
import useSettings from "src/hooks/useSettings";
import { PATH_PRODUCT } from "src/routes/paths";
import { useRouter } from "next/router";

const MARGIN = { top: 24, right: 24, bottom: 24, left: 80 };

type ScatterplotProps = {
  width: number;
  height: number;
  data: { x: number; y: number; productData?: ProductsData }[];
  xaxis: string[];
  yaxis: { min: number; max: number };
};

export const Scatterplot = ({
  width,
  height,
  data,
  xaxis,
  yaxis,
}: ScatterplotProps) => {
  const router = useRouter();
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [active, setActive] = useState<number | null>(null);
  const { themeMode } = useSettings();
  const isLight = themeMode === "light";

  // Scales
  const yScale = d3
    .scaleLinear()
    .domain([yaxis.min, yaxis.max])
    .range([boundsHeight, 0]);
  const xScale = d3
    .scaleLinear()
    .domain([0, xaxis.length])
    .range([0, boundsWidth]);

  // Build the shapes
  let last = null;
  const positions: { x: number; y: number }[] = [];
  const allShapes = data.map((d, i) => {
    const product = d.productData!.product_entries[0].product;
    let needExtra = 0;
    positions.map(({ x, y }) => {
      if (xScale(d.x) === x && Math.round(yScale(d.y)) === y) {
        needExtra += 1;
        return { x: x, y: y };
      }
    });
    positions.push({ x: xScale(d.x), y: Math.round(yScale(d.y)) });
    const extra = needExtra > 0 ? 28 + 20 * needExtra : 28;
    const name = product.specs.part_number ?? product.name;
    const fig = (
      <g
        key={i}
        onMouseEnter={() => setActive(i)}
        onMouseLeave={() => setActive(null)}
        onClick={() => router.push(`${PATH_PRODUCT.root}/${product.id}`)}
      >
        <a href="#">
          <rect
            x={xScale(d.x) - extra - 4}
            y={yScale(d.y) - 14}
            width={150}
            height={42}
            stroke={isLight ? "#fff" : "#000"}
            fill={isLight ? "#000" : "#fff"}
            fillOpacity={active !== null && active === i ? 0.9 : 0.2}
            strokeWidth={1}
            rx="5"
          />
          <g fill={isLight ? "#fff" : "#000"}>
            <text x={xScale(d.x) - extra} y={yScale(d.y)} fontSize={11}>
              <tspan>{product.brand_name}</tspan>
              <tspan>{" | "}</tspan>
              <tspan>
                {name.length > 15 ? `${name.slice(0, 13)}...` : name}
              </tspan>
            </text>
            <text x={xScale(d.x) - extra} y={yScale(d.y) + 12} fontSize={9}>
              <tspan>{product.specs.processor_line_name}</tspan>
              <tspan>{" | "}</tspan>
              <tspan>{product.specs.ram_quantity_unicode}</tspan>
              <tspan>{" | "}</tspan>
              <tspan>
                {product.specs.largest_storage_drive.capacity_unicode}
              </tspan>
            </text>
            <text x={xScale(d.x) - extra} y={yScale(d.y) + 24} fontSize={9}>
              <tspan>
                {product.specs.name.length > 18
                  ? `${product.specs.name.slice(0, 16)}...`
                  : product.specs.name}
              </tspan>
              <tspan>{" | "}</tspan>
              <tspan>{product.specs.operating_system_short_name}</tspan>
            </text>
          </g>
        </a>
      </g>
    );
    if (active !== null && active === i) {
      last = fig;
    }
    return fig;
  });

  return (
    <div>
      <svg width={width} height={height}>
        {/* first group is for the violin and box shapes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {/* Y axis */}
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

          {/* X axis, use an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} height={boundsHeight} xaxis={xaxis} />
          </g>

          {/* Circles */}
          {allShapes}
          {last}
        </g>
      </svg>
    </div>
  );
};

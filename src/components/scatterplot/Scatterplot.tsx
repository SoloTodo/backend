import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { ProductsData } from "../api_form/ApiFormCompareChart";
import { useState } from "react";
import { Box, Container, Modal, Stack, useTheme } from "@mui/material";
import { Typography } from "@mui/material";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Category } from "src/frontend-utils/types/store";
import styles from "../../css/ProductPage.module.css";
import Handlebars from "handlebars";
import { Product } from "src/frontend-utils/types/product";
import { Entity } from "src/frontend-utils/types/entity";
import ActualPricesCard from "src/sections/products/ActualPricesCard";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

const MARGIN = { top: 24, right: 24, bottom: 24, left: 80 };

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", md: "70%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  maxHeight: "90vh",
};

type ScatterplotProps = {
  width: number;
  height: number;
  data: { x: number; y: number; productData?: ProductsData }[];
  xaxis: string[];
  yaxis: { min: number; max: number };
  activeBrands: number[];
};

export const Scatterplot = ({
  width,
  height,
  data,
  xaxis,
  yaxis,
  activeBrands,
}: ScatterplotProps) => {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [renderHtml, setRenderHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const theme = useTheme();

  const colors = [
    theme.palette.chart.blue[0],
    theme.palette.chart.green[0],
    theme.palette.chart.yellow[0],
    theme.palette.chart.red[0],
    theme.palette.chart.violet[0],
    theme.palette.chart.blue[1],
    theme.palette.chart.green[1],
    theme.palette.chart.yellow[1],
    theme.palette.chart.red[1],
    theme.palette.chart.violet[1],
  ];

  const setOpen = (product: Product) => {
    setActiveProduct(product);
    const category = apiResourceObjects[product.category] as Category;
    const template = category.detail_template;
    if (template) {
      const templateHandler = Handlebars.compile(template);
      setRenderHtml(templateHandler(product.specs));
    }
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.products}${product.id}/entities/`
    )
      .then((response) => {
        setEntities(response);
        setLoading(false);
      })
      .catch((_) => {});
  };

  const setClose = () => {
    setActiveProduct(null);
    setRenderHtml("");
    setLoading(false);
    setEntities([]);
  };

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
    const extra = needExtra > 0 ? 28 + 15 * needExtra : 28;
    const name = product.specs.part_number ?? product.name;
    const color =
      colors[
        activeBrands.findIndex((b) => b === product.brand_id) % colors.length
      ];
    const fig = (
      <g
        key={i}
        onMouseEnter={() => setActive(i)}
        onMouseLeave={() => setActive(null)}
        onClick={() => setOpen(product)}
      >
        <a href="#">
          <rect
            x={xScale(d.x) - extra - 4}
            y={yScale(d.y) - 24}
            width={140}
            height={42}
            stroke={"#000"}
            fill={color}
            fillOpacity={active !== null && active === i ? 0.9 : 0.2}
            strokeWidth={1}
            rx="5"
          />
          <g fill={"#000"}>
            <text x={xScale(d.x) - extra} y={yScale(d.y) - 10} fontSize={11}>
              <tspan>{product.brand_name}</tspan>
              <tspan>{" | "}</tspan>
              <tspan>
                {name.length > 12 ? `${name.slice(0, 11)}...` : name}
              </tspan>
            </text>
            <text x={xScale(d.x) - extra} y={yScale(d.y) + 2} fontSize={9}>
              <tspan>{product.specs.processor_line_name}</tspan>
              <tspan>{" | "}</tspan>
              <tspan>{product.specs.ram_quantity_unicode}</tspan>
              <tspan>{" | "}</tspan>
              <tspan>
                {product.specs.largest_storage_drive.capacity_unicode}
              </tspan>
            </text>
            <text x={xScale(d.x) - extra} y={yScale(d.y) + 14} fontSize={9}>
              <tspan>
                {product.specs.name && product.specs.name.length > 18
                  ? `${product.specs.name.slice(0, 16)}...`
                  : product.specs.name || ''}
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
      <Modal open={activeProduct !== null} onClose={setClose}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">{activeProduct?.name}</Typography>
          </Stack>
          <br />
          <ActualPricesCard entities={entities} loading={loading} />
          <br />
          <Container>
            {renderHtml !== "" ? (
              <div
                className={styles.product_specs}
                dangerouslySetInnerHTML={{ __html: renderHtml }}
              />
            ) : (
              <Typography>
                Las especificaciones técnicas de este producto no están
                disponibles por ahora.
              </Typography>
            )}
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

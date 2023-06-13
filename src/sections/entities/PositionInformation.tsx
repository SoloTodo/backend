import { useEffect, useState } from "react";
import NextLink from "next/link";
import { GridColDef } from "@mui/x-data-grid";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import BasicTable from "../BasicTable";
import { Link } from "@mui/material";
import { PATH_ENTITY } from "src/routes/paths";

export default function PositionInformation({
  entityId,
}: {
  entityId: number;
}) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const myAbortController = new AbortController();

    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entity_section_positions}?entities=${entityId}&is_active=1`,
      { signal: myAbortController.signal }
    )
      .then((data) => {
        setPositions(data.results);
      })
      .catch((_) => {});

    return () => {
      myAbortController.abort();
    };
  }, []);

  const positionsColumns: GridColDef[] = [
    {
      headerName: "Sección",
      field: "section",
      flex: 1,
      renderCell: (params) => params.row.section.name,
    },
    {
      headerName: "Posición",
      field: "value",
    },
  ];
  return (
    <BasicTable
      title="Posicionamiento actual"
      columns={positionsColumns}
      data={positions}
    />
  );
}

import { Button } from "@mui/material";
import { useContext, useState } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

export default function BannerActiveParticipactionReportButton() {
  const [loading, setLoading] = useState(false);
  const context = useContext(ApiFormContext);

  const handleReportClick = () => {
    setLoading(true);
    const queryUrl = context.getQueryUrl();
    jwtFetch(null, `${queryUrl.href}&response_format=xls`).then((json) => {
      window.location = json.url;
      setLoading(false);
    });
  };

  return (
    <Button variant="contained" disabled={loading} onClick={handleReportClick}>
      {loading ? "Generando..." : "Descargar"}
    </Button>
  );
}

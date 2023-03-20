import { Button } from "@mui/material";
import { useContext, useState } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";

export default function BannerActiveParticipactionReportButton() {
  const [loading, setLoading] = useState(false);
  const context = useContext(ApiFormContext);

  console.log(context);

  const handleReportClick = () => {
    setLoading(true);
  };
  return (
    <Button variant="contained" disabled={loading} onClick={handleReportClick}>
      {loading ? "Generando..." : "Descargar"}
    </Button>
  );
}

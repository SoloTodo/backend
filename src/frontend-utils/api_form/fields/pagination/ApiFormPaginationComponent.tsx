import { useContext } from "react";
import { TablePagination } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";


export default function ApiFormPaginationComponent(
  ) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult;
  const page = context.getField("page")?.cleanedData;
  const page_size = context.getField("page_size")?.cleanedData;

  const handleChange = (value: string, name: string) => {
    context.updateUrl({
      [name]: [value],
    });
  };

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
      component="div"
      colSpan={3}
      count={data.count}
      rowsPerPage={page_size ? Number(page_size) : 5}
      page={page ? Number(page) - 1 : 0}
      onPageChange={(_e, v) => handleChange((v + 1).toString(), "page")}
      onRowsPerPageChange={(e) => handleChange(e.target.value, "page_size")}
      labelRowsPerPage="Filas por pág."
    />
  );
}

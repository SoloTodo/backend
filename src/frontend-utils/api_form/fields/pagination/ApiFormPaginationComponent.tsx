import { useContext } from "react";
import { TablePagination } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormPagination } from "./ApiFormPagination";

type ApiFormPaginationComponentPorps = {
  name: string;
};

export default function ApiFormPaginationComponent(
  props: ApiFormPaginationComponentPorps
) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult;
  const field = context.getField(props.name) as ApiFormPagination | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${props.name}`;
  }

  let page = null;
  let page_size = null;
  if (typeof field.cleanedData !== "undefined") {
    page = field.cleanedData.page;
    page_size = field.cleanedData.page_size;
  }

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

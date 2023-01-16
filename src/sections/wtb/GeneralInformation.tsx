import NextLink from "next/link";
// MUI
import { Link } from "@mui/material";
// utils
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { fDateTimeSuffix } from "src/utils/formatTime";
// types
import { Detail } from "src/frontend-utils/types/extras";
import { Category } from "src/frontend-utils/types/store";
import { Brand, WtbEntity } from "src/frontend-utils/types/wtb";
// path
import { PATH_WTB } from "src/routes/paths";
// section
import Details from "../Details";
// components
import CategorySelect from "src/components/my_components/CategorySelect";
import VisibilitySwitch from "src/components/my_components/VisibilitySwitch";

export default function GeneralInformation({
  entity,
  brand
}: {
  entity: WtbEntity;
  brand: Brand
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");

  const generalDetails: Detail[] = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "brand",
      label: "Marca",
      renderData: () => (
        <NextLink
          href={`${PATH_WTB.brands}/${brand.id}`}
          passHref
        >
          <Link>{brand.name}</Link>
        </NextLink>
      ),
    },
    {
      key: "external_url",
      label: "URL",
      renderData: (entity: WtbEntity) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={entity.external_url}
        >
          {entity.external_url}
        </Link>
      ),
    },
    {
      key: "cateogry",
      label: "Categoría",
      renderData: (entity: WtbEntity) => (
        <CategorySelect
          entity={entity}
          hasStaffPermission={hasStaffPermission}
        />
      ),
    },
    {
      key: "key",
      label: "Llave"
    },
    {
      key: "creation_date",
      label: "Fecha de detección",
      renderData: (entity: WtbEntity) => fDateTimeSuffix(entity.creation_date),
    },
    {
      key: "is_visible",
      label: "¿Visible?",
      renderData: (entity: WtbEntity) => (
        <VisibilitySwitch
          entity={entity}
          hasStaffPermission={hasStaffPermission}
        />
      ),
    },
  ];

  return (
    <Details
      title="Información general"
      data={entity}
      details={generalDetails}
    />
  );
}

import { useEffect, useState } from "react";
import { Link } from "@mui/material";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";
// hooks
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// paths
import { apiSettings } from "src/frontend-utils/settings";
// types
import { Entity, StaffInfo } from "src/frontend-utils/types/entity";
import { Detail } from "src/frontend-utils/types/extras";
import { User } from "src/frontend-utils/types/user";
// components
import Details from "../Details";

export default function StaffInformation({
  entity,
  users,
}: {
  entity: Entity;
  users: User[];
}) {
  const [staffInfo, setStaffInfo] = useState({});
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const userDict = users.reduce(
    (acc: { [x: string]: any }, a: { url: string }) => {
      acc[a.url] = a;
      return acc;
    },
    {}
  );

  const staffDetails: Detail[] = [
    {
      key: "key",
      label: "Llave",
    },
    {
      key: "scraped_category",
      label: "Categoría original",
      renderData: (entityPlus: Entity & StaffInfo) =>
        apiResourceObjects[entityPlus.scraped_category].name,
    },
    {
      key: "discovery_url",
      label: "URL",
      renderData: (entityPlus: Entity & StaffInfo) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={entityPlus.discovery_url}
        >
          {entityPlus.discovery_url}
        </Link>
      ),
    },
    {
      key: "last_association",
      label: "Última asociación",
      renderData: (entityPlus: Entity & StaffInfo) => {
        if (
          entityPlus.last_association !== null &&
          entityPlus.last_association_user !== null
        ) {
          return `${fDateTimeSuffix(entityPlus.last_association)} (${
            userDict[entityPlus.last_association_user].first_name
          } ${userDict[entityPlus.last_association_user].last_name})`;
        } else {
          return;
        }
      },
    },
    {
      key: "last_staff_access",
      label: "Último acceso",
      renderData: (entityPlus: Entity & StaffInfo) => {
        if (
          entityPlus.last_staff_access !== null &&
          entityPlus.last_staff_access_user !== null
        ) {
          return `${fDateTimeSuffix(entityPlus.last_staff_access)} (${
            userDict[entityPlus.last_staff_access_user].first_name
          } ${userDict[entityPlus.last_staff_access_user].last_name})`;
        } else {
          return;
        }
      },
    },
  ];

  useEffect(() => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/staff_info/`
    )
      .then((data) => {
        setStaffInfo(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Details
      title="Información staff"
      data={
        Object.keys(staffInfo).length !== 0 && Object.keys(entity).length !== 0
          ? { ...entity, ...staffInfo }
          : {}
      }
      details={staffDetails}
    />
  );
}

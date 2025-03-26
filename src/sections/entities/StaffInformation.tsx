import { useEffect, useState } from "react";
import { Link } from "@mui/material";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";
// hooks
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// paths
import { apiSettings } from "src/frontend-utils/settings";
// types
import { Entity, StaffInfo } from "src/frontend-utils/types/entity";
import { Detail } from "src/frontend-utils/types/extras";
import { User } from "src/frontend-utils/types/user";
// components
import Details from "../Details";
import { Category } from "src/frontend-utils/types/store";
import { useSnackbar } from "notistack";
import { differenceInMilliseconds, millisecondsToMinutes } from "date-fns";
import { useUser } from "src/frontend-utils/redux/user";

export default function StaffInformation({
  entity,
  setEntity,
  users,
  staffInfo,
  setStaffInfo,
}: {
  entity: Entity;
  setEntity: Function;
  users: User[];
  staffInfo: StaffInfo | null;
  setStaffInfo: Function;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector(useUser);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");

  useEffect(() => {
    const myAbortController = new AbortController();
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/staff_info/`,
      { signal: myAbortController.signal }
    )
      .then((data) => {
        let registerStaffAccess = false;

        if (data.last_staff_access) {
          const durationSinceLastStaffAccess = differenceInMilliseconds(
            new Date(),
            new Date(data.last_staff_access)
          );
          if (millisecondsToMinutes(durationSinceLastStaffAccess) < 10) {
            if (data.last_staff_access_user !== user?.detail_url) {
              enqueueSnackbar(
                "Alguien ha estado trabajando en esta entidad hace poco. ¡Cuidado!",
                { persist: true, variant: "warning" }
              );
            }
          } else {
            registerStaffAccess = true;
          }
        } else {
          registerStaffAccess = true;
        }

        if (registerStaffAccess) {
          jwtFetch(null, `${entity.url}register_staff_access/`, {
            method: "POST",
          }).then((json) => {
            setEntity(json);
          });
        }
        setStaffInfo(data);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  const userDict = users.reduce((acc: Record<string, User>, a: User) => {
    acc[a.url] = a;
    return acc;
  }, {});

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
          entityPlus.last_association &&
          entityPlus.last_association_user
        ) {
          return `${fDateTimeSuffix(entityPlus.last_association)} (${
            userDict[entityPlus.last_association_user.url]?.first_name
          } ${userDict[entityPlus.last_association_user.url]?.last_name})`;
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
          entityPlus.last_staff_access &&
          entityPlus.last_staff_access_user
        ) {
          return `${fDateTimeSuffix(entityPlus.last_staff_access)} (${
            userDict[entityPlus.last_staff_access_user.url]?.first_name
          } ${userDict[entityPlus.last_staff_access_user.url]?.last_name})`;
        } else {
          return;
        }
      },
    },
  ];

  if (!staffInfo) {
    return null;
  }

  return hasStaffPermission ? (
    <Details
      title="Información staff"
      data={{ ...entity, ...staffInfo }}
      details={staffDetails}
    />
  ) : (
    <></>
  );
}

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
import { StaffInfo } from "src/frontend-utils/types/entity";
import { Detail } from "src/frontend-utils/types/extras";
import { User } from "src/frontend-utils/types/user";
import { WtbEntity } from "src/frontend-utils/types/wtb";
// components
import Details from "../Details";

export default function StaffInformation({
  entity,
  users,
}: {
  entity: WtbEntity;
  users: User[];
}) {
  const [staffInfo, setStaffInfo] = useState({});

  const userDict = users.reduce(
    (acc: { [x: string]: any }, a: { url: string }) => {
      acc[a.url] = a;
      return acc;
    },
    {}
  );

  const staffDetails: Detail[] = [
    {
      key: "last_association",
      label: "Última asociación",
      renderData: (entityPlus: WtbEntity & StaffInfo) => {
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
  ];

  useEffect(() => {
    const myAbortController = new AbortController();
    jwtFetch(null, `${entity.url}staff_info/`, {
      signal: myAbortController.signal,
    })
      .then((data) => {
        setStaffInfo(data);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
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

import { useState } from "react";
import { Switch } from "@mui/material";
import { Entity } from "src/frontend-utils/types/entity";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useSnackbar } from "notistack";
import { WtbEntity } from "src/frontend-utils/types/wtb";

export default function VisibilitySwitch({
  entity,
  hasStaffPermission,
}: {
  entity: Entity | WtbEntity;
  hasStaffPermission: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isVisible, setIsVisible] = useState(entity.is_visible);

  const handleVisible = async (checked: boolean) => {
    if (!entity.product) {
      await jwtFetch(
        null,
        `${entity.url}/toggle_visibility/`,
        {
          method: "post",
          body: JSON.stringify({ is_visible: checked }),
        }
      )
        .then(() => setIsVisible(checked))
        .catch((err) => console.log(err));
    } else {
      enqueueSnackbar("Primero hay que disociar la entidad", {
        variant: "warning",
      });
    }
  };

  return (
    <Switch
      checked={isVisible}
      onChange={(evt) => handleVisible(evt.target.checked)}
      disabled={!hasStaffPermission}
    />
  );
}

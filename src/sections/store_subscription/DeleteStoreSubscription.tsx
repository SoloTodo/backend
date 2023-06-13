import { Button } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { StoreSubscription } from "src/frontend-utils/types/store_subscription";

export default function DeleteStoreSubscription({
  storeSubscription,
}: {
  storeSubscription: StoreSubscription;
}) {
  const context = useContext(ApiFormContext);

  const deleteSubscription = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.store_subscriptions}${storeSubscription.id}/`,
      {
        method: "DELETE",
      }
    ).then((_) => {
      context.setCurrentResult({
        ...context.currentResult,
        count: context.currentResult.count - 1,
        results: context.currentResult.results.filter(
          (r: StoreSubscription) => r.id !== storeSubscription.id
        ),
      });
    });
  };
  return (
    <Button variant="outlined" color="error" onClick={deleteSubscription}>
      Eliminar
    </Button>
  );
}

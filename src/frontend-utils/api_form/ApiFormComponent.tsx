import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { ApiForm, ApiFormFieldMetadata } from "./ApiForm";
import { ApiFormProvider } from "./ApiFormContext";
import { useRouter } from "next/router";
import * as queryString from "query-string";
import { ApiFormInitialState } from "./types";
// import { useSnackbar } from "notistack";

type ApiFormComponentProps = {
  fieldsMetadata: ApiFormFieldMetadata[];
  endpoint: string;
  live?: boolean;
  initialState?: ApiFormInitialState;
  children?: ReactNode;
  requiresSubmit?: boolean;
  onResultsChange?: Function;
};

export default function ApiFormComponent(props: ApiFormComponentProps) {
  const router = useRouter();
  // const { enqueueSnackbar } = useSnackbar();

  const form = useMemo(
    () =>
      new ApiForm(
        props.fieldsMetadata,
        props.endpoint,
        props.initialState && props.initialState.initialData
      ),
    []
  );
  const [currentResult, setCurrentResult] = useState(
    props.initialState ? props.initialState.initialResult : null
  );

  useEffect(() => {
    let isMounted = true;
    form.initialize();
    if (!props.requiresSubmit) {
      form.submit().then((results) => {
        if (isMounted) setCurrentResult(results);
      });
    } else {
      setCurrentResult([]);
    }

    const handleRouteChange = async (url: string) => {
      const parseUrl = queryString.parseUrl(url);

      form.initialize();
      if (!props.requiresSubmit || parseUrl.query.submit === "true") {
        await form.submit().then((results) => {
          if (isMounted) setCurrentResult(results);
          if (props.requiresSubmit) updateUrl({ submit: [] });
          props.onResultsChange && props.onResultsChange();
        });
        //   .catch((err) =>
        //     err.json().then((res: { errors: { [key: string]: string[] } }) => {
        //       const errMsg = Object.keys(res.errors).reduce(
        //         (acc: string, a: string) => {
        //           return acc + a + " - " + res.errors[a][0] + " ";
        //         },
        //         ""
        //       );
        //       enqueueSnackbar(errMsg, { variant: "error" });
        //     })
        //   );
        // if (props.requiresSubmit) updateUrl({ submit: [] });
      } else {
        setCurrentResult([]);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      isMounted = false;
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  const updateUrl = (newUrlParams: Record<string, string[]>) => {
    const currentQuery = router.query;

    for (const [key, value] of Object.entries(newUrlParams)) {
      currentQuery[key] = value;
    }

    const newSearch = queryString.stringify(currentQuery);
    const newPath = newSearch ? `${router.route}?${newSearch}` : router.route;
    router.push(newPath, undefined, { shallow: true });
  };

  return (
    <ApiFormProvider
      form={form}
      updateUrl={updateUrl}
      currentResult={currentResult}
      setCurrentResult={setCurrentResult}
    >
      {props.children}
    </ApiFormProvider>
  );
}

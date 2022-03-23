import React, {ReactNode, useEffect, useMemo, useState} from "react";
import { ApiForm, ApiFormFieldMetadata } from "./ApiForm";
import { ApiFormProvider } from "./ApiFormContext";
import { useRouter } from "next/router";
import * as queryString from "query-string";
import { ApiFormInitialState } from "./types";

type ApiFormComponentProps = {
  fieldsMetadata: ApiFormFieldMetadata[];
  endpoint: string;
  live?: boolean;
  initialState?: ApiFormInitialState;
  children?: ReactNode;
};

export default function ApiFormComponent(props: ApiFormComponentProps) {
  const router = useRouter();

  const form = useMemo(
      () => new ApiForm(
      props.fieldsMetadata,
      props.endpoint,
      props.initialState && props.initialState.initialData
    ), []);
  const [currentResult, setCurrentResult] = useState(
    props.initialState ? props.initialState.initialResult : null
  );

  useEffect(() => {
    form.initialize();

    const handleRouteChange = (_url: any) => {
      form.initialize();
      form.submit().then((results) => {
        setCurrentResult(results);
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    
    return () => {
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
    >
      {props.children}
    </ApiFormProvider>
  );
}

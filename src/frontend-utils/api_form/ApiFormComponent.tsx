import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { ApiForm, ApiFormFieldMetadata } from "./ApiForm";
import { ApiFormProvider } from "./ApiFormContext";
import { useRouter } from "next/router";
import * as queryString from "query-string";
import { ApiFormInitialState } from "./types";
import { submitReady } from "./fields/submit/ApiFormSubmit";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    form.initialize();
    if (!props.requiresSubmit) {
      form.submit().then((results) => {
        if (isMounted) setCurrentResult(results);
        setIsLoading(false);
      });
    } else {
      updateUrl({ submit: [] });
      setIsLoading(false);
    }

    const handleRouteChange = (url: string) => {
      const parseUrl = queryString.parseUrl(url);

      form.initialize();
      setIsLoading(true);
      if (!props.requiresSubmit || submitReady(parseUrl.query.submit)) {
        form.submit().then((results) => {
          if (isMounted) setCurrentResult(results);
          if (props.requiresSubmit)
            updateUrl({ ...parseUrl.query, submit: [] });
          props.onResultsChange && props.onResultsChange(results);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
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

    if (!Object.keys(newUrlParams).includes("page"))
      delete currentQuery["page"];

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
      isLoading={isLoading}
    >
      {props.children}
    </ApiFormProvider>
  );
}

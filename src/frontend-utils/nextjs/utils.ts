import { GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { AppStore } from "src/store/store";
import { fetchJson, FetchJsonInit, InvalidTokenError } from "../network/utils";
import { getApiResourceObject } from "../redux/api_resources/apiResources";
import atob from 'atob'

type GetServerSidePropsContextOrNull =
  | GetServerSidePropsContext
  | null
  | undefined;

export function getAuthTokens(ctx: GetServerSidePropsContextOrNull) {
  try {
    const tokens = JSON.parse(parseCookies(ctx)["authTokens"]);

    if (!tokens.access || !tokens.refresh) {
      throw new Error();
    }

    return tokens;
  } catch (err) {
    throw new InvalidTokenError("Missing or invalid JSON in authTokens cookie");
  }
}

type AuthTokensType = {
  refresh: string;
};

export function saveAuthTokens(
  context: GetServerSidePropsContextOrNull,
  authTokens: AuthTokensType
) {
  const decodedRefreshToken = JSON.parse(
    atob(authTokens.refresh.split(".")[1])
  );

  const cookieParameters = {
    maxAge: decodedRefreshToken.exp,
    path: "/",
    domain: undefined as string | undefined,
  };

  const hostname =
    context && context.req
      ? context.req.headers.host
      : window.location.hostname;

  if (hostname && hostname.includes(".solotodo.com")) {
    cookieParameters.domain = ".solotodo.com";
  }

  setCookie(
    context,
    "authTokens",
    JSON.stringify(authTokens),
    cookieParameters
  );
}

export function deleteAuthTokens(context: GetServerSidePropsContextOrNull) {
  const cookieParameters = {
    path: "/",
    domain: undefined as string | undefined,
  };

  const hostname =
    context && context.req
      ? context.req.headers.host
      : window.location.hostname;

  if (hostname && hostname.includes(".solotodo.com")) {
    cookieParameters.domain = ".solotodo.com";
  }

  destroyCookie(context, "authTokens", cookieParameters);
}

export async function jwtFetch(
  context: GetServerSidePropsContextOrNull,
  input: string,
  init?: FetchJsonInit
) {
  let { access, refresh } = getAuthTokens(context);

  const decodedAccessToken = JSON.parse(atob(access.split(".")[1]));
  const now = new Date();
  const accessTokenExpiration = new Date(decodedAccessToken.exp * 1000);

  if (accessTokenExpiration < now) {
    // The access token has expired, try and refresh it
    const decodedRefreshToken = JSON.parse(atob(refresh.split(".")[1]));
    const refreshTokenExpiration = new Date(decodedRefreshToken.exp * 1000);

    if (refreshTokenExpiration < now) {
      // Both tokens have expired. The tokens cookie is set to have a
      // maxAge equal to the refresh token so this path should never
      // happen
      throw new InvalidTokenError("Access and expiration tokens have expired");
    }

    const refreshTokenParams = {
      method: "POST",
      body: JSON.stringify({ refresh: refresh }),
    };

    // TODO put type in this response
    const res = await fetchJson("auth/token/refresh/", refreshTokenParams);
    access = res.access;

    const cookieParameters = {
      maxAge: decodedRefreshToken.exp,
      path: "/",
      domain: undefined as string | undefined,
    };

    const hostname =
      context && context.req
        ? context.req.headers.host
        : window.location.hostname;

    if (hostname && hostname.includes(".solotodo.com")) {
      cookieParameters.domain = ".solotodo.com";
    }

    const newAuthTokens = {
      access,
      refresh,
    };

    saveAuthTokens(context, newAuthTokens);
  }

  const requestInit = init || ({} as FetchJsonInit);

  if (!requestInit.headers) {
    requestInit.headers = {};
  }

  requestInit.headers.Authorization = `Bearer ${access}`;

  return await fetchJson(input, requestInit);
}

export const getStore = (st: AppStore, context: GetServerSidePropsContext) => {
  const apiResourceObjects = st.getState().apiResourceObjects;
  let store = {};
  if (context.params)
    store = getApiResourceObject(
      apiResourceObjects,
      "stores",
      context.params.id as string
    );
  return store;
};

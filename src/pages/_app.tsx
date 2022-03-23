// scroll bar
import "simplebar/src/simplebar.css";

// lazy image
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

import cookie from "cookie";
import { ReactElement, ReactNode, useMemo } from "react";
// next
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { AppProps, AppContext } from "next/app";
// utils
import { getSettings } from "../utils/settings";
import { SettingsValueProps } from "../components/settings/type";
// contexts
import { SettingsProvider } from "../contexts/SettingsContext";
import { CollapseDrawerProvider } from "../contexts/CollapseDrawerContext";
// theme
import ThemeProvider from "../theme";
// components
import RtlLayout from "../components/RtlLayout";
import ProgressBar from "../components/ProgressBar";
import ThemeColorPresets from "../components/ThemeColorPresets";
import MotionLazyContainer from "../components/animate/MotionLazyContainer";
import NotistackProvider from "../components/NotistackProvider";
// auth
import { AuthProvider } from "../frontend-utils/nextjs/JWTContext";
// redux
import { Provider } from "react-redux";
import { initializeStore } from "src/store/store";
import { deleteAuthTokens, jwtFetch } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import apiResourceObjectsSlice from "src/frontend-utils/redux/api_resources/apiResources";
// import { EnhancedStore } from "@reduxjs/toolkit";
// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

// export interface MyPageContext extends NextPageContext {
//   store: EnhancedStore;
// }

// interface MyAppContext extends AppContext {
//   ctx: MyPageContext;
// }

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  const store = useMemo(() => {
    return initializeStore(pageProps.initialReduxState);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Provider store={store}>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              <AuthProvider>
                <CollapseDrawerProvider>
                  <MotionLazyContainer>
                    <ThemeColorPresets>
                      <RtlLayout>
                        {/* <Settings /> */}
                        <ProgressBar />
                        {getLayout(<Component {...pageProps} />)}
                      </RtlLayout>
                    </ThemeColorPresets>
                  </MotionLazyContainer>
                </CollapseDrawerProvider>
              </AuthProvider>
            </NotistackProvider>
          </ThemeProvider>
        </SettingsProvider>
      </Provider>
    </>
  );
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie
  );

  const settings = getSettings(cookies);

  const ctx = context.ctx;

  const exclude_urls = ["/login", "/reset/", "/reset_password"];
  if (exclude_urls.find((path) => ctx.pathname.includes(path))) {
    return { pageProps: {}, settings };
  }

  if (!ctx.req) {
    return { pageProps: {}, settings };
  }

  let user = null;

  try {
    user = await jwtFetch(ctx as unknown as GetServerSidePropsContext, "users/me/");
  } catch (err) {
    // Invalid token or some other network error, invalidate the
    // possible auth cookie
    deleteAuthTokens(ctx as unknown as GetServerSidePropsContext);
  }

  const store = initializeStore();

  if (user) {
    // Store in redux api resources
    try {
      // Add resources
      const resources = ['countries', 'store_types']
      const resources_query = resources.reduce((acc, r) => {
        return acc = `${acc}&names=${r}`
      }, '')
      const apiResources = await jwtFetch(ctx as unknown as GetServerSidePropsContext, `resources/?${resources_query}`);
      store.dispatch(apiResourceObjectsSlice.actions.addApiResourceObjects(apiResources));
    } catch (err) {
      console.log(err);
    }

    store.dispatch(userSlice.actions.setUser(user));
    const resultProps = {
      user,
      initialReduxState: store.getState(),
    };
    return { pageProps: resultProps, settings };
  } else {
    ctx.res &&
      ctx.res.setHeader(
        "Location",
        `/login?next=${encodeURIComponent(ctx.asPath || "")}`
      );
    ctx.res && (ctx.res.statusCode = 302);
    ctx.res && ctx.res.end();
    return { pageProps: {}, settings };
  }
};

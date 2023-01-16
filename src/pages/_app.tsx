// scroll bar
import "simplebar/src/simplebar.css";

// lazy image
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

import cookie from "cookie";
import { ReactElement, ReactNode } from "react";
// next
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import App, { AppProps } from "next/app";
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
import { deleteAuthTokens, jwtFetch } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import apiResourceObjectsSlice from "src/frontend-utils/redux/api_resources/apiResources";
import { ChartStyle } from "src/components/chart";
import { resources_query } from "src/utils";
import withReduxStore, {
  MyAppContext,
} from "src/frontend-utils/redux/with-redux-store";
import { Provider } from "react-redux";
import { AnyAction, Store as ReduxStore } from "redux";

// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  reduxStore: ReduxStore<any, AnyAction>;
  settings: SettingsValueProps;
}

function MyApp({ Component, pageProps, reduxStore, settings }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>SoloTodo Backend</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Provider store={reduxStore}>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              <AuthProvider>
                <CollapseDrawerProvider>
                  <MotionLazyContainer>
                    <ThemeColorPresets>
                      <RtlLayout>
                        {/* <Settings /> */}
                        <ChartStyle />
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

MyApp.getInitialProps = async (context: MyAppContext) => {
  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie
  );

  const settings = getSettings(cookies);

  const ctx = context.ctx;

  const exclude_urls = ["/login", "/reset/", "/reset_password"];
  if (exclude_urls.find((path) => ctx.pathname.includes(path))) {
    const appProps = await App.getInitialProps(context);
    return { ...appProps, settings };
  }

  if (!ctx.req) {
    const appProps = await App.getInitialProps(context);
    return { ...appProps, settings };
  }

  let user = null;

  try {
    user = await jwtFetch(
      ctx as unknown as GetServerSidePropsContext,
      "users/me/"
    );
  } catch (err) {
    // Invalid token or some other network error, invalidate the
    // possible auth cookie
    ctx.res?.setHeader("error", err.message);
    deleteAuthTokens(ctx as unknown as GetServerSidePropsContext);
  }

  if (user) {
    // Store in redux api resources
    const reduxStore = ctx.reduxStore;
    try {
      const apiResources = await jwtFetch(
        ctx as unknown as GetServerSidePropsContext,
        `resources/with_permissions/?${resources_query}`
      );
      reduxStore.dispatch(
        apiResourceObjectsSlice.actions.addApiResourceObjects(apiResources)
      );
    } catch (err) {
      ctx.res?.setHeader("error", err.message);
    }

    reduxStore.dispatch(userSlice.actions.setUser(user));
  } else {
    ctx.res &&
      ctx.res.setHeader(
        "Location",
        `/login?next=${encodeURIComponent(ctx.asPath || "")}`
      );
    ctx.res && (ctx.res.statusCode = 302);
    ctx.res && ctx.res.end();
  }

  const appProps = await App.getInitialProps(context);
  return { ...appProps, settings };
};

export default withReduxStore(MyApp);

// scroll bar
import "simplebar/src/simplebar.css";

// lazy image
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

import cookie from "cookie";
import { ReactElement, ReactNode } from "react";
// next
import { NextPage } from "next";
import Head from "next/head";
import App, { AppProps, AppContext } from "next/app";
// utils
import { getSettings } from "../utils/settings";
import { SettingsValueProps } from "../components/settings/type";
// contexts
import { SettingsProvider } from "../contexts/SettingsContext";
import { CollapseDrawerProvider } from "../contexts/CollapseDrawerContext";
// theme
import ThemeProvider from "../theme";
// components
import Settings from "../components/settings";
import RtlLayout from "../components/RtlLayout";
import ProgressBar from "../components/ProgressBar";
import ThemeColorPresets from "../components/ThemeColorPresets";
import MotionLazyContainer from "../components/animate/MotionLazyContainer";
// auth
import { AuthProvider } from "../frontend-utils/nextjs/JWTContext";
// redux
import { Provider } from "react-redux";
import { initializeStore } from "src/store/store";
import { deleteAuthTokens, jwtFetch } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  const store = initializeStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Provider store={store}>
        <AuthProvider>
          <CollapseDrawerProvider>
            <SettingsProvider defaultSettings={settings}>
              <ThemeProvider>
                <MotionLazyContainer>
                  <ThemeColorPresets>
                    <RtlLayout>
                      <Settings />
                      <ProgressBar />
                      {getLayout(<Component {...pageProps} />)}
                    </RtlLayout>
                  </ThemeColorPresets>
                </MotionLazyContainer>
              </ThemeProvider>
            </SettingsProvider>
          </CollapseDrawerProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie
  );

  const settings = getSettings(cookies);

  const ctx = context.ctx;

  if (ctx.pathname == "/login") {
    return { pageProps: {}, settings };
  }

  let user = null

  try {
    user = await jwtFetch(ctx, 'users/me/')
  } catch (err) {
    // Invalid token or some other network error, invalidate the
    // possible auth cookie
    deleteAuthTokens(ctx)
  }

  const store = initializeStore()

  if (user) {
    store.dispatch(userSlice.actions.setUser(user))
    const resultProps = {
      user,
      initialReduxState: store.getState()
    }
    return { pageProps: resultProps, settings }
  } else {
      ctx.res && ctx.res.setHeader('Location', `/login?next=${encodeURIComponent(ctx.asPath || '')}`)
      ctx.res && (ctx.res.statusCode = 302)
      ctx.res && ctx.res.end()
      return { pageProps: {}, settings }
  }
};

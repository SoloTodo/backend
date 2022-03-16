import React, { useContext, ReactNode } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FetchJsonInit, InvalidTokenError } from "../network/auth";
import { deleteAuthTokens, jwtFetch } from "./utils";
import userSlice from "../redux/user";

function defaultAuthFetch(input: string, init?: FetchJsonInit): Promise<any> {
  return Promise.reject();
}

const AuthContext = React.createContext({
  authFetch: defaultAuthFetch,
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const authFetch = (input: string, init?: FetchJsonInit) => {
    try {
      return jwtFetch(null, input, init);
    } catch (err) {
      if (err instanceof InvalidTokenError) {
        deleteAuthTokens(null);
        dispatch(userSlice.actions.setUser(null));
        toast.error(
          "Error de autenticación, por favor inicie sesión nuevamente"
        );
        router.push("/login?next=" + encodeURIComponent(router.asPath));
      } else {
        toast.error(
          "Error al ejecutar la petición, por favor intente de nuevo"
        );
      }
      return Promise.reject();
    }
  };

  const logout = () => {
    deleteAuthTokens(null);
    dispatch(userSlice.actions.setUser(null));
    toast.success("Sesión cerrada exitosamente");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ authFetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

import { ReactNode } from "react";
import Image from 'next/image'
// @mui
import { styled } from "@mui/material/styles";
// components
import useSettings from "src/hooks/useSettings";

// ----------------------------------------------------------------------

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: "100%",
  position: "absolute",
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  children?: ReactNode;
};

export default function LogoOnlyLayout({ children }: Props) {
  const settings = useSettings();
  return (
    <>
      <HeaderStyle>
        {settings.themeMode === "dark" ? (
          <Image
            alt={"Logo"}
            src="/logo_fondo_oscuro.svg"
            width={200}
            height={51}
          />
        ) : (
          <Image
            alt={"Logo"}
            src="/logo_fondo_claro.svg"
            width={200}
            height={51}
          />
        )}
      </HeaderStyle>
      {children}
    </>
  );
}

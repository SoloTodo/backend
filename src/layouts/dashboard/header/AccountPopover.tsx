import { useState } from "react";
import { useRouter } from "next/router";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  Button,
} from "@mui/material";
// components
import MenuPopover from "../../../components/MenuPopover";
import { IconButtonAnimate } from "../../../components/animate";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { useAppSelector } from "src/store/hooks";
import { useUser } from "src/frontend-utils/redux/user";
// routes 
import { PATH_AUTH } from "src/routes/paths";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Cambiar contraseña",
    linkTo: PATH_AUTH.change_password,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { logout } = useAuth();
  const user = useAppSelector(useUser);
  if (!user) return null;
  const full_name = `${user.first_name} ${user.last_name}`;

  const router = useRouter();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (linkTo: string) => {
    router.push(linkTo)
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar alt={full_name}>
          {`${user.first_name[0]}${user.last_name[0]}`}
        </Avatar>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {full_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClose(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem sx={{ m: 1 }} onClick={() => logout()}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}

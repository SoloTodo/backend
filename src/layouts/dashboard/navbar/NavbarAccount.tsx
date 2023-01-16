// @mui
import { styled } from "@mui/material/styles";
import { Box, Link, Typography, Avatar } from "@mui/material";
import { useUser } from "src/frontend-utils/redux/user";
import { useAppSelector } from "src/frontend-utils/redux/hooks";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
};

export default function NavbarAccount({ isCollapse }: Props) {
  const user = useAppSelector(useUser);
  if (!user) return null;
  const full_name = `${user.first_name} ${user.last_name}`;

  return (
    <Link underline="none" color="inherit">
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: "transparent",
          }),
        }}
      >
        <Avatar alt={full_name}>
          {`${user.first_name[0]}${user.last_name[0]}`}
        </Avatar>

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create("width", {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {full_name}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
            {user.is_staff ? "staff" : "usuario"}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}

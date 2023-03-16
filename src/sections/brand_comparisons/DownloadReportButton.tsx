import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Fragment, useRef, useState } from "react";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { useSnackbar } from "notistack";

const priceTypeDict = { normal: "Normal", offer: "Oferta" };

export default function DownloadReportButton({
  brandComparison,
}: {
  brandComparison: BrandComparison;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    reportFormat: string
  ) => {
    const key = enqueueSnackbar(
      "Generando reporte, espere un momento por favor.",
      {
        persist: true,
        variant: "info",
      }
    );
    setOpen(false);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons}${brandComparison.id}/?export_format=${reportFormat}`
    ).then((res) => {
      closeSnackbar(key);
      enqueueSnackbar("Descargando reporte", {
        variant: "success",
      });
      window.location.href = res.url;
    });
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonGroup ref={anchorRef} variant="contained">
        <Button
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          endIcon={<ArrowDropDownIcon />}
        >
          Descargar
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    onClick={(event) => handleMenuItemClick(event, "xls")}
                  >
                    Formato 1
                  </MenuItem>
                  <MenuItem
                    onClick={(event) => handleMenuItemClick(event, "xls_2")}
                  >
                    formato 2
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
}

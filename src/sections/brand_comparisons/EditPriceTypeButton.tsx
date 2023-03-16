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

const priceTypeDict = { normal: "Normal", offer: "Oferta" };

export default function EditPriceTypeButton({
  brandComparison,
  onComparisonChange,
}: {
  brandComparison: BrandComparison;
  onComparisonChange: Function;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    type: string
  ) => {
    if (brandComparison.price_type === type) {
      return;
    }

    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons}${brandComparison.id}/`,
      {
        method: "PATCH",
        body: JSON.stringify({ price_type: type }),
      }
    ).then((res) => {
      onComparisonChange(res);
      setOpen(false);
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
          Tipo Precio: {priceTypeDict[brandComparison.price_type]}
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
                    selected={brandComparison.price_type === "normal"}
                    onClick={(event) => handleMenuItemClick(event, "normal")}
                  >
                    Normal
                  </MenuItem>
                  <MenuItem
                    selected={brandComparison.price_type === "offer"}
                    onClick={(event) => handleMenuItemClick(event, "offer")}
                  >
                    Oferta
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

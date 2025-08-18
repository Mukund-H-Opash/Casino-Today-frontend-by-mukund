import React from "react";

import { useState, useEffect, MouseEvent } from "react";
import { useSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";


// mui imports
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

// custom imports
import NavItem from "../NavItem";
import { isNull } from "lodash";

// plugins
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { AppState } from "@/store/store";
import Link from "next/link";

type NavGroupProps = {
  [x: string]: any;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
};

interface NavCollapseProps {
  menu: NavGroupProps;
  level: number;
  pathWithoutLastPart: any;
  pathDirect: any;
  hideMenu: any;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

// FC Component For Dropdown Menu
export default function NavCollapse({
  menu,
  level,
  pathWithoutLastPart,
  pathDirect,
  hideMenu,
  onClick,
}: NavCollapseProps) {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const customizer = useSelector((state: AppState) => state.customizer);
  const Icon = menu?.icon;
  const theme = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuIcon =
    level > 1 ? (
      <Icon stroke={1.5} size="1rem" />
    ) : (
      <Icon stroke={1.5} size="1.3rem" />
    );

  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  const isActive = menu.children?.some((item: any) => item.href && pathname.startsWith(item.href)) || (menu.href && pathname.startsWith(menu.href));

  useEffect(() => {
    setOpen(!!isActive);
  }, [isActive]);

  const ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: "2px",
    padding: "8px 10px",
    paddingLeft: hideMenu ? "10px" : level > 2 ? `${level * 15}px` : "10px",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
    borderRadius: `${customizer.borderRadius}px`,
  }));

  // If Menu has Children
  const submenus = menu.children?.map((item: any) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={lgDown ? onClick : isNull}
        />
      );
    }
  });

  const StyledLink = styled(Link)({
    textDecoration: "none",
    color: "inherit",
  });

  const MenuLink = ({ href, children }: any) => {
    return href ? <StyledLink href={href}>{children}</StyledLink> : children;
  };

  return (
    <React.Fragment key={menu.id}>
      <MenuLink href={menu.href}>
        <ListItemStyled
          onClick={handleClick}
          selected={isActive}
          key={menu?.id}
        >
          <ListItemIcon
            sx={{
              minWidth: "36px",
              p: "3px 0",
              color: "inherit",
            }}
          >
            {menuIcon}
          </ListItemIcon>
          <ListItemText color="inherit">
            {hideMenu ? "" : <>{t(`${menu.title}`)}</>}
          </ListItemText>
          {!open ? (
            <IconChevronDown size="1rem" />
          ) : (
            <IconChevronUp size="1rem" />
          )}
        </ListItemStyled>
      </MenuLink>
      <Collapse in={open} timeout="auto">
        {submenus}
      </Collapse>
    </React.Fragment>
  );
}

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutDialog from "./LogoutDialog";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { Badge } from "@mui/material";
import { useQuery } from "react-query";
import $axios from "../../lib/axios.instance";
import { useDispatch } from "react-redux";
import { clearFilter } from "../store/slices/productSlice";

const drawerWidth = 240;
const navItems = [
  {
    id: 1,
    name: "Home",
    path: "/home",
  },
  {
    id: 2,
    name: "Product",
    path: "/product/list",
  },
  {
    id: 3,
    name: "About",
    path: "/about",
  },
];

const Header = (props) => {
  const dispatch = useDispatch();
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // get cart count
  const { isLoading, data } = useQuery({
    queryKey: ["cart-item-count"],
    queryFn: async () => {
      return await $axios.get("/cart/item/count");
    },
    enabled: userRole === "buyer",
  });

  const cartItemCount = data?.data?.cartItemCount;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Nep mart
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            onClick={() => {
              navigate(item.path);
            }}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "#5D3587" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Nep Mart
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" }, mr: "6rem" }}>
            {navItems.map((item) => (
              <NavLink
                onClick={() => {
                  dispatch(clearFilter());
                }}
                key={item.id}
                to={item.path}
                style={{ color: "white", marginRight: "1rem" }}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                {item.name}
              </NavLink>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <Typography>Hi {localStorage.getItem("firstName")}</Typography>

            {userRole === "buyer" && (
              <Badge
                badgeContent={cartItemCount || 0}
                color="primary"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/cart");
                }}
              >
                <ShoppingCartTwoToneIcon sx={{ color: "#fff" }} />
              </Badge>
            )}

            <LogoutDialog />
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Header;

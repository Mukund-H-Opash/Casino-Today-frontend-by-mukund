import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import * as dropdownData from "./data";
import { IconMail } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { AppState, AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/apps/auth/authSlice";
import { getMe } from "@/store/apps/settings/genrelsettingSlice"; 

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: AppState) => state.genrelsetting.user); 

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // ✅ clear token
    router.push("/auth/login"); // ✅ redirect
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="user menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(anchorEl2 && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={
            user?.profileImage
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profileImage}`
              : "/images/profile/user-1.jpg"
          }
          alt={user?.name || "User"}
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "360px", p: 4 } }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={
              user?.profileImage
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profileImage}`
                : "/images/profile/user-1.jpg"
            }
            alt={user?.name || "User"}
            sx={{ width: 95, height: 95 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.name || "Guest User"}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.role || "N/A"}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {user?.email || "N/A"}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {/* {dropdownData.profile.map((profile) => (
          <Box key={profile.title} sx={{ py: 2 }}>
            <Link href={profile.href}>
              <Stack direction="row" spacing={2}>
                <Box
                  width="45px"
                  height="45px"
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar
                    src={profile.icon}
                    alt="image"
                    sx={{ width: 24, height: 24, borderRadius: 0 }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="textPrimary"
                    noWrap
                    sx={{ width: "240px" }}
                  >
                    {profile.title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{ width: "240px" }}
                    noWrap
                  >
                    {profile.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </Link>
          </Box>
        ))} */}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;

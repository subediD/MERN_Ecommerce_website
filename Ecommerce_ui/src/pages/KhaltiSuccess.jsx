import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import $axios from "../../lib/axios.instance";
import { useDispatch } from "react-redux";
import { openErrorSnackbar } from "../store/slices/snackbar.slice";
import Loader from "../components/Loader";

const KhaltiSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // Get a specific query parameter
  const pidx = searchParams.get("pidx");

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["lookup-payment"],
    queryFn: async () => {
      return await $axios.post("/payment/khalti/success", {
        pidx,
      });
    },
  });

  const message = data?.data.message;

  if (isError) {
    dispatch(openErrorSnackbar(error?.response?.data?.message));
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        Khalti payment is {message === "Completed" ? "successful" : "failed."}.
      </Typography>
      <Typography variant="h6">Thank you for chosing us.</Typography>
      <Button variant="contained" onClick={() => navigate("/product/list")}>
        Keep Shopping
      </Button>
    </Stack>
  );
};

export default KhaltiSuccess;

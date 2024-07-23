import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import $axios from "../../lib/axios.instance";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  openErrorSnackbar,
  openSuccessSnackbar,
} from "../store/slices/snackbar.slice";
import Loader from "./Loader";

const ItemCounter = ({ availableQuantity }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const [count, setCount] = useState(1);

  const increaseCount = () => {
    if (count === availableQuantity) {
      setCount(availableQuantity);
    } else {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const decreaseCount = () => {
    if (count === 1) {
      setCount(1);
    } else {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const { isLoading, mutate: addItemToCart } = useMutation({
    mutationKey: ["add-item-cart"],
    mutationFn: async () => {
      return await $axios.post("/cart/add/item", {
        productId: id,
        orderedQuantity: count,
      });
    },
    onSuccess: (res) => {
      dispatch(openSuccessSnackbar(res?.data?.message));
      queryClient.invalidateQueries("cart-item-count");
    },
    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <IconButton
          onClick={increaseCount}
          disabled={count === availableQuantity}
        >
          <AddIcon />
        </IconButton>
        <Typography variant="h5">{count}</Typography>
        <IconButton onClick={decreaseCount} disabled={count < 2}>
          <RemoveIcon />
        </IconButton>
      </Stack>
      <Button
        sx={{
          width: {
            xs: "100%",
            md: "auto",
          },
        }}
        variant="contained"
        color="success"
        onClick={() => {
          addItemToCart();
        }}
      >
        Add to cart
      </Button>
    </>
  );
};

export default ItemCounter;

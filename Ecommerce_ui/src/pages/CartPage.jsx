import React, { useState } from "react";
import CartItem from "../components/CartItem";
import { Box, Button, Stack, Typography } from "@mui/material";
import CartCheckout from "../components/CartCheckout";
import { useMutation, useQuery, useQueryClient } from "react-query";
import $axios from "../../lib/axios.instance";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  openErrorSnackbar,
  openSuccessSnackbar,
} from "../store/slices/snackbar.slice";
import ContinueShopping from "../components/ContinueShopping";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [orderProductList, setOrderProductList] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ["cart-list"],
    queryFn: async () => {
      return await $axios.get("/cart/item/list");
    },
    onSuccess: (res) => {
      const requiredData = res?.data?.cartData.map((item) => {
        return { productId: item.productId, quantity: item.orderedQuantity };
      });

      setOrderProductList(requiredData);
    },
  });

  const cartData = data?.data?.cartData;
  const orderSummary = data?.data?.orderSummary;

  // clear cart
  const { isLoading: flushCartLoading, mutate: flushCart } = useMutation({
    mutationKey: ["flush-cart"],
    mutationFn: async () => {
      return await $axios.delete("/cart/flush");
    },
    onSuccess: (res) => {
      dispatch(openSuccessSnackbar(res?.data?.message));
      queryClient.invalidateQueries("cart-list");
      queryClient.invalidateQueries("cart-item-count");
    },
    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });

  if (isLoading || flushCartLoading) {
    return <Loader />;
  }

  if (cartData?.length === 0) {
    return <ContinueShopping />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h4" textAlign="center">
        Shopping cart
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-start",
          flexWrap: "wrap",
          mt: "3rem",
        }}
      >
        <Stack>
          {cartData.length > 0 && (
            <Button
              variant="contained"
              onClick={flushCart}
              sx={{
                width: {
                  xs: "100%",
                  md: "20%",
                },
              }}
              color="error"
            >
              Clear cart
            </Button>
          )}
          {cartData.map((item) => {
            return <CartItem key={item._id} {...item} />;
          })}
        </Stack>
        <Stack>
          <CartCheckout
            orderProductList={orderProductList}
            subTotal={orderSummary?.subTotal}
            discount={orderSummary?.discount}
            grandTotal={orderSummary?.grandTotal}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default CartPage;

import { Box, Button, Stack } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import $axios from "../../lib/axios.instance";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";

const SellerProductList = () => {
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["seller-product-list"],
    queryFn: async () => {
      return await $axios.post("/product/seller/list", {
        page: 1,
        limit: 5,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const productList = data?.data?.products;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          padding: "2rem",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {productList.map((item) => {
          return <ProductCard key={item._id} {...item} />;
        })}
      </Box>
    </>
  );
};

export default SellerProductList;

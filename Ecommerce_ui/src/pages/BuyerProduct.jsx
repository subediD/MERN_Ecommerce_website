import { Box, Pagination, Stack } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import $axios from "../../lib/axios.instance";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import NoProductFound from "../components/NoProductFound";

const BuyerProductList = () => {
  const [page, setPage] = useState(1);

  const { searchText, category, minPrice, maxPrice, isFilterApplied } =
    useSelector((state) => state.product);

  const { isLoading, error, isError, data } = useQuery({
    queryKey: [
      "buyer-product-list",
      page,
      searchText,
      category,
      minPrice,
      maxPrice,
      isFilterApplied,
    ],
    queryFn: async () => {
      return await $axios.post("/product/buyer/list", {
        page,
        limit: 9,
        searchText,
        category: category || null,
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 0,
      });
    },
  });

  const productList = data?.data?.products;
  const totalPages = data?.data?.numberOfPages;

  if (isLoading) {
    return <Loader />;
  }

  if (productList.length < 1) {
    return <NoProductFound />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "3rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {productList.map((item) => {
          return <ProductCard key={item._id} {...item} />;
        })}
      </Box>
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", mt: "4rem" }}
      >
        <Pagination
          page={page}
          count={totalPages}
          color="secondary"
          onChange={(_, value) => {
            setPage(value);
          }}
        />
      </Stack>
    </>
  );
};

export default BuyerProductList;

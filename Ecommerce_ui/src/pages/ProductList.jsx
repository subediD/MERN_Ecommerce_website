import React from "react";
import SellerProductList from "./SellerProduct";
import BuyerProductList from "./BuyerProduct";
import { Box, Button, Input, InputAdornment, Stack } from "@mui/material";
import ProductFilter from "../components/ProductFilter";
import SearchProduct from "../components/SearchProduct";
import { useDispatch, useSelector } from "react-redux";
import { clearFilter } from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = localStorage.getItem("role");

  const { isFilterApplied } = useSelector((state) => state.product);

  return (
    <>
      <Stack direction="row" spacing={4}>
        {isFilterApplied && (
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              dispatch(clearFilter());
            }}
          >
            Clear Filter
          </Button>
        )}
        <ProductFilter />
        <SearchProduct />

        {userRole === "seller" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              navigate("/product/add");
            }}
          >
            Add product
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          mt: "5rem",
        }}
      >
        {userRole === "seller" ? <SellerProductList /> : <BuyerProductList />}
      </Box>
    </>
  );
};

export default ProductList;

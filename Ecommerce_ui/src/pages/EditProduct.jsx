import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import $axios from "../../lib/axios.instance";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import {
  openErrorSnackbar,
  openSuccessSnackbar,
} from "../store/slices/snackbar.slice";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const categories = [
  "electronics",
  "clothing",
  "grocery",
  "cosmetics",
  "toys",
  "furniture",
  "sports",
  "stationery",
];
const EditProduct = () => {
  const [localUrl, setLocalUrl] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isLoading, data } = useQuery({
    queryKey: ["product-details"],
    queryFn: async () => {
      return await $axios.get(`/product/details/${id}`);
    },
  });

  const productData = data?.data?.product;

  const { isLoading: editProductLoading, mutate: editProduct } = useMutation({
    mutationKey: ["edit-product"],
    mutationFn: async (values) => {
      return await $axios.put(`/product/edit/${id}`, values);
    },
    onSuccess: (response) => {
      navigate(`/product/detail/${id}`);
      dispatch(openSuccessSnackbar(response?.data?.message));
    },
    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box>
      {(editProductLoading || imageLoading) && (
        <LinearProgress color="secondary" />
      )}
      <Formik
        enableReinitialize
        initialValues={{
          name: productData?.name || "",
          brand: productData?.brand || "",
          price: productData?.price || 0,
          quantity: productData?.quantity || 1,
          category: productData?.category,
          image: productData?.image || null,
          description: productData?.description || "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(30, "Name must be at max 30 characters.")
            .required("Name is required.")
            .trim(),
          brand: Yup.string()
            .max(30, "Brand must be at max 30 characters.")
            .required("Brand is required.")
            .trim(),
          price: Yup.number()
            .min(0, "Price must be positive number.")
            .required("Price is required."),
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1.")
            .required("Quantity is required."),
          category: Yup.string()
            .oneOf(categories)
            .required("Category is required."),
          image: Yup.string().nullable(),
          description: Yup.string()
            .required("Description is required.")
            .trim()
            .max(1000, "Description must be at max 1000 characters."),
        })}
        onSubmit={async (values) => {
          let imageUrl;
          if (productImage) {
            try {
              const cloudName = "dlkcko4n6";

              // creates form data object
              const data = new FormData();
              data.append("file", productImage);
              data.append("upload_preset", "nepal_market");
              data.append("cloud_name", cloudName);

              setImageLoading(true);
              const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                data
              );
              setImageLoading(false);

              imageUrl = response?.data?.secure_url;
            } catch (error) {
              console.log(error.message);
            }
          }

          values.image = imageUrl;

          editProduct(values);
        }}
      >
        {({ errors, touched, handleSubmit, getFieldProps }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              gap: "2rem",
              minWidth: "500px",
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
          >
            <Typography variant="h4" textAlign="center">
              Edit product
            </Typography>

            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={localUrl || productData?.image}
                alt={productData.name}
                style={{ maxWidth: "500px", height: "300px" }}
              />
            </Stack>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  const file = event?.target?.files[0];

                  setLocalUrl(URL.createObjectURL(file));
                  setProductImage(file);
                }}
              />
            </Button>

            <FormControl>
              <TextField
                variant="outlined"
                label="Name"
                {...getFieldProps("name")}
              />
              {touched.name && errors.name ? (
                <FormHelperText error>{errors.name}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                variant="outlined"
                label="Brand"
                {...getFieldProps("brand")}
              />
              {touched.brand && errors.brand ? (
                <FormHelperText error>{errors.brand}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                type="number"
                startAdornment={
                  <InputAdornment position="start">Rs.</InputAdornment>
                }
                label="Price"
                {...getFieldProps("price")}
              />
              {touched.price && errors.price ? (
                <FormHelperText error>{errors.price}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                variant="outlined"
                label="Quantity"
                type="number"
                {...getFieldProps("quantity")}
              />
              {touched.quantity && errors.quantity ? (
                <FormHelperText error>{errors.quantity}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category" {...getFieldProps("category")}>
                {categories.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {item}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
              {touched.category && errors.category ? (
                <FormHelperText error>{errors.category}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                variant="outlined"
                label="Description"
                multiline
                rows={8}
                {...getFieldProps("description")}
              />
              {touched.description && errors.description ? (
                <FormHelperText error>{errors.description}</FormHelperText>
              ) : null}
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={editProductLoading}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProduct;

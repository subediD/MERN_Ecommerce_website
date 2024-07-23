import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Formik } from "formik";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  setCategory,
  setMaxPrice,
  setMinPrice,
} from "../store/slices/productSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

const ProductFilter = () => {
  const { category, minPrice, maxPrice } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Filter
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent
          sx={{
            width: "500px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <Formik
            initialValues={{
              category: category || "",
              minPrice: minPrice || 0,
              maxPrice: maxPrice || 0,
            }}
            validationSchema={Yup.object({
              category: Yup.string().oneOf(categories),
              minPrice: Yup.number().min(0, "Min price must be at least 0"),
              maxPrice: Yup.number()
                .min(0, "Max price must be greater than 0.")
                .test({
                  name: "maxPrice",
                  message: "Max price must be greater than min price.",
                  test: function (value) {
                    return value >= this.parent.minPrice;
                  },
                }),
            })}
            onSubmit={(values) => {
              if (values.minPrice) {
                dispatch(setMinPrice(values?.minPrice));
              }

              if (values.maxPrice) {
                dispatch(setMaxPrice(values?.maxPrice));
              }

              if (values.category) {
                dispatch(setCategory(values?.category));
              }

              handleClose();
            }}
          >
            {({ handleSubmit, getFieldProps, touched, errors }) => (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
                name="price-range-picker"
              >
                <Typography variant="h6">Product Filter</Typography>

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category" {...getFieldProps("category")}>
                    {categories.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <TextField
                    label="Min price"
                    type="number"
                    {...getFieldProps("minPrice")}
                  />
                  {touched.minPrice && errors.minPrice ? (
                    <FormHelperText error>{errors.minPrice}</FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl>
                  <TextField
                    label="Max price"
                    type="number"
                    {...getFieldProps("maxPrice")}
                  />
                  {touched.maxPrice && errors.maxPrice ? (
                    <FormHelperText error>{errors.maxPrice}</FormHelperText>
                  ) : null}
                </FormControl>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="success" variant="contained">
                    Apply
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ProductFilter;

import {
  Button,
  FormControl,
  FormHelperText,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import $axios from "../../lib/axios.instance";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openErrorSnackbar } from "../store/slices/snackbar.slice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, mutate: loginUser } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (values) => {
      return await $axios.post("/user/login", values);
    },
    onSuccess: (response) => {
      navigate("/home");

      localStorage.setItem("token", response?.data?.token);

      localStorage.setItem("firstName", response?.data?.user?.firstName);

      localStorage.setItem("role", response?.data?.user?.role);
    },

    onError: (error) => {
      dispatch(openErrorSnackbar(error?.response?.data?.message));
    },
  });
  return (
    <>
      {isLoading && <LinearProgress color="secondary" />}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Must be  valid email.")
            .required("Email is required.")
            .trim()
            .lowercase(),
          password: Yup.string().required("Password is required."),
        })}
        onSubmit={(values) => {
          loginUser(values);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              gap: "2rem",
              minWidth: "400px",
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
          >
            <Typography variant="h4">Sign In</Typography>

            <FormControl>
              <TextField
                variant="outlined"
                label="Email"
                {...getFieldProps("email")}
              />
              {touched.email && errors.email ? (
                <FormHelperText error>{errors.email}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                variant="outlined"
                label="Password"
                {...getFieldProps("password")}
              />
              {touched.password && errors.password ? (
                <FormHelperText error>{errors.password}</FormHelperText>
              ) : null}
            </FormControl>
            <Stack spacing={1}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={isLoading}
              >
                Log in
              </Button>

              <Link to="/register">
                <Typography variant="subtitle2" color="info">
                  New here? Register
                </Typography>
              </Link>
            </Stack>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;

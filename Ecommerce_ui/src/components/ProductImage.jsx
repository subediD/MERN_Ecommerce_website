import { Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProductImage = ({ imageUrl, productId }) => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item>
        <img
          style={{
            objectFit: "cover",
            width: "100%",
          }}
          src={
            imageUrl ||
            "https://www.dcgpac.com/media/catalog/product/placeholder/default/original_4.png"
          }
        />
      </Grid>
    </Grid>
  );
};

export default ProductImage;

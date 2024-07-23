import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ name, brand, image, price, description, _id }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: {
          xs: "100%",
          sm: "80%",
          md: "40%",
          lg: "25%",
        },
        boxShadow:
          " rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <img
        onClick={() => {
          navigate(`/product/detail/${_id}`);
        }}
        style={{
          objectFit: "contain",
          height: "300px",
          width: "100%",
          padding: "5px",
          cursor: "pointer",
        }}
        src={
          image ||
          "https://www.dcgpac.com/media/catalog/product/placeholder/default/original_4.png"
        }
      />
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>

          <Chip label={brand} color="secondary" variant="outlined" />
        </Stack>

        <Typography variant="h6" gutterBottom>
          Rs.{price}
        </Typography>
        <Typography height={100}>{description}...</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", pb: "1rem" }}>
        <Button
          size="medium"
          variant="contained"
          fullWidth
          color="success"
          onClick={() => {
            navigate(`/product/detail/${_id}`);
          }}
        >
          Explore
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

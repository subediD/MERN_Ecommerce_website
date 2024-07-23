import AuthGuard from "../guards/AuthGuard";
import MainLayout from "../layout/MainLayout";
import About from "../page/About";
import AddProduct from "../page/AddProduct";
import CartPage from "../page/CartPage";
import EditProduct from "../page/EditProduct";
import Home from "../page/Home";
import KhaltiSuccess from "../page/KhaltiSuccess";
import ProductDetail from "../page/ProductDetail";
import ProductList from "../page/ProductList";

export const mainRoutes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "product/add",
        element: <AddProduct />,
      },
      {
        path: "product/list",
        element: <ProductList />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "product/detail/:id",
        element: <ProductDetail />,
      },
      {
        path: "product/edit/:id",
        element: <EditProduct />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/payment/khalti/success",
        element: <KhaltiSuccess />,
      },
    ],
  },
];

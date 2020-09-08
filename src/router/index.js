import Vue from "vue";
import Router from "vue-router";
import LoginForm from "@/components/LoginForm";
import CategoryTable from "@/components/CategoryTable";
import ItemTable from "@/components/ItemTable";
import OrderTable from "@/components/OrderTable";
import OrderDetail from "@/components/OrderDetail";
import Payment from "@/components/Payment";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "LoginForm",
    component: LoginForm
  },
  {
    path: "/categories",
    name: "CategoryTable",
    component: CategoryTable
  },
  {
    path: "/items",
    name: "ItemTable",
    component: ItemTable
  },
  {
    path: "/orders",
    name: "OrderTable",
    component: OrderTable
  },
  {
    path: "/orderdetails/:id",
    name: "OrderDetail",
    component: OrderDetail
  },
  {
    path: "/payments/:id",
    name: "Payment",
    component: Payment
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

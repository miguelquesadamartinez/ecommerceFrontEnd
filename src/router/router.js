import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import SimpleLayout from '../layouts/SimpleLayout.vue';
import Home from '../views/Home.vue';
import ProductsList from '../views/ProductsList.vue';
import OrdersList from '../views/OrdersList.vue';
import PharmaciesList from '../views/PharmaciesList.vue';
import Orders from '../views/order/Orders.vue';
import OrderCreate from '../views/order/OrderCreate.vue';
import OrderConfirm from '../views/order/OrderConfirm.vue';
import OrderConfirmed from '../views/order/OrderConfirmed.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import { collapseMenu } from '../../public/js/menu.js';
import { isTokenExpired } from '../services/authService';
import ProductList from '../views/product/ProductList.vue';
import ProductListStocks from '../views/product/ProductListStocks.vue';
import ProductForm from '../views/product/ProductForm.vue';
import PharmacyList from '../views/pharmacy/PharmacyList.vue';
import PharmacyForm from '../views/pharmacy/PharmacyForm.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
        { path: '', component: Home, meta: { requiresAuth: true} },
    ]
  },
  {
    path: '/auth',
    component: SimpleLayout,
    children: [
        { path: 'login', name: 'Login', component: Login },
        { path: 'logout', name: 'Logout', component: Logout },
    ]
  },
  {
    path: '/home',
    component: MainLayout,
    children: [
        { path: '', component: Home, meta: { requiresAuth: true} },
    ]
  },
  {
    path: '/order',
    component: MainLayout,
    children: [
        { path: '', component: Orders, meta: { requiresAuth: true} },
        { path: 'create', component: OrderCreate, meta: { requiresAuth: true} },
        { path: 'update/:order_id', component: OrderCreate, meta: { requiresAuth: true} },
        { path: 'confirm/:order_id/:pharmacy_id', component: OrderConfirm, meta: { requiresAuth: true}, name: 'OrderConfirm' },
        { path: 'confirmed/:order_id/:pharmacy_id', component: OrderConfirmed, meta: { requiresAuth: true}, name: 'OrderConfirmed' },
        { path: 'view/:order_id/:pharmacy_id', component: OrderConfirmed, meta: { requiresAuth: true}, name: 'OrdeView' },
    ]
  },
  {
    path: '/products',
    component: MainLayout,
    children: [
        { path: '', name: 'ProductList', component: ProductList, meta: { requiresAuth: true} },
        { path: 'stocks', name: 'ProductStock', component: ProductListStocks, meta: { requiresAuth: true} },
        { path: 'create', name: 'ProductCreate', component: ProductForm, meta: { requiresAuth: true} },
        { path: 'edit/:id', name: 'ProductEdit', component: ProductForm, meta: { requiresAuth: true} },
    ]
  },
  {
    path: '/pharmacies',
    component: MainLayout,
    children: [
        { path: '', name: 'PharmacyList', component: PharmacyList, meta: { requiresAuth: true} },
        { path: 'create', name: 'PharmacyCreate', component: PharmacyForm, meta: { requiresAuth: true} },
        { path: 'edit/:id/:update', name: 'PharmacyEdit', component: PharmacyForm, meta: { requiresAuth: true} },
        { path: 'create-new/', name: 'PharmacyNew', component: PharmacyForm, meta: { requiresAuth: true} },
        { path: 'confirm-data/:id', name: 'PharmacyFrom', component: PharmacyForm, meta: { requiresAuth: true} },
    ]
  },
  { path: '/orders',
    component: MainLayout,
    children: [
        { path: '', component: OrdersList, meta: { requiresAuth: true} },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');
    const expired = await isTokenExpired();
    if (to.meta.requiresAuth && (!token || expired === true)) {
      next('/auth/login');
    } else {
      next();
    }
});

router.afterEach((to) => {
      collapseMenu();
});

export default router;

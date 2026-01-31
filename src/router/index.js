import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue'; 
import Home from '../views/Home.vue';
import Productos from '../views/Productos.vue';

const routes = [
  {
    path: '/',
    component: MainLayout, 
    children: [
        { path: '', component: Home },
        { path: 'productos', component: Productos },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

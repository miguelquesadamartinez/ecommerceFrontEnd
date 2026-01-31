
<script setup>
const user_type = localStorage.getItem("user_type");
</script>

<template>
<ul class="SidebarLayout navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

    <hr class="sidebar-divider">
    <li id="idOrder" class="nav-item" v-if="user_type === 'Call' || user_type === 'Apm' || user_type === 'Admin'">
    <router-link to="/order" class="nav-link" id="collapseOrder">
        <i class="fas fa-fw fa-shopping-cart"></i>
        <span>Commandes</span>
    </router-link>
    </li>
    <hr class="sidebar-divider">
    <li id="idProduct" class="nav-item" v-if="user_type === 'Manager' || user_type === 'Admin'">
    <router-link to="/products" class="nav-link" id="collapseProduct">
        <i class="fas fa-fw fa-box"></i>
        <span>Gestion des produits</span>
    </router-link>
    </li>
    <li id="idProductStock" class="nav-item" v-if="user_type === 'Manager' || user_type === 'Admin'">
    <router-link to="/products/stocks" class="nav-link" id="collapseProductStock">
        <i class="fas fa-fw fa-box"></i>
        <span>Contrôle des produits</span>
    </router-link>
    </li>
    <hr class="sidebar-divider">
    <li id="idPharmacies" class="nav-item" v-if="user_type === 'Admin' || user_type === 'Call'">
    <router-link to="/pharmacies" class="nav-link" id="collapsePharmacy">
        <i class="fas fa-fw fa-clinic-medical"></i>
        <span>Gestion des pharmacies</span>
    </router-link>
    </li>
    <hr class="sidebar-divider">
    <li id="idComande" class="nav-item" v-if="user_type === 'Admin'">
    <router-link to="/orders" class="nav-link" id="collapseComandes">
        <i class="fas fa-fw fa-clinic-medical"></i>
        <span>Gestion des Commandes</span>
    </router-link>
    </li>
</ul>
</template>

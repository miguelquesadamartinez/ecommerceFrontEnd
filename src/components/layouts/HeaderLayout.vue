<template>
  <!-- ======= Header ======= -->

  <nav
    class="HeaderLayout navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"
  >
    <!-- Sidebar Toggle (Topbar) -->
    <button
      id="sidebarToggleTop"
      class="btn btn-link d-md-none rounded-circle mr-3"
    >
      <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Navbar -->
    <ul class="navbar-nav mr-auto">
      <a
        class="sidebar-brand d-flex align-items-center justify-content-center"
        href="/"
      >
        <div class="sidebar-brand-icon">
          <img src="/noName-logo-color.svg" class="logo_header" />
        </div>
      </a>
    </ul>

    <ul class="navbar-nav mc-auto">
      <div class="sidebar-brand-text mx-3 text_header">
        NoName Ventes Directes
      </div>
    </ul>

    <!-- Nav Item - User Information -->
    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown no-arrow">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="userDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{
            user_name
          }}</span>
        </a>
        <!-- Dropdown - User Information -->
        <div
          class="dropdown-menu dropdown-menu-end shadow animated--grow-in"
          aria-labelledby="userDropdown"
        >
          <a href="#" @click.prevent="handleLogout" class="dropdown-item">
            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            Déconnexion
          </a>
        </div>
      </li>
    </ul>
  </nav>
  <div class="header-layout d-flex align-items-center justify-content-between">
    <a href="index.html" class="logo d-flex align-items-center">
      <img src="/noName-logo-color.svg" alt="NoName Logo" />
    </a>
    <i class="bi bi-list toggle-sidebar-btn"></i>
  </div>
  <!-- End Logo -->
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const errorMessage = ref("");
const router = useRouter();
const user_name = localStorage.getItem("user_name");

const handleLogout = async () => {
  try {
    await logout();
    router.push("/auth/login");
  } catch (error) {
    console.error("Error al cerrar sesión", error.message);
  }
};

const logout = async () => {
  try {
    localStorage.removeItem("token"); // Eliminamos el token
    localStorage.removeItem("tokenExpiry");
    errorMessage.value = "Séance close.";
    sessionStorage.setItem("logoutMessage", errorMessage.value);
    //router.push({ path: '/login', query: { error: errorMessage.value } });
  } catch (error) {
    console.error("Erreur de déconnexion", error.message);
  }
};
</script>

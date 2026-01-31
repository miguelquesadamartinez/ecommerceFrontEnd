<template>
  <div id="wrapper">

    <SidebarLayout />

    <div id="content-wrapper" class="d-flex flex-column">
      <!-- Main Content -->
      <div id="content">
        <HeaderLayout />

        <div class="container-fluid">
          <!-- Main Content -->
          <main class="flex-grow p-6 overflow-auto">
            <router-view></router-view>
          </main>
        </div>
      </div>
    </div>
  </div>

</template>
  
<script setup>
import HeaderLayout from '../components/layouts/HeaderLayout.vue';
import SidebarLayout from '../components/layouts/SidebarLayout.vue';

import { onMounted } from 'vue';
import { collapseMenu } from '../../public/js/menu.js';

onMounted(() => {
  collapseMenu(); // Ejecuta la función collapseMenu después de que el componente se haya montado
});

</script>
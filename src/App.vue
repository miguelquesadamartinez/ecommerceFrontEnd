<script setup></script>

<template>
  <router-view />
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  color: #333;
}

header {
  background-color: #004b87; /* Color azul de NoName */
  color: white;
  padding: 1rem;
  text-align: center;
}

.container {
  display: flex;
}

aside {
  width: 200px;
  background-color: #e5e5e5; /* Color gris claro */
  padding: 1rem;
}

aside nav ul {
  list-style-type: none;
  padding: 0;
}

aside nav ul li {
  margin: 1rem 0;
}

aside nav ul li a {
  color: #004b87; /* Color azul de NoName */
  text-decoration: none;
}

main {
  flex: 1;
  padding: 1rem;
}
</style>

<template>
  <div class="simple-layout">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.simple-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*height: 75vh;*/
  background-color: #f0f0f0;
}

header {
  background-color: #004B87;
  color: white;
  padding: 1rem;
  width: 100%;
  text-align: center;
  height: 100px;
}

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>

<template>
  <div class="login-container">
    <div class="text-2xl font-bold flex items-center mb-5">
      <img
        height="100px"
        src="/noName-logo-color.svg"
        alt="NoName Logo"
        class="h-8 mr-2"
      />
    </div>
    <h1 style="margin-bottom: 30px">NoName Ventes Directes</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="pfizer_input" />
      </div>
      <div class="form-group" style="margin-bottom: 30px">
        <label for="password">Mot de passe:</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="toggle-password"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/authService";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const success = await login(email.value, password.value);
    if (!success.hasOwnProperty("wrongLogin")) {
      router.push("/view/productos"); // Redirigir a la página de inicio después del login
    } else {
      errorMessage.value =
        "La connexion a échoué. Vérifiez vos informations d'identification.";
      router.push("/login");
    }
  } catch (error) {
    errorMessage.value =
      "La connexion a échoué. Vérifiez vos informations d'identification.";
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-container input {
  flex: 1;
  padding-right: 2.5rem;
}

.pfizer_input {
  padding-right: 0rem !important;
  width: 95%;
  z-index: 1;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #004b87;
  cursor: pointer;
  font-size: 1.2rem;
  text-align: center;
  width: 30px;
}

.toggle-password:hover {
  background-color: transparent;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #004b87;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #003366;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>

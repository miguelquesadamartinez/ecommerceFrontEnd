<template>
  <div class="login-container">
    <div class="text-2xl font-bold flex items-center mb-5">
      <img src="/noName-logo-color.svg" alt="NoName Logo" class="h-8 mr-2" />
    </div>
    <h3 style="margin-bottom: 30px">NoName Ventes Directes</h3>

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

      <!-- CAPTCHA affiché après 3 erreurs -->
      <div v-if="showCaptcha" style="margin-bottom: 20px">
        <vue-recaptcha
          sitekey="6LdEuFsrAAAAALpW-4w0ZW0JSHFSifLjI60vEaYg"
          @verify="onCaptchaVerified"
        />
      </div>

      <button type="submit">Se connecter</button>
    </form>

    <p v-if="errorMessage" class="error_login">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "../services/authService";
import VueRecaptcha from "vue-recaptcha";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const router = useRouter();
const route = useRoute();
const captchaToken = ref("");
const showCaptcha = ref(false);

onMounted(() => {
  const message = sessionStorage.getItem("logoutMessage");
  if (message) {
    errorMessage.value = message;
    sessionStorage.removeItem("logoutMessage"); // Limpiar el mensaje después de leerlo
  }
});

const onCaptchaVerified = (token) => {
  captchaToken.value = token;
};

/*const handleLogin = async () => {
  try {
    const success = await login(email.value, password.value);
    if (!success.hasOwnProperty('wrongLogin')) {

      const user_type = localStorage.getItem("user_type");
      if (user_type === 'Call' || user_type === 'Apm') {
        router.push('/order');
      } else if (user_type === 'Manager' || user_type === 'Admin'){
        router.push('/products'); 
      }

    } else {
      errorMessage.value = 'La connexion a échoué. Vérifiez vos informations d\'identification.';
      router.push('/auth/login');
    }
  } catch (error) {
    errorMessage.value = 'La connexion a échoué. Vérifiez vos informations d\'identification.';
  }
};*/

const handleLogin = async () => {
  try {
    const response = await login(
      email.value,
      password.value,
      captchaToken.value,
    ); // on ajoute captchaToken si nécessaire

    // Si login réussi (pas de wrongLogin et pas de validate_captcha)
    if (
      !response.hasOwnProperty("wrongLogin") &&
      !response.hasOwnProperty("validate_captcha")
    ) {
      const user_type = localStorage.getItem("user_type");

      if (user_type === "Call" || user_type === "Apm") {
        router.push("/order");
      } else if (user_type === "Manager" || user_type === "Admin") {
        router.push("/products");
      }
    } else {
      // Gestion des cas d'erreur

      if (response.hasOwnProperty("validate_captcha")) {
        errorMessage.value = response.validate_captcha[0];
      } else {
        errorMessage.value =
          "La connexion a échoué. Vérifiez vos informations d'identification.";
      }

      // Si le backend demande d'afficher le CAPTCHA
      showCaptcha.value = response.show_captcha === true;

      // On reste sur la page de login (inutile de router.push ici sauf cas spécial)
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

<template>
  <div class="card shadow mb-4">
    <!-- Mensaje de notificación -->
    <Transition name="fade">
      <div v-if="notification.show" 
           :class="`alert alert-${notification.type} alert-dismissible show m-3`" 
           role="alert">
        {{ notification.message }}
        <button type="button" 
                class="close" 
                @click="notification.show = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </Transition>

    <div class="card-header card-header-left">
      <h5>{{ isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit' }}</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="submitForm">
        <div class="row">
          <!-- First column -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="product_sap_id">ID SAP</label>
              <input type="text" class="form-control" id="product_sap_id" v-model="product.product_sap_id">
            </div>

            <div class="form-group">
              <label for="product_cip13">CIP13</label>
              <input type="text" class="form-control" id="product_cip13" v-model="product.product_cip13">
            </div>

            <div class="form-group">
              <label for="product_category_id">Catégorie</label>
              <select class="form-control" id="product_category_id" v-model="product.product_category_id">
                <option value="">Sélectionner une catégorie</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.category_name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="product_name">Nom du produit*</label>
              <input type="text" class="form-control" id="product_name" v-model="product.product_name" required>
            </div>

            <div class="form-group">
              <label for="product_presentation">Présentation</label>
              <input type="text" class="form-control" id="product_presentation" v-model="product.product_presentation">
            </div>

            <div class="form-group">
              <label for="product_unit_price">Prix unitaire*</label>
              <div class="input-group">
                <input type="number" step="0.01" class="form-control" id="product_unit_price" v-model="product.product_unit_price" required>
                <div class="input-group-append">
                  <span class="input-group-text">€</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="product_unit_price_pght">Prix unitaire PGHT</label>
              <div class="input-group">
                <input type="number" step="0.01" class="form-control" id="product_unit_price_pght" v-model="product.product_unit_price_pght">
                <div class="input-group-append">
                  <span class="input-group-text">€</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="product_box_quantity">Quantité par boîte</label>
              <input type="number" class="form-control" id="product_box_quantity" v-model="product.product_box_quantity">
            </div>

            <div class="form-group">
              <label for="product_bundle_quantity">Quantité par lot</label>
              <input type="number" class="form-control" id="product_bundle_quantity" v-model="product.product_bundle_quantity">
            </div>

            <div class="form-group">
              <label for="product_quote">Quote</label>
              <input type="number" class="form-control" id="product_quote" v-model="product.product_quote">
            </div>
          </div>

          <!-- Second column -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="product_allocation">Allocation</label>
              <input type="number" class="form-control" id="product_allocation" v-model="product.product_allocation">
            </div>
   
            <div class="form-group">
              <label>Période de vente</label>
              <div class="row">
                <div class="col-md-6">
                  <label for="product_sell_from_date">Date de début</label>
                  <input type="date" class="form-control" id="product_sell_from_date" v-model="product.product_sell_from_date">
                </div>
                <div class="col-md-6">
                  <label for="product_sell_from_time">Heure de début</label>
                  <input type="time" class="form-control" id="product_sell_from_time" v-model="product.product_sell_from_time">
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label for="product_sell_to_date">Date de fin</label>
                  <input type="date" class="form-control" id="product_sell_to_date" v-model="product.product_sell_to_date">
                </div>
                <div class="col-md-6">
                  <label for="product_sell_to_time">Heure de fin</label>
                  <input type="time" class="form-control" id="product_sell_to_time" v-model="product.product_sell_to_time">
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="product_min_order">Commande minimale</label>
              <input type="number" class="form-control" id="product_min_order" v-model="product.product_min_order">
            </div>

            <div class="form-group">
              <label for="product_max_order">Commande maximale</label>
              <input type="number" class="form-control" id="product_max_order" v-model="product.product_max_order">
            </div>

            <div class="form-group">
              <label for="product_status">Statut</label>
              <select class="form-control" id="product_status" v-model="product.product_status">
                <option value="Disponible">Disponible</option>
                <option value="Indisponible">Indisponible</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="product_active" v-model="activeValue">
              <label class="form-check-label" for="product_active">Produit actif</label>
            </div>

            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="product_short_term" v-model="shortTermValue">
              <label class="form-check-label" for="product_short_term">Produit à court terme</label>
            </div>

            <div class="form-group">
              <label for="product_expiration_date">Date péremption</label>
              <input type="date" class="form-control" id="product_expiration_date" v-model="product.product_expiration_date">
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <button type="button" class="btn btn-secondary mr-2" @click="cancel">Annuler</button>
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ErrorHandler } from '../../services/errorHandlingService';
import { getProductId, getCategories } from "../../services/getService";
import { updateProduct } from "../../services/productService";

const router = useRouter();
const route = useRoute();

// Estado para la notificación
const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

// Función para mostrar notificación
const showNotification = (message, type = 'success') => {
  // Scroll hacia arriba de la página
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  notification.value = {
    show: true,
    message,
    type
  };
  
  // Auto ocultar después de 5 segundos
  setTimeout(() => {
    notification.value.show = false;
  }, 5000);
};

const product = ref({
  product_sap_id: '',
  product_cip13: '',
  product_category_id: null,
  product_name: '',
  product_presentation: '',
  product_unit_price: '',
  product_unit_price_pght: '',
  product_box_quantity: null,
  product_bundle_quantity: null,
  product_quote: null,
  product_allocation: null,
  product_min_order: null,
  product_max_order: null,
  product_status: 'saleable',
  product_active: true,
  product_sell_from_date: null,
  product_sell_from_time: null,
  product_sell_to_date: null,
  product_sell_to_time: null,
  product_short_term: false,
  product_expiration_date: null
});

const categories = ref([]);
const isEditing = computed(() => route.params.id !== undefined);

const shortTermValue = computed({
  get() {
    return product.value.product_short_term === 1 || product.value.product_short_term === true;
  },
  set(value) {
    product.value.product_short_term = value ? 1 : 0;
  }
});

const activeValue = computed({
  get() {
    return product.value.product_active === 1 || product.value.product_active === true;
  },
  set(value) {
    product.value.product_active = value ? 1 : 0;
  }
});

onMounted(async () => {
  try {
    // Cargar categorías
    const categoriesResponse = await getCategories();
    categories.value = categoriesResponse.data;
    
    // Cargar datos del producto
    const response = await getProductId(route.params.id);
    product.value = {
      ...response.data,
      product_active: response.data.product_active === true || response.data.product_active === 1 || response.data.product_active === "1",
      product_short_term: response.data.product_short_term === true || response.data.product_short_term === 1 || response.data.product_short_term === "1"
    };
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductForm',
      action: 'onMounted'
    });
    console.error("Error loading form data:", error.message);
  }
});

const submitForm = async () => {
  try {
    // Validate form
    if (!validateForm()) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    await updateProduct(route.params.id, product.value);
    showNotification('Le produit a été mis à jour avec succès');
    
    // Pequeña pausa para que el usuario vea el mensaje antes de la redirección
    setTimeout(() => {
      router.push(`/products/edit/${route.params.id}`);
    }, 1000);

  } catch (error) {
    showNotification('Une erreur est survenue lors de la mise à jour du produit', 'danger');
    ErrorHandler.handleError(error, {
      component: 'ProductForm',
      action: 'submitForm'
    });
  }
};

const validateForm = () => {
  let isValid = true;
  
  // Check required fields
  if (!product.value.product_name || product.value.product_name.trim() === '') {
    document.getElementById('product_name').classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('product_name').classList.remove('is-invalid');
  }
  
  if (!product.value.product_unit_price) {
    document.getElementById('product_unit_price').classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('product_unit_price').classList.remove('is-invalid');
  }
  
  return isValid;
};

// Add input event listeners to remove is-invalid class when field has value
const addInputListeners = () => {
  const fields = ['product_name', 'product_unit_price'];
  
  fields.forEach(field => {
    const input = document.getElementById(field);
    if (input) {
      input.addEventListener('input', (event) => {
        if (event.target.value.trim() !== '') {
          event.target.classList.remove('is-invalid');
        }
      });
    }
  });
};

// Call this function after component is mounted
onMounted(() => {
  addInputListeners();
});

const cancel = () => {
  router.push({ name: 'ProductList' });
};
</script>

<style scoped>
/* Animaciones para el mensaje */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.alert {
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-dismissible .close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem 1.25rem;
  color: inherit;
}

.card-header-left {
  text-align: left;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.invalid-feedback {
  display: block;
}
</style>



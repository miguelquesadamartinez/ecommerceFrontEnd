
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { searchPharmacies } from "../../services/getService";
import { ErrorHandler } from '../../services/errorHandlingService';

const searchText = ref('');
const pharmacies = ref([]);
const router = useRouter();

onMounted(async () => {
    localStorage.removeItem("pharmacy");
    localStorage.removeItem("pharmacy_id");
});
const handleSubmit = () => {
  getPharmaciesFromSearch();
};
const getPharmaciesFromSearch = async () => {
  try {
    const response = await searchPharmacies(searchText.value);
    pharmacies.value = response.data;
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'Orders',
      action: 'getPharmaciesFromSearch'
    });
    console.error('Error al obtener farmacias:', error.message);
  }
};

const selectPharmacy = async (pharmacy) => {
  try {
    localStorage.setItem("pharmacy", pharmacy.pharmacy_cip13);
    localStorage.setItem("pharmacy_id", pharmacy.id);
    router.push('/pharmacies/confirm-data/' + pharmacy.id);
    
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'Orders',
      action: 'selectPharmacy'
    });
    console.error('Error al obtener la farmacia:', error.message);
  }
};
const newPharmacy = async () => {
  try {
    router.push({
      path: '/pharmacies/create-new',
      query: { searchText: searchText.value }
    });
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'Orders',
      action: 'newPharmacy'
    });
    console.error('Error al redireccionar:', error.message);
  }
};

watch(searchText, async (newValue) => {
  await getPharmaciesFromSearch();
});
</script>
<template>
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Rechercher une pharmacie</h1>
  </div>
  <div class="card shadow mb-4">
      <div class="card-body">
          <div class="row">
              <div class="col-lg-12">
                  <div class="p-3">
                      <form @submit.prevent="handleSubmit" class="user">
                          <div class="form-group row">
                              <div class="col-sm-12 mb-3 mb-sm-0">
                                  <input value="" type="text" class="form-control form-control-user" 
                                  name="searchText" id="searchText" v-model="searchText" 
                                      placeholder="Téléphone ou CIP">
                                  <ul v-if="pharmacies.length" class="suggestions-list">
                                    <li class="nav-item" v-for="pharmacy in pharmacies" :key="pharmacy.id" @click="selectPharmacy(pharmacy)">
                                      {{ pharmacy.pharmacy_name }}
                                      <span style="color: red; font-weight: bold;">
                                        {{ pharmacy.pharmacy_account_status ? `(Bloquée)` : '' }}
                                      </span>
                                    </li>
                                  </ul>
                              </div>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
                <div class="p-3">
                  <div class="text-center mt-3">
                    <button class="btn btn-primary" @click.prevent="newPharmacy()">Nouvelle pharmacie</button>
                  </div>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

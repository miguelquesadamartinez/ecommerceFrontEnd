<template>
  <div class="card shadow mb-4">
    <div class="card-header card-header-left d-flex justify-content-between align-items-center">
      <h5>Liste des pharmacies</h5>
    </div>
    <div class="card-body">
      <div class="form-group row mb-4">
        <div class="col-sm-12">
          <div class="input-group">
            <input type="text" class="form-control form-control-user"
              v-model="searchText" @keyup.enter="searchPharmacies"
              placeholder="Rechercher par nom, CIP13 ou ID SAP">
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" @click="searchPharmacies">
                <i class="fas fa-search"></i> Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-bordered text-12" width="100%" cellspacing="0">
          <thead>
            <tr>
              <th class="th-sm">ID SAP</th>
              <th class="th-sm">CIP13</th>
              <th class="th-sm">Nom</th>
              <th class="th-sm">Ville</th>
              <th class="th-sm">Téléphone</th>
              <th class="th-sm">Statut</th>
              <th class="th-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pharmacy in paginatedPharmacies" :key="pharmacy.id">
              <td>{{ pharmacy.pharmacy_sap_id }}</td>
              <td>{{ pharmacy.pharmacy_cip13 }}</td>
              <td>{{ pharmacy.pharmacy_name }}</td>
              <td>{{ pharmacy.pharmacy_city }}</td>
              <td>{{ pharmacy.pharmacy_phone }}</td>
              <td>
                <span :class="`badge badge-${pharmacy.pharmacy_status === 'Active' ? 'success' : pharmacy.pharmacy_status === 'Blocked' ? 'danger' : 'warning'}`">
                  {{ getStatusLabel(pharmacy.pharmacy_status) }}
                </span>
              </td>
              <td>
                <router-link :to="{ name: 'PharmacyEdit', params: { id: pharmacy.id, update: '1' }}" class="btn btn-sm btn-info mr-1">
                  <i class="fas fa-edit"></i>
                </router-link>
              </td>
            </tr>
            <tr v-if="pharmacies.length === 0">
              <td colspan="7" class="text-center">Aucune pharmacie trouvée</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination controls -->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="text-muted">
          Affichage de {{ paginationInfo.from }} à {{ paginationInfo.to }} sur {{ total }} pharmacies
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(1)">
                <i class="fas fa-angle-double-left"></i>
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                <i class="fas fa-angle-left"></i>
              </a>
            </li>
            <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                <i class="fas fa-angle-right"></i>
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(totalPages)">
                <i class="fas fa-angle-double-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ErrorHandler } from '../../services/errorHandlingService';
import { getPharmacies } from "../../services/getService";

const router = useRouter();
const pharmacies = ref([]);
const searchText = ref('');
const selectedPharmacy = ref(null);

const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);

const paginatedPharmacies = computed(() => {
  return pharmacies.value;
});

const paginationInfo = computed(() => {
  const from = pharmacies.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1;
  const to = Math.min(currentPage.value * perPage.value, total.value);
  return { from, to };
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const getStatusClass = (status) => {
  switch (status) {
    case 'Active':
      return 'badge badge-success';
    case 'Inactive':
      return 'badge badge-warning';
    case 'Blocked':
      return 'badge badge-danger';
    default:
      return 'badge badge-secondary';
  }
};

const getStatusLabel = (status) => {
  return {
    'Active': 'Actif',
    'Inactive': 'Inactif',
    'Blocked': 'Bloqué'
  }[status] || status;
};

const searchPharmacies = async () => {
  currentPage.value = 1;
  await loadPharmacies();
};

const loadPharmacies = async () => {
  try {
    const response = await getPharmacies(currentPage.value, perPage.value, searchText.value);
    pharmacies.value = response.data.data;
    total.value = response.data.total;
    totalPages.value = Math.ceil(response.data.total / perPage.value);
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'PharmacyList',
      action: 'loadPharmacies'
    });
  }
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await loadPharmacies();
  }
};

onMounted(async () => {
  await loadPharmacies();
});
</script>

<style scoped>
.text-12 {
  font-size: 12px;
}
.badge {
  font-size: 85%;
}
</style>



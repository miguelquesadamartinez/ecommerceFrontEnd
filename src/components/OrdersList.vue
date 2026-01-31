<script setup>
import { ref, onMounted } from "vue";
import { getOrders } from "../services/getService";
import { ErrorHandler } from "../services/errorHandlingService";

const orders = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);

const getOrdersData = async (page = 1) => {
  try {
    const response = await getOrders(page, perPage.value);
    orders.value = response.data.data;
    total.value = response.data.total;
    totalPages.value = Math.ceil(response.data.total / perPage.value);
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderList",
      action: "getOrdersData",
    });
    console.error("Erreur lors du chargement des commandes:", error.message);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  getOrdersData(page);
};

onMounted(async () => {
  await getOrdersData();
});
</script>

<template>
  <div class="card shadow mb-4">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered" width="100%" cellspacing="0">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Modifier</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.order_reference }}</td>
              <td>{{ order.order_amount }} €</td>
              <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
              <td>
                <span
                  :class="`badge ${
                    order.order_status === 'Exported'
                      ? 'badge-success'
                      : order.order_status === 'Pending to export'
                        ? 'badge-primary'
                        : order.order_status === 'Draft'
                          ? 'badge-secondary'
                          : order.order_status === 'Blocked'
                            ? 'badge-danger'
                            : order.order_status === 'Blocked NoName'
                              ? 'badge-danger'
                              : order.order_status === 'On hold'
                                ? 'badge-warning'
                                : 'badge-info'
                  }`"
                >
                  {{ order.order_status }}
                </span>
              </td>
              <td>
                <router-link
                  :to="`/order/update/${order.id}`"
                  class="block py-2 px-4 rounded hover:bg-blue-100"
                >
                  <span class="badge badge-primary"> Modifier </span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav v-if="totalPages > 1">
          <div class="d-flex justify-content-between align-items-center">
            <div class="pagination-info">
              Affichage de {{ (currentPage - 1) * perPage + 1 }} à
              {{ Math.min(currentPage * perPage, total) }} sur
              {{ total }} Commandes
            </div>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="handlePageChange(currentPage - 1)"
                >
                  Précédent
                </a>
              </li>

              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="handlePageChange(page)"
                >
                  {{ page }}
                </a>
              </li>

              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="handlePageChange(currentPage + 1)"
                >
                  Suivant
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination-info {
  color: #858796;
  font-size: 0.875rem;
}

.badge {
  padding: 0.5em 0.75em;
  font-size: 0.75em;
  border-radius: 0.25rem;
}

.badge-success {
  background-color: #1cc88a;
  color: #fff;
}

.badge-warning {
  background-color: #f6c23e;
  color: #fff;
}

.table {
  margin-bottom: 1rem;
}

.table th {
  background-color: #f8f9fc;
  border-bottom-width: 1px;
}
</style>

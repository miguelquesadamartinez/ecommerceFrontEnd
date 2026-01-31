<script setup>
import { ref, onMounted } from 'vue';
import { getProducts } from "../services/getService";
import { ErrorHandler } from '../services/errorHandlingService';

const productos = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);

const getProductsData = async (page = 1) => {
    try {
        const response = await getProducts(page, perPage.value);
        productos.value = response.data.data;
        total.value = response.data.total;
        totalPages.value = Math.ceil(response.data.total / perPage.value);
    } catch (error) {
        ErrorHandler.handleError(error, {
            component: 'ProductsList',
            action: 'getProductsData'
        });
        console.error('Erreur lors du chargement des produits:', error.message);
    }
};

const handlePageChange = (page) => {
    currentPage.value = page;
    getProductsData(page);
};

onMounted(async () => {
    await getProductsData();
});
</script>

<template>
    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Code CIP13</th>
                            <th>Nom du produit</th>
                            <th>Prix</th>
                            <th>Statut</th>
                            <th>Modifier</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="producto in productos" :key="producto.id">
                            <td>{{ producto.product_cip13 }}</td>
                            <td>{{ producto.product_presentation }}</td>
                            <td>{{ producto.product_unit_price_pght }}€</td>
                                <td>
                                <span :class="`badge badge-${producto.product_status === 'saleable' ? 'success' : 'warning'}`">
                                    {{ producto.product_status === 'saleable' ? 'Saleable' : 'Non disponible' }}
                                </span>
                            </td>
                            <td>
                                <router-link :to="`/product/edit/${producto.id}`" class="block py-2 px-4 rounded hover:bg-blue-100">
                                    <span class="badge badge-primary">
                                        Modifier
                                    </span>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Pagination -->
                <nav v-if="totalPages > 1">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="pagination-info">
                            Affichage de {{ (currentPage - 1) * perPage + 1 }} 
                            à {{ Math.min(currentPage * perPage, total) }} 
                            sur {{ total }} Pharmacies
                        </div>
                        <ul class="pagination">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage - 1)">
                                    Précédent
                                </a>
                            </li>
                            
                            <li v-for="page in totalPages" 
                                :key="page" 
                                class="page-item"
                                :class="{ active: page === currentPage }">
                                <a class="page-link" 
                                   href="#" 
                                   @click.prevent="handlePageChange(page)">
                                    {{ page }}
                                </a>
                            </li>
                            
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <a class="page-link" 
                                   href="#" 
                                   @click.prevent="handlePageChange(currentPage + 1)">
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

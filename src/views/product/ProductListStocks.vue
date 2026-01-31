<template>
  <div class="card shadow mb-4">
    <div class="card-header card-header-left d-flex justify-content-between align-items-center">
      <h5>Liste de contrôle des produits</h5>
      <div>
        <input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" @change="importFromExcel">
        <button class="btn btn-primary mr-2" @click="triggerFileInput">
          <i class="fas fa-file-upload mr-1"></i> Importer Excel
        </button>
        <button class="btn btn-success" @click="exportToExcel">
          <i class="fas fa-file-excel mr-1"></i> Exporter Excel
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="form-group row mb-4">
        <div class="col-sm-12">
          <div class="input-group">
            <input type="text" class="form-control form-control-user"
              v-model="searchText" @keyup.enter="searchProducts"
              placeholder="Rechercher par Nom, Category, CIP ou SAP ID">
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" @click="searchProducts">
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
              <th class="th-sm">SAP</th>
              <th class="th-sm">CIP13</th>
              <th class="th-sm">Présentation</th>
              <th class="th-sm">Catégorie</th>
              <th class="th-sm">Min par commande</th>
              <th class="th-sm">Max par commande</th>
              <th class="th-sm">Allocation</th>
              <th class="th-sm">Contingentement</th>
              <th class="th-sm">Vente mensuelle</th>
              <th class="th-sm">Dernière mise à jour</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td>{{ product.product_sap_id }}</td>
              <td>{{ product.product_cip13 }}</td>
              <td>{{ product.product_presentation }}</td>
              <td>{{ product.category_name || 'Non catégorisé' }}</td>
              <td>{{ product.product_min_order }}</td>
              <td>{{ product.product_max_order }}</td>
              <td>{{ product.product_allocation !== null && product.product_allocation !== '' ? product.product_allocation : 0 }}</td>
              <td>{{ product.product_quote !== null && product.product_quote !== '' ? product.product_quote : 0 }}</td>
              <td>
                <span :class="getMonthlySalesClass(product)">
                  {{ product.product_monthly_sales !== null && product.product_monthly_sales !== '' ? product.product_monthly_sales : 0 }}
                </span>
              </td>
              <td>{{ formatDate_own(product.updated_at) || '' }}</td>
            </tr>
            <tr v-if="total == 0">
              <td colspan="10" class="text-center">Aucun produit trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination controls -->
      <div v-if="total != 0" class="d-flex justify-content-between align-items-center mt-4">
        <div class="text-muted">
          Affichage de {{ paginationInfo.from }} à {{ paginationInfo.to }} sur {{ total }} produits
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

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Confirmer la suppression</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Êtes-vous sûr de vouloir supprimer le produit <strong>{{ selectedProduct?.product_name }}</strong>?
          Cette action est irréversible.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ErrorHandler } from '../../services/errorHandlingService';
import { getProducts } from "../../services/getService";
import axios from 'axios';
import { API_CONFIG } from '../../config/config';
// Importar la librería para Excel
import * as XLSX from 'xlsx';

const router = useRouter();
const products = ref([]);
const searchText = ref('');
const selectedProduct = ref(null);

const currentPage = ref(1);
const perPage = ref(25);
const total = ref(0);
const totalPages = ref(0);

// We'll use the API for filtering and pagination
const paginatedProducts = computed(() => {
  return products.value;
});

function formatDate_own(datetime) {
  const date = new Date(datetime);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // ¡Recuerda que los meses van de 0 a 11!
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
// Pagination information
const paginationInfo = computed(() => {
  const from = products.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1;
  const to = Math.min(currentPage.value * perPage.value, total.value);
  return { from, to };
});

// Calculate displayed page numbers
const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5; // Show 5 page numbers at a time

  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

const getProductsData = async (page = 1, search = '') => {
    try {
        const response = await getProducts(page, perPage.value, search);
        if (response.status) {
          if (response.data.total != 0) {
              products.value = response.data.data;
              total.value = response.data.total || 0;
              totalPages.value = Math.ceil(total.value / perPage.value) || 0;
              currentPage.value = page;
          } else {
            products.value = [];
            total.value = 0;
            totalPages.value = 0;
            currentPage.value = 1;
          }
        } else {
            console.error('Unexpected API response format:', response);
            showNotification('Format de réponse API inattendu', 'danger');
        }
    } catch (error) {
        ErrorHandler.handleError(error, {
            component: 'ProductsList',
            action: 'getProductsData'
        });
        console.error('Erreur lors du chargement des produits:', error.message);
    }
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  // Use API pagination
  getProductsData(page);
};

// Search products with the current search text
const searchProducts = async () => {
  currentPage.value = 1; // Reset to first page when searching
  await getProductsData(1, searchText.value);
};

onMounted(async () => {
  try {
    await getProductsData();
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductList',
      action: 'onMounted'
    });
    console.error("Error loading products:", error.message);
  }
});

const getStatusLabel = (status) => {
  switch (status) {
    case 'Indisponible':
      return 'Indisponible';
    case 'Disponible':
      return 'Disponible';
    case 'Discontinued':
      return 'Discontinued';
    default:
      return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Disponible':
      return 'badge badge-success';
    case 'Indisponible':
      return 'badge badge-warning';
    case 'Discontinued':
      return 'badge badge-danger';
    default:
      return 'badge badge-secondary';
  }
};

// Función para exportar a Excel
const exportToExcel = async () => {
  try {
    // Mostrar notificación de carga
    showNotification('Préparation de l\'exportation en cours...', 'info');
    
    // Obtener todos los productos para exportar (sin paginación pero con el filtro de búsqueda)
    const allProducts = await getAllProductsForExport(searchText.value);
    
    // Crear una matriz con los datos
    const data = [
      // Encabezados
      ['SAP', 'CIP13', 'Présentation', 'Min', 'Max', 'Allocation', 'Contingentement', 'Dernière mise à jour'],
      // Datos de productos
      ...allProducts.map(product => [
        product.product_sap_id,
        product.product_cip13,
        product.product_presentation,
        product.product_min_order,
        product.product_max_order,
        product.product_allocation !== null && product.product_allocation !== '' ? product.product_allocation : 0,
        product.product_quote !== null && product.product_quote !== '' ? product.product_quote : 0,
        product.updated_at ? formatDate_own(product.updated_at) : ''
      ])
    ];

    // Crear libro y hoja
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Stocks');

    // Generar el archivo y descargarlo
    const fileName = `liste_controle_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Mostrar mensaje de éxito
    showNotification(`Exportation réussie: ${allProducts.length} produits exportés`, 'success');
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductListStocks',
      action: 'exportToExcel'
    });
    console.error('Erreur lors de l\'exportation:', error.message);
    showNotification('Erreur lors de l\'exportation', 'danger');
  }
};

// Función para obtener todos los productos para exportación
const getAllProductsForExport = async (searchQuery = '') => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");

    // Llamar a un endpoint específico para obtener todos los productos sin paginación
    const response = await axios.post(`${API_CONFIG.API_URL}/get/products-all`, 
      { searchText: searchQuery }, // Pasar el filtro de búsqueda actual
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Credentials': 'true',
          'Accept': 'application/json',
        },
      }
    );
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('Format de réponse inattendu');
    }
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductListStocks',
      action: 'getAllProductsForExport'
    });
    console.error('Erreur lors de la récupération des produits pour l\'exportation:', error.message);
    throw error;
  }
};

// Función para activar el input de archivo
const triggerFileInput = () => {
  document.getElementById('excelFileInput').click();
};

// Función para importar desde Excel
const importFromExcel = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    // Leer el archivo Excel
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Obtener la primera hoja
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Verificar que el formato sea correcto (al menos debe tener encabezados y una fila)
        if (jsonData.length < 2) {
          showNotification('Le fichier Excel est vide ou mal formaté', 'danger');
          return;
        }
        
        // Verificar los encabezados
        const headers = jsonData[0];
        const expectedHeaders = ['SAP', 'CIP13', 'Présentation', 'Min', 'Max', 'Allocation', 'Contingentement'];
        
        // Comprobar si los encabezados coinciden
        const headersMatch = expectedHeaders.every(header => headers.includes(header));
        if (!headersMatch) {
          showNotification('Les en-têtes du fichier Excel ne correspondent pas au format attendu', 'danger');
          return;
        }
        
        // Procesar los datos (omitir la primera fila que son los encabezados)
        const productsToImport = [];
        const errorsFound = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row.length < expectedHeaders.length) {
            errorsFound.push(`Ligne ${i+1}: Données incomplètes`);
            continue; // Omitir filas incompletas
          }
          
          // Mapear los índices de las columnas según los encabezados
          const sapIndex = headers.indexOf('SAP');
          const cip13Index = headers.indexOf('CIP13');
          const presentationIndex = headers.indexOf('Présentation');
          const minIndex = headers.indexOf('Min');
          const maxIndex = headers.indexOf('Max');
          const allocationIndex = headers.indexOf('Allocation');
          const contingencyIndex = headers.indexOf('Contingentement');
          
          // Validar SAP (debe existir)
          if (!row[sapIndex]) {
            errorsFound.push(`Ligne ${i+1}: SAP manquant`);
            continue;
          }
          
          // Validar CIP13 (debe existir)
          if (!row[cip13Index]) {
            errorsFound.push(`Ligne ${i+1}: CIP13 manquant`);
            continue;
          }
          
          // Validar Min (debe ser un número)
          const minOrder = parseInt(row[minIndex], 10);
          if (isNaN(minOrder)) {
            //errorsFound.push(`Ligne ${i+1}: Valeur Min invalide "${row[minIndex]}"`);
            errorsFound.push(`Ligne ${i+1}: Format error in the Min par commande => "La valeur pour la colonne "Min par commande" doit être un chiffre`);

            continue;
          }
          
          // Validar Max (debe ser un número)
          const maxOrder = parseInt(row[maxIndex], 10);
          if (isNaN(maxOrder)) {
            //errorsFound.push(`Ligne ${i+1}: Valeur Max invalide "${row[maxIndex]}"`);
            errorsFound.push(`Ligne ${i+1}: Format error in the Max par commande => "La valeur pour la colonne "Max par commande" doit être un chiffre`);
            continue;
          }
          
          // Validar Allocation (debe ser un número)
          const allocation = parseInt(row[allocationIndex], 10);
          if (isNaN(allocation)) {
            //errorsFound.push(`Ligne ${i+1}: Valeur Allocation invalide "${row[allocationIndex]}"`);
            errorsFound.push(`Ligne ${i+1}: Format error in the Allocation => "La valeur pour la colonne "Allocation" doit être un chiffre`);
            continue;
          }

          // Validar Contingency (debe ser un número)
          const contingency = parseInt(row[contingencyIndex], 10);
          if (isNaN(contingency)) {
            //errorsFound.push(`Ligne ${i+1}: Valeur Contingency invalide "${row[contingencyIndex]}"`);
            errorsFound.push(`Ligne ${i+1}: Format error in the Contingency => "La valeur pour la colonne "Contingency" doit être un chiffre`);
            continue;
          }
          
          productsToImport.push({
            product_sap_id: row[sapIndex],
            product_cip13: row[cip13Index],
            product_presentation: row[presentationIndex] || '',
            product_min_order: minOrder,
            product_max_order: maxOrder,
            product_allocation: allocation,
            product_quote: contingency
          });
        }
        
        // Mostrar errores si los hay
        if (errorsFound.length > 0) {
          const errorMessage = `${errorsFound.length} erreurs trouvées:\n${errorsFound.slice(0, 5).join('\n')}${errorsFound.length > 5 ? '\n...' : ''}`;
          showNotification(errorMessage.replace(/\n/g, '<br>'), 'warning');
        }
        
        // Si no hay productos para importar, detener
        if (productsToImport.length === 0) {
          showNotification('Aucun produit valide à importer', 'danger');
          return;
        }
        
        // Enviar los datos al servidor
        await importProductsStocks(productsToImport);
        
        // Limpiar el input de archivo
        event.target.value = '';
        
      } catch (error) {
        ErrorHandler.handleError(error, {
          component: 'ProductListStocks',
          action: 'importFromExcel:process'
        });
        console.error('Erreur lors du traitement du fichier Excel:', error.message);
        showNotification('Erreur lors du traitement du fichier Excel', 'danger');
      }
    };
    
    reader.readAsArrayBuffer(file);
    
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductListStocks',
      action: 'importFromExcel'
    });
    console.error('Erreur lors de l\'importation:', error.message);
    showNotification('Erreur lors de l\'importation', 'danger');
  }
};

// Función para enviar los productos importados al servidor
const importProductsStocks = async (products) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");
    
    const response = await axios.post(`${API_CONFIG.API_URL}/product-import-stock`, 
      { products },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Credentials': 'true',
          'Accept': 'application/json',
        },
      }
    );
    
    if (response.data.success) {
      showNotification(`${response.data.imported || products.length} produits importés avec succès`, 'success');
      if (response.data.not_found) {
        let notFoundMessage = '';
        if (Array.isArray(response.data.not_found)) {
          notFoundMessage = `${response.data.not_found.length} produits non trouvés dans la base de données: ${response.data.not_found.slice(0, 5).join(', ')}${response.data.not_found.length > 5 ? '...' : ''}`;
        } 
        else if (typeof response.data.not_found === 'number') {
          notFoundMessage = `${response.data.not_found} produits non trouvés dans la base de données`;
        }
        else {
          notFoundMessage = `Certains produits n'ont pas été trouvés dans la base de données`;
        }
        
        showNotification(notFoundMessage, 'warning');
      }
      if (Array.isArray(response.data.inactiveProducts) && response.data.inactiveProducts.length > 0) {
        response.data.inactiveProducts.forEach(product => {
          const message = `Le produit ${product.product_presentation} - ${product.product_sap_id} est inactif`;
          showNotification(message, 'danger');
        });
      }
      await searchProducts();
    } else {
      showNotification('Erreur lors de l\'importation des produits', 'danger');
    }
    
    return response;
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductListStocks',
      action: 'importProductsStocks'
    });
    console.error("Erreur lors de l'importation des produits", error.message);
    showNotification('Erreur lors de l\'importation des produits', 'danger');
    throw error;
  }
};

// Función para mostrar notificaciones
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show`;
  notification.innerHTML = `
    ${message}
    <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;
  
  // Añadir al DOM
  document.querySelector('.card-body').prepend(notification);
  
  /*
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 150);
  }, 15000);
  */
};

// Function to determine the class for monthly sales based on allocation percentage
const getMonthlySalesClass = (product) => {
  // Get the values, defaulting to 0 if null or empty
  const monthlySales = product.product_monthly_sales !== null && product.product_monthly_sales !== '' 
    ? parseFloat(product.product_monthly_sales) 
    : 0;
  
  const allocation = product.product_allocation !== null && product.product_allocation !== '' 
    ? parseFloat(product.product_allocation) 
    : 0;
  
  // If allocation is 0, we can't calculate a percentage
  if (allocation === 0) return 'badge badge-secondary';
  
  // Calculate percentage
  const percentage = (monthlySales / allocation) * 100;
  
  // Apply classes based on percentage
  if (percentage >= 80) return 'badge badge-danger';
  if (percentage >= 50) return 'badge badge-warning';
  return 'badge badge-success';
};
</script>

<style scoped>
.text-12 {
  font-size: 12px;
}

.card-header-left {
  text-align: left;
  font-weight: bold;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.badge {
  padding: 0.4em 0.6em;
  font-size: 85%;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: black;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Pagination styles */
.pagination {
  margin-bottom: 0;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-link {
  color: #007bff;
}

.page-link:hover {
  color: #0056b3;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  cursor: not-allowed;
}
</style>

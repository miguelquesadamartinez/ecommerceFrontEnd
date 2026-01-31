<template>
  <div class="card shadow mb-4">
    <div class="card-header card-header-left d-flex justify-content-between align-items-center">
      <h5>Liste de gestion des produits</h5>
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
              <th class="th-sm">Prix PGHT</th>
              <th class="th-sm">Peremption courte</th>
              <th class="th-sm">Date de péremption</th>
              <th class="th-sm">Statut</th>
              <th class="th-sm">Dernière mise à jour</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td>{{ product.product_sap_id }}</td>
              <td>{{ product.product_cip13 }}</td>
              <td>{{ product.product_presentation }}</td>
              <td>{{ getCategoryName(product.product_category_id) }}</td>
              <td>{{ product.product_unit_price_pght }} €</td>
              <td>
                <span :class="`badge badge-${product.product_short_term == 1 ? 'warning' : 'success'}`">
                  {{ product.product_short_term == 1 ? 'Oui' : 'Non' }}
                </span>
              </td>
              <td>{{ formatDate(product.product_expiration_date) || '' }}</td>
              <td>
                <span :class="getStatusClass(product.product_status)">
                  {{ getStatusLabel(product.product_status) }}
                </span>
              </td>
              <td>{{ formatDate_own(product.updated_at) || '' }}</td>
            </tr>
            <tr v-if="total == 0">
              <td colspan="9" class="text-center">Aucun produit trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--  JUJU  -->

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
import { getProducts, getCategories } from "../../services/getService";
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

const categories = ref([]);


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

// We'll use the API for filtering and pagination
const paginatedProducts = computed(() => {
  return products.value;
});

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

  if (totalPages.value <= 0) return pages;

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
        showNotification('Erreur lors du chargement des produits', 'danger');
    }
};

// Change page and load data
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  // Use API pagination
  getProductsData(page, searchText.value);
};

// Search products with the current search text
const searchProducts = async () => {
  currentPage.value = 1; // Reset to first page when searching
  await getProductsData(1, searchText.value);
};

onMounted(async () => {
  try {
    const categoriesResponse = await getCategories();
    categories.value = categoriesResponse.data;

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

// Función para obtener el nombre de la categoría
const getCategoryName = (categoryId) => {
  
  if (!categoryId) return 'Non catégorisé';
  
  // Convertir a número si es string
  const id = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
  
  const category = categories.value.find(cat => cat.id === id);
  return category ? category.category_name : 'Non catégorisé';
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
      ['SAP', 'CIP13', 'Présentation', 'Prix PGHT', 'Peremption courte', 'Date de péremption', 'Statut', 'Dernière mise à jour'],
      // Datos de productos
      ...allProducts.map(product => {
        // Convertir la fecha de expiración a formato yyyy-mm-dd para Excel
        let expirationDate = null;
        if (product.product_expiration_date) {
          // Intentar convertir la fecha a un objeto Date válido
          const dateStr = formatDate(product.product_expiration_date);
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            // Formato original: dd-mm-yyyy
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            
            // Crear fecha en formato yyyy-mm-dd
            //expirationDate = `${year}-${month}-${day}`;
            expirationDate = product.product_expiration_date;
          }
        }
        
        return [
          product.product_sap_id,
          product.product_cip13,
          product.product_presentation,
          `${product.product_unit_price_pght}`,
          product.product_short_term,
          expirationDate, // Usar el objeto Date directamente
          getStatusLabel(product.product_status),
          product.updated_at ? formatDate_own(product.updated_at) : ''
        ];
      })
    ];

    // Crear libro y hoja
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Define column formats - set the expiration date column (index 5) to date format
    const colIndex = 5; // 0-based index for "Date de péremption" column
    if(!ws['!cols']) ws['!cols'] = [];
    ws['!cols'][colIndex] = { wch: 15, t: 'd' }; // wch is column width, t: 'd' means date format
    
    // Ensure all cells in the expiration date column are formatted as dates
    const range = XLSX.utils.decode_range(ws['!ref']);
    for(let row = 1; row <= range.e.r; row++) { // Start from row 1 (skip header)
      const cellRef = XLSX.utils.encode_cell({r: row, c: colIndex});
      if(ws[cellRef] && ws[cellRef].v) {
        ws[cellRef].t = 'd'; // Set cell type to date
        
        // Establecer un formato de fecha específico
        if(!ws['!cols']) ws['!cols'] = [];
        if(!ws['!cols'][colIndex]) ws['!cols'][colIndex] = {};
        ws['!cols'][colIndex].z = 'yyyy-mm-dd'; // Formato ISO
      }
    }

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Produits');

    // Generar el archivo y descargarlo
    const fileName = `liste_produits_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Mostrar mensaje de éxito
    showNotification(`Exportation réussie: ${allProducts.length} produits exportés`, 'success');
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductList',
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
      component: 'ProductList',
      action: 'getAllProductsForExport'
    });
    console.error('Erreur lors de la récupération des produits pour l\'exportation:', error.message);
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
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
          header: 1,
          raw: false,  // Esto fuerza a que las fechas se conviertan a strings
          dateNF: 'yyyy-mm-dd'  // Formato de fecha deseado para la conversión
        });
        
        // Verificar que el formato sea correcto (al menos debe tener encabezados y una fila)
        if (jsonData.length < 2) {
          showNotification('Le fichier Excel est vide ou mal formaté', 'danger');
          return;
        }
        
        // Verificar los encabezados
        const headers = jsonData[0];
        const expectedHeaders = ['SAP', 'CIP13', 'Présentation', 'Prix PGHT', 'Peremption courte', 'Date de péremption', 'Statut', 'Dernière mise à jour'];
        
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
          
          
          const sapIndex = headers.indexOf('SAP');
          const cip13Index = headers.indexOf('CIP13');
          const presentationIndex = headers.indexOf('Présentation');
          const priceIndex = headers.indexOf('Prix PGHT');
          const shortTermIndex = headers.indexOf('Peremption courte');
          const expirationDateIndex = headers.indexOf('Date de péremption');
          const statusIndex = headers.indexOf('Statut');

          // Validar SAP (debe existir)
          if (!row[sapIndex]) {
            errorsFound.push(`Ligne ${i+1}: SAP manquant`);
            continue;
          }

          if (!row[cip13Index]) {
            errorsFound.push(`Ligne ${i+1}: CIP13 manquant`);
            continue;
          }
          
          const priceStr = row[priceIndex] ? row[priceIndex].toString() : '';
          const priceClean = priceStr.replace('€', '').replace(',', '.').trim();
          const price = parseFloat(priceClean);
          
          if (isNaN(price)) {
            errorsFound.push(`Ligne ${i+1}: Prix invalide "${priceStr}"`);
            continue;
          }
          let shortTerm;
          const shortTermValue = row[shortTermIndex];
          
          if (shortTermValue === 1 || shortTermValue === '1') {
            shortTerm = 1;
          } else if (shortTermValue === 0 || shortTermValue === '0') {
            shortTerm = 0;
          } else {
            errorsFound.push(`Ligne ${i+1}: La valeur pour la colonne "Péremption courte" doit être 0 pour NON et 1 pour OUI`);
            continue;
          }
          let expirationDate = null;
          let excelDateStr = null;

          
          if (row[expirationDateIndex] && row[expirationDateIndex] !== '') {
            
            const dateValue = row[expirationDateIndex];

            if ( ! esFechaValida(row[expirationDateIndex])) {
              errorsFound.push(`Ligne ${i+1}: La valeur pour la colonne "Date de Péremption" doit être une date`);
              continue;
            } else {
              excelDateStr = row[expirationDateIndex];

            // Convertir formato m/dd/aa a yyyy-mm-dd

              const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
              const match = excelDateStr.match(dateRegex);
              
              if (match) {
                const month = match[1].padStart(2, '0');
                const day = match[2].padStart(2, '0');
                let year = match[3];
                
                // Manejar años de 2 dígitos
                if (year.length === 2) {
                  // Asumir que años < 50 son 20xx y años >= 50 son 19xx
                  const currentYear = new Date().getFullYear();
                  const century = parseInt(year) < 50 ? 2000 : 1900;
                  year = century + parseInt(year);
                }
                
                // Formatear como yyyy-mm-dd
                excelDateStr = `${year}-${month}-${day}`;
              }
            }
          }
          
          // Validar el estado (debe ser uno de los valores permitidos)
          let status;
          const statusValue = row[statusIndex];
          
          switch (statusValue) {
            case 'Disponible':
              status = 'Disponible';
              break;
            case 'Indisponible':
              status = 'Indisponible';
              break;
            default:
              errorsFound.push(`Ligne ${i+1}: La valeur pour la colonne Statut doit être Disponible ou Indisponible`);
              continue;
          }
          
          productsToImport.push({
            product_sap_id: row[sapIndex],
            product_cip13: row[cip13Index],
            product_presentation: row[presentationIndex] || '',
            product_unit_price_pght: price,
            product_short_term: shortTerm,
            product_expiration_date: excelDateStr,
            product_status: status
          });
        }
        
        // Mostrar errores si los hay
        if (errorsFound.length > 0) {
          const errorMessage = `${errorsFound.length} erreurs trouvées:\n${errorsFound.slice(0, 5).join('\n')}${errorsFound.length > 5 ? '\n...' : ''}`;
          showNotification(errorMessage.replace(/\n/g, '<br>'), 'warning');
          
          // También mostrar un resumen
          //showNotification(`Erreurs dans le fichier: ${errorsFound.length} lignes avec des problèmes`, 'warning');
        }
        
        // Si no hay productos para importar, detener
        if (productsToImport.length === 0) {
          showNotification('Aucun produit valide à importer', 'danger');
          return;
        }
        
        // Enviar los datos al servidor
        await exportProducts(productsToImport);
        
        // Limpiar el input de archivo
        event.target.value = '';
        
      } catch (error) {
        ErrorHandler.handleError(error, {
          component: 'ProductList',
          action: 'importFromExcel:process'
        });
        console.error('Erreur lors du traitement du fichier Excel:', error.message);
        showNotification('Erreur lors du traitement du fichier Excel', 'danger');
      }
    };
    
    reader.readAsArrayBuffer(file);
    
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'ProductList',
      action: 'importFromExcel'
    });
    console.error('Erreur lors de l\'importation:', error.message);
    showNotification('Erreur lors de l\'importation', 'danger');
  }
};


function esFechaValida(valor) {
  // Handle null, undefined, or non-string values
  if (!valor) return false;


  
  // If it's already a Date object
  if (valor instanceof Date) return !isNaN(valor.getTime());
  
  // Convert to string if it's not already
  const valorStr = String(valor).trim();
  
  // Check for empty string
  if (valorStr === '') return false;
  
    //console.log('valorStr');
  //console.log(valorStr);

  // dd/mm/yyyy or dd-mm-yyyy format
  //const regexFormato = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;

  // yyyy/mm/dd or yyyy-mm-dd format
  //const regexFormato = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
  
  // yyyy-mm-dd
  const regexFormato = /^(\d{4})-(\d{2})-(\d{2})$/;

  const match = valorStr.match(regexFormato);
  
  if (match) {
    // Extract day, month, year
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS months are 0-11
    const year = parseInt(match[3], 10);
    
    // Create date and validate components
    const date = new Date(year, month, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  }
  
  // Try standard date parsing as fallback
  const date = new Date(valorStr);
  return !isNaN(date.getTime());
}

// Función para enviar los productos importados al servidor
const exportProducts = async (products) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");

    const response = await axios.post(`${API_CONFIG.API_URL}/product-export`, 
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
      showNotification(`${response.data.imported} produits importés avec succès`, 'success');
      // Recargar la lista de productos
      if (response.data.not_found) {
        let notFoundMessage = '';
        
        // Verificar si not_found es un array
        if (Array.isArray(response.data.not_found)) {
          notFoundMessage = `${response.data.not_found.length} produits non trouvés dans la base de données: ${response.data.not_found.slice(0, 5).join(', ')}${response.data.not_found.length > 5 ? '...' : ''}`;
        } 
        // Verificar si not_found es un número
        else if (typeof response.data.not_found === 'number') {
          notFoundMessage = `${response.data.not_found} produits non trouvés dans la base de données`;
        }
        // Cualquier otro caso
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
      component: 'ProductList',
      action: 'exportProducts'
    });
    console.error("Erreur lors de l'importation des produits", error.message);
    showNotification('Erreur lors de l\'importation des produits', 'danger');
    throw error;
  }
};

// Function to format date to dd-mm-yyyy
const formatDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  
  // Format to dd-mm-yyyy
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
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

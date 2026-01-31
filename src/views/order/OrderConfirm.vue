
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getOrder, deleteOrderProduct, saveOrder} from "../../services/orderService";
import { doIBAN, completarDatos, validateIBAN } from '../../../public/js/iban.js';
import { ErrorHandler } from '../../services/errorHandlingService';

const modified_farm = localStorage.getItem("modified_farm");
localStorage.removeItem("modified_farm");

const searchText = ref('');
const pharmacy = ref([]);
const order_details = ref([]);
const order = ref([]);
const quantity = ref(1);
const products = ref([]);

const router = useRouter();
const route = useRoute();

const order_id = ref(route.params.order_id);

const pharmacyData = ref({
  pharmacy_sap_id: '',
  pharmacy_cip13: '',
  pharmacy_type: '',
  pharmacy_status: '',
  pharmacy_name: '',
  pharmacy_name2: '',
  pharmacy_name3: '',
  pharmacy_name4: '',
  pharmacy_address_street: '',
  pharmacy_address_address1: '',
  pharmacy_address_address2: '',
  pharmacy_address_address3: '',
  pharmacy_city: '',
  pharmacy_district: '',
  pharmacy_region: '',
  pharmacy_country: '',
  pharmacy_zipcode: '',
  pharmacy_po_box: '',
  pharmacy_po_box_city: '',
  pharmacy_po_box_region: '',
  pharmacy_po_box_country: '',
  pharmacy_po_box_zipcode: '',
  pharmacy_phone: '',
  pharmacy_fax: '',
  pharmacy_email: '',
  pharmacy_holder_name: '',
  pharmacy_bank_name: '',
  pharmacy_iban: '',
  pharmacy_bank_code: '',
  pharmacy_account_number: '',
  pharmacy_guichet_code: '',
  pharmacy_rib: '',
  pharmacy_siren: '',
  pharmacy_siret: '',
  pharmacy_refusal_lcr: ''
});

const requiredFields = [
        { field: 'pharmacy_name', label: 'Nom de la pharmacie' },
        //{ field: 'pharmacy_name4', label: 'Denomination commercial' },
        { field: 'pharmacy_address_street', label: 'Street' },
        { field: 'pharmacy_city', label: 'City' },
        { field: 'pharmacy_region', label: 'Region' },
        { field: 'pharmacy_country', label: 'Country' },
        { field: 'pharmacy_zipcode', label: 'Zipcode' },
        { field: 'pharmacy_phone', label: 'Phone' },
        { field: 'pharmacy_email', label: 'Email' },
        { field: 'pharmacy_holder_name', label: 'Titulaire' },
        { field: 'pharmacy_iban', label: 'IBAN' },
        { field: 'pharmacy_bank_code', label: 'Bank Code' },
        { field: 'pharmacy_account_number', label: 'Account Bank Code' },
        { field: 'pharmacy_guichet_code', label: 'Guichet Code' },
        { field: 'pharmacy_rib', label: 'RIB' },
        { field: 'pharmacy_bank_name', label: 'Bank Name' },
        { field: 'pharmacy_siren', label: 'SIREN' },
        { field: 'pharmacy_siret', label: 'SIRET' },
        { field: 'pharmacy_cip13', label: 'CIP' }
];

//onBeforeMount(async () => {
onMounted(async () => {
    try {
      const response_data = await getOrder(order_id.value);
      order.value = response_data.data.order;
      pharmacy.value = response_data.data.pharmacy;
      order_details.value = response_data.data.order_detail;

      Object.assign(pharmacyData.value, pharmacy.value);

      if ( modified_farm != '1') {
        doIBAN(pharmacyData.value);
      }
      // Validar campos al cargar
      requiredFields.forEach(field => {
        const input = document.getElementById(field.field);
        if (input) {
          const value = pharmacyData.value[field.field];
          if (!value || value.trim() === '') {
            input.classList.add('is-invalid');
          } else {
            input.classList.add('is-valid');
          }

          // Add input event listener to validate field on change
          input.addEventListener('input', validateField);
        }
      });
    } catch (error) {
      ErrorHandler.handleError(error, {
            component: 'OrderConfirm',
            action: 'onMounted'
          });
      console.error("Erreur lors du chargement de la commande:", error.message);
    }
});

const deleteProductFromOrder = async (product) => {
  try {
    await deleteOrderProduct(order_id.value, product.id);
    order.value = order.value.filter(item => item.id !== product.id);
  } catch (error) {
      ErrorHandler.handleError(error, {
            component: 'OrderConfirm',
            action: 'deleteProductFromOrder'
          });
      console.error("Erreur lors du chargement de la commande:", error.message);
    }
};

const totalOrderValue = computed(() => {
  try {
    return order_details.value.reduce((sum, item) => {
      return sum + (item.order_detail_quantity * item.order_detail_price_with_dto);
    }, 0).toFixed(2);
  } catch (error) {
      ErrorHandler.handleError(error, {
            component: 'OrderConfirm',
            action: 'computed'
          });
      console.error("Erreur lors du chargement de la commande:", error.message);
    }
});

const redirectToOrderFinish = async (order_id, pharmacyData, order_urgent) => {
  try {
    if ( modified_farm != '1') {
      requiredFields.forEach(field => {
        const input = document.getElementById(field.field);
        if (input) {
          input.classList.remove('is-invalid', 'is-valid');
        }
      });
      const missingFields = requiredFields.filter(field => {
        const value = pharmacyData[field.field];
        const isEmpty = !value || value.trim() === '';
        const input = document.getElementById(field.field);
        if (input) {
          if (isEmpty) {
            input.classList.add('is-invalid');
          } else {
            input.classList.add('is-valid');
          }
        }
        return isEmpty;
      });
      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map(field => field.label).join(', ');
        alert(`Please fill in all required fields: ${missingFieldNames}`);
        return;
      }
      const iban = document.getElementById("pharmacy_iban").value;
      if (!validateIBAN(iban)) {
        document.getElementById("pharmacy_iban").classList.add('is-invalid');
        alert("Wrong IBAN, must be changed.");
        return;
      }
    }
    await saveOrder(order_id, pharmacyData, order_urgent, modified_farm);
    router.push({ name: 'OrderConfirmed', params: { order_id: order_id, pharmacy_id: pharmacyData.id } });
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: 'OrderConfirm',
      action: 'redirectToOrderFinish'
    });
    console.error("Erreur lors de la confirmation de la commande:", error.message);
  }
};

//watch(pharmacyData.pharmacy_iban, async (newValue) => {
//  completarDatos(pharmacyData.value);
//});

//watch(searchText, async (newValue) => {
//  await getProducts();
//});

const validateField = (event) => {
  const input = event.target;
  const value = input.value.trim();

  if (value !== '') {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
};

</script>

<template>
  <div class="card shadow mb-4">
    <div class="card-header card-header-left">
        Commande pour la pharmacie: <b>{{ pharmacy.pharmacy_name }}</b> ( <b>{{ pharmacy.pharmacy_cip13 }}</b> ) -
        Référence commande: <b>{{ order.order_reference }}</b>
    </div>
  </div>

  <div class="card shadow mb-4">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped table-bordered text-12" id="tableOrder" width="100%" cellspacing="0">
            <thead>
                <tr>
                    <th class="th-sm">Référence</th>
                    <th class="th-sm">Prix</th>
                    <th class="th-sm">Quantité</th>
                    <th class="th-sm">Remise</th>
                    <th class="th-sm">Prix avec remise</th>
                    <th class="th-sm">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in order_details" :key="item.id">
                    <td>{{ item.product_presentation }}</td>
                    <td>{{ item.order_detail_price }} €</td>
                    <td>{{ item.order_detail_quantity }}</td>
                    <td>{{ item.order_detail_discount }} %</td>
                    <td>{{ item.order_detail_price_with_dto }} €</td>
                    <td>{{ (item.order_detail_quantity * item.order_detail_price_with_dto).toFixed(2) }} €</td>
                </tr>
            </tbody>
        </table>
      </div>
      <div class="text-right mt-3">
        <h5>Montant total de la commande: {{ totalOrderValue }} €</h5>
      </div>

      <div class="mt-5" v-if="modified_farm != '1'">
        <h5>Informations sur la pharmacie</h5>
        <form id="pharmForm_group">
          <input type="hidden" name="order_id" v-model="order_id">

          <div class="row">
            <!-- Première colonne -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="pharmacy_sap_id">ID SAP</label>
                <input type="text" class="form-control" id="pharmacy_sap_id" v-model="pharmacyData.pharmacy_sap_id">
              </div>

              <div class="form-group">
                <label for="pharmacy_type">Type de pharmacie</label>
                <input type="text" class="form-control" id="pharmacy_type" v-model="pharmacyData.pharmacy_type">
              </div>

              <div class="form-group">
                <label for="pharmacy_name">Denomination sociale</label>
                <input type="text" class="form-control" id="pharmacy_name" v-model="pharmacyData.pharmacy_name" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_name2">Nom de la pharmacie 2</label>
                <input type="text" class="form-control" id="pharmacy_name2" v-model="pharmacyData.pharmacy_name2">
              </div>

              <div class="form-group">
                <label for="pharmacy_name3">Nom de la pharmacie 3</label>
                <input type="text" class="form-control" id="pharmacy_name3" v-model="pharmacyData.pharmacy_name3">
              </div>

              <div class="form-group">
                <label for="pharmacy_address_street">Rue</label>
                <input type="text" class="form-control" id="pharmacy_address_street" v-model="pharmacyData.pharmacy_address_street" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_district">Quartier</label>
                <input type="text" class="form-control" id="pharmacy_district" v-model="pharmacyData.pharmacy_district">
              </div>

              <div class="form-group">
                <label for="pharmacy_region">Région</label>
                <input type="text" class="form-control" id="pharmacy_region" v-model="pharmacyData.pharmacy_region" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_phone">Téléphone</label>
                <input type="text" class="form-control" id="pharmacy_phone" v-model="pharmacyData.pharmacy_phone" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_email">Email</label>
                <input type="email" class="form-control" id="pharmacy_email" v-model="pharmacyData.pharmacy_email" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_holder_name">Nom du titulaire</label>
                <input type="text" class="form-control" id="pharmacy_holder_name" v-model="pharmacyData.pharmacy_holder_name" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_bank_code">Code bancaire</label>
                <input type="text" class="form-control" id="pharmacy_bank_code" v-model="pharmacyData.pharmacy_bank_code" required>
              </div>
            </div>

            <!-- Deuxième colonne -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="pharmacy_cip13">CIP13</label>
                <input type="text" class="form-control" id="pharmacy_cip13" v-model="pharmacyData.pharmacy_cip13" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_status">Statut de la pharmacie</label>
                <input type="text" class="form-control" id="pharmacy_status" v-model="pharmacyData.pharmacy_status">
              </div>

              <div class="form-group">
                <label for="pharmacy_name4">Denomination commercial</label>
                <input type="text" class="form-control" id="pharmacy_name4" v-model="pharmacyData.pharmacy_name4">
              </div>

              <div class="form-group">
                <label for="pharmacy_address_address1">Adresse 1</label>
                <input type="text" class="form-control" id="pharmacy_address_address1" v-model="pharmacyData.pharmacy_address_address1">
              </div>

              <div class="form-group">
                <label for="pharmacy_address_address2">Adresse 2</label>
                <input type="text" class="form-control" id="pharmacy_address_address2" v-model="pharmacyData.pharmacy_address_address2">
              </div>

              <div class="form-group">
                <label for="pharmacy_city">Ville</label>
                <input type="text" class="form-control" id="pharmacy_city" v-model="pharmacyData.pharmacy_city">
              </div>

              <div class="form-group">
                <label for="pharmacy_country">Pays</label>
                <input type="text" class="form-control" id="pharmacy_country" v-model="pharmacyData.pharmacy_country" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_zipcode">Code postal</label>
                <input type="text" class="form-control" id="pharmacy_zipcode" v-model="pharmacyData.pharmacy_zipcode" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_fax">Fax</label>
                <input type="text" class="form-control" id="pharmacy_fax" v-model="pharmacyData.pharmacy_fax">
              </div>

              <div class="form-group">
                <label for="pharmacy_iban">IBAN</label>
                <input type="text" class="form-control" id="pharmacy_iban" v-model="pharmacyData.pharmacy_iban" required>
                <p id="mensaje"></p>
              </div>

              <div class="form-group">
                <label for="pharmacy_account_number">Numéro de compte bancaire</label>
                <input type="text" class="form-control" id="pharmacy_account_number" v-model="pharmacyData.pharmacy_account_number" required>
              </div>

              <div class="form-group">
                <label for="pharmacy_rib">RIB</label>
                <input type="text" class="form-control" id="pharmacy_rib" v-model="pharmacyData.pharmacy_rib" required>
              </div>

            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="pharmacy_guichet_code">Code guichet</label>
                <input type="text" class="form-control" id="pharmacy_guichet_code" v-model="pharmacyData.pharmacy_guichet_code" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="pharmacy_siren">SIREN</label>
                <input type="text" class="form-control" id="pharmacy_siren" v-model="pharmacyData.pharmacy_siren" required>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="pharmacy_bank_name">Bank name</label>
                <input type="text" class="form-control" id="pharmacy_bank_name" v-model="pharmacyData.pharmacy_bank_name" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="pharmacy_siret">SIRET</label>
                <input type="text" class="form-control" id="pharmacy_siret" v-model="pharmacyData.pharmacy_siret" required>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" 
                     class="custom-control-input" 
                     id="pharmacy_refusal_lcr" 
                     v-model="pharmacyData.pharmacy_refusal_lcr">
              <label class="custom-control-label" for="pharmacy_refusal_lcr">
                Refusal LCR
              </label>
            </div>
          </div>
          <div class="form-group">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" 
                     class="custom-control-input" 
                     id="order_urgent" 
                     v-model="order.order_urgent">
              <label class="custom-control-label" for="order_urgent">
                Commande urgente
              </label>
            </div>
          </div>
          

        </form>
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-primary" @click.prevent="redirectToOrderFinish(order_id, pharmacyData, order.order_urgent)">Confirm Order</button>
      </div>
    </div>
  </div>

  <!-- Modal pour sélectionner la quantité -->
  <div class="modal fade" id="quantityModal" tabindex="-1" role="dialog" aria-labelledby="quantityModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="quantityModalLabel">Select Quantity</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="quantityInput">Quantity</label>
            <input type="number" class="form-control" id="quantityInput" v-model="quantity" min="1">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addProductToOrder">Add to Order</button>
        </div>
      </div>
    </div>
  </div>

</template>

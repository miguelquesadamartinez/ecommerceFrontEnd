
<script setup>
import { ref, onMounted, watch, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getOrder } from "../../services/orderService";
import { ErrorHandler } from '../../services/errorHandlingService';

const searchText = ref('');
const pharmacy = ref([]);
const order_details = ref([]);
const order = ref([]);
const quantity = ref(1);
const products = ref([]);

const router = useRoute(); // Crear una instancia de useRoute

const order_id = ref(router.params.order_id); // Recoger el parámetro order_id
const pharmacy_id = ref(router.params.pharmacy_id);

const errorMessage = ref('');

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
  pharmacy_siret: ''
});

onMounted(async () => {
    try {
      const response_data = await getOrder(order_id.value);
      order.value = response_data.data.order;
      pharmacy.value = response_data.data.pharmacy;
      order_details.value = response_data.data.order_detail;
      Object.assign(pharmacyData.value, pharmacy.value);
    } catch (error) {
      ErrorHandler.handleError(error, {
        component: 'OrderConfirmed',
        action: 'onMounted'
      });
      console.error('Error al obtener el pedido:', error.message);
    }
});

const totalOrderValue = computed(() => {
  try {
    return order_details.value.reduce((sum, item) => {
      return sum + (item.order_detail_quantity * item.order_detail_price_with_dto);
    }, 0).toFixed(2);
  } catch (error) {
      ErrorHandler.handleError(error, {
        component: 'OrderConfirmed',
        action: 'computed'
      });
      console.error('Error al obtener el pedido:', error.message);
    }
});

</script>

<template>
  <div class="card shadow mb-4">
    <div class="card-header card-header-left">
        <b>CONFIRMÉE</b> Commande pour la pharmacie: <b>{{ pharmacy.pharmacy_name }}</b> ( <b>{{ pharmacy.pharmacy_cip13 }}</b> ) - 
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
    </div>
  </div>
</template>

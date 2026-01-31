<template>
  <div class="card shadow mb-4">
    <!-- Mensaje de notificación -->
    <Transition name="fade">
      <div
        v-if="notification.show"
        :class="`alert alert-${notification.type} alert-dismissible show m-3`"
        role="alert"
      >
        {{ notification.message }}
        <button type="button" class="close" @click="notification.show = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </Transition>

    <div class="card-header card-header-left">
      <h5>{{ isEditing ? "Modifier la pharmacie" : "Nouvelle pharmacie" }}</h5>
    </div>
    <div class="card-body">
      <form id="pharmForm_group" @submit.prevent="savePharmacy">
        <!-- Información básica -->
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_sap_id">ID SAP</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_sap_id"
                v-model="pharmacyData.pharmacy_sap_id"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_cip13">CIP13</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_cip13"
                v-model="pharmacyData.pharmacy_cip13"
                required
              />
            </div>
          </div>
        </div>

        <!-- Nombres -->
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_name">Nom</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_name"
                v-model="pharmacyData.pharmacy_name"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_name2">Titulaire</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_name2"
                v-model="pharmacyData.pharmacy_holder_name"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_name3">Nom 3</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_name3"
                v-model="pharmacyData.pharmacy_name3"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_name4">Nom 4</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_name4"
                v-model="pharmacyData.pharmacy_name4"
              />
            </div>
          </div>
        </div>

        <!-- Dirección principal -->
        <div class="row">
          <div class="col-md-9">
            <div class="form-group">
              <label for="pharmacy_address_street">Rue</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_address_street"
                v-model="pharmacyData.pharmacy_address_street"
                required
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_zipcode">Code postal</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_zipcode"
                v-model="pharmacyData.pharmacy_zipcode"
                required
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_address_address1">Adresse 1</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_address_address1"
                v-model="pharmacyData.pharmacy_address_address1"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_address_address2">Adresse 2</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_address_address2"
                v-model="pharmacyData.pharmacy_address_address2"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_address_address3">Adresse 3</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_address_address3"
                v-model="pharmacyData.pharmacy_address_address3"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_city">Ville</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_city"
                v-model="pharmacyData.pharmacy_city"
                required
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_district">District</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_district"
                v-model="pharmacyData.pharmacy_district"
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_region">Région</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_region"
                v-model="pharmacyData.pharmacy_region"
                required
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_country">Pays</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_country"
                v-model="pharmacyData.pharmacy_country"
                required
              />
            </div>
          </div>
        </div>

        <!-- Apartado postal -->
        <div class="row">
          <div class="col-md-12">
            <h6 class="mt-4 mb-3">Boîte postale</h6>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_po_box">Boîte postale</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_po_box"
                v-model="pharmacyData.pharmacy_po_box"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_po_box_city">Ville BP</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_po_box_city"
                v-model="pharmacyData.pharmacy_po_box_city"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_po_box_region">Région BP</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_po_box_region"
                v-model="pharmacyData.pharmacy_po_box_region"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_po_box_country">Pays BP</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_po_box_country"
                v-model="pharmacyData.pharmacy_po_box_country"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_po_box_zipcode">Code postal BP</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_po_box_zipcode"
                v-model="pharmacyData.pharmacy_po_box_zipcode"
              />
            </div>
          </div>
        </div>

        <!-- Contacto -->
        <div class="row">
          <div class="col-md-12">
            <h6 class="mt-4 mb-3">Contact</h6>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_phone">Téléphone</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_phone"
                v-model="pharmacyData.pharmacy_phone"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_fax">Fax</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_fax"
                v-model="pharmacyData.pharmacy_fax"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="pharmacy_email">Email</label>
              <input
                type="email"
                class="form-control"
                id="pharmacy_email"
                v-model="pharmacyData.pharmacy_email"
                required
              />
            </div>
          </div>
        </div>

        <!-- Información bancaria -->
        <div class="row">
          <div class="col-md-12">
            <h6 class="mt-4 mb-3">Information bancaire</h6>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="pharmacy_iban">IBAN</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_iban"
                v-model="pharmacyData.pharmacy_iban"
                required
              />
              <p id="mensaje"></p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_holder_name">Nom du titulaire</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_name4"
                v-model="pharmacyData.pharmacy_name4"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_bank_name">Nom de la banque</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_bank_name"
                v-model="pharmacyData.pharmacy_bank_name"
                required
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_bank_code">Code banque</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_bank_code"
                v-model="pharmacyData.pharmacy_bank_code"
                required
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_account_number">Numéro de compte</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_account_number"
                v-model="pharmacyData.pharmacy_account_number"
                required
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_guichet_code">Code guichet</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_guichet_code"
                v-model="pharmacyData.pharmacy_guichet_code"
                required
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="pharmacy_rib">RIB</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_rib"
                v-model="pharmacyData.pharmacy_rib"
                required
              />
            </div>
          </div>
        </div>

        <!-- Información fiscal -->
        <div class="row">
          <div class="col-md-12">
            <h6 class="mt-4 mb-3">Information fiscale</h6>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_siren">SIREN</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_siren"
                v-model="pharmacyData.pharmacy_siren"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="pharmacy_siret">SIRET</label>
              <input
                type="text"
                class="form-control"
                id="pharmacy_siret"
                v-model="pharmacyData.pharmacy_siret"
              />
            </div>
          </div>
        </div>

        <!-- Opciones adicionales -->
        <div class="row mt-4">
          <div class="col-md-12">
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="pharmacy_refusal_lcr"
                  v-model="pharmacyData.pharmacy_refusal_lcr"
                />
                <label class="custom-control-label" for="pharmacy_refusal_lcr">
                  Refusal LCR
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? "Mettre à jour" : "Créer" }}
          </button>
          <button
            type="button"
            class="btn btn-secondary ml-2"
            @click="router.back()"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>

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
              <th>View</th>
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
                  :to="`/order/view/${order.id}/${pharmacyData.id}`"
                  target="_blank"
                  class="block py-2 px-4 rounded hover:bg-blue-100"
                >
                  <span class="badge badge-primary"> View </span>
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
              {{ total }} Pharmacies
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

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ErrorHandler } from "../../services/errorHandlingService";
import {
  getPharmacy,
  createPharmacy,
  updatePharmacy,
} from "../../services/pharmacyService";
import {
  doIBAN,
  completarDatos,
  validateIBAN,
} from "../../../public/js/iban.js";
import { getOrdersPharmacy } from "../../services/getService";

const router = useRouter();
const route = useRoute();
const isEditing = computed(() => !!route.params.id);

const orders = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);

const newFarm = ref(0);

const pharmacy_data = ref([]);

const pharmacyData = ref({
  id: "",
  pharmacy_sap_id: "",
  pharmacy_cip13: "",
  pharmacy_type: "",
  pharmacy_status: "Active",
  pharmacy_name: "",
  pharmacy_name2: "",
  pharmacy_name3: "",
  pharmacy_name4: "",
  pharmacy_address_street: "",
  pharmacy_address_address1: "",
  pharmacy_address_address2: "",
  pharmacy_address_address3: "",
  pharmacy_city: "",
  pharmacy_district: "",
  pharmacy_region: "",
  pharmacy_country: "",
  pharmacy_zipcode: "",
  pharmacy_po_box: "",
  pharmacy_po_box_city: "",
  pharmacy_po_box_region: "",
  pharmacy_po_box_country: "",
  pharmacy_po_box_zipcode: "",
  pharmacy_phone: "",
  pharmacy_fax: "",
  pharmacy_email: "",
  pharmacy_holder_name: "",
  pharmacy_bank_name: "",
  pharmacy_iban: "",
  pharmacy_bank_code: "",
  pharmacy_account_number: "",
  pharmacy_guichet_code: "",
  pharmacy_rib: "",
  pharmacy_siren: "",
  pharmacy_siret: "",
  pharmacy_refusal_lcr: false,
});
const requiredFields = [
  { field: "pharmacy_name", label: "Nom de la pharmacie" },
  { field: "pharmacy_cip13", label: "CIP13" },
  { field: "pharmacy_address_street", label: "Rue" },
  { field: "pharmacy_city", label: "Ville" },
  { field: "pharmacy_region", label: "Région" },
  { field: "pharmacy_country", label: "Pays" },
  { field: "pharmacy_zipcode", label: "Code postal" },
  { field: "pharmacy_email", label: "Email" },
  //{ field: 'pharmacy_holder_name', label: 'Titulaire' },
  { field: "pharmacy_bank_name", label: "Nom de la banque" },
  { field: "pharmacy_iban", label: "IBAN" },
  { field: "pharmacy_bank_code", label: "Code banque" },
  { field: "pharmacy_account_number", label: "Numéro de compte" },
  { field: "pharmacy_guichet_code", label: "Code guichet" },
  { field: "pharmacy_rib", label: "RIB" },
  { field: "pharmacy_siren", label: "SIREN" },
];

const validateField = (event) => {
  const input = event.target;
  const value = input.value.trim();

  if (value !== "") {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }
};

const loadPharmacy = async (id) => {
  try {
    const response = await getPharmacy(id);
    Object.assign(pharmacyData.value, response.data);
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "PharmacyForm",
      action: "loadPharmacy",
    });
  }
};

// Estado para la notificación
const notification = ref({
  show: false,
  message: "",
  type: "success", // success, danger, warning, info
});

// Función para mostrar notificación
const showNotification = (message, type = "success") => {
  // Scroll hacia arriba de la página
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  notification.value = {
    show: true,
    message,
    type,
  };

  // Auto ocultar después de 5 segundos
  setTimeout(() => {
    notification.value.show = false;
  }, 5000);
};

const savePharmacy = async () => {
  try {
    const missingFields = requiredFields.filter((field) => {
      const value = pharmacyData.value[field.field];
      const isEmpty = !value || value.trim() === "";
      const input = document.getElementById(field.field);
      if (input) {
        if (isEmpty) {
          input.classList.add("is-invalid");
        } else {
          input.classList.add("is-valid");
        }
      }
      return isEmpty;
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((field) => field.label)
        .join(", ");
      showNotification(
        `Veuillez remplir tous les champs obligatoires: ${missingFieldNames}`,
        "danger",
      );
      return;
    }

    if (route.params.update) {
      newFarm.value = 2;
    }

    await updatePharmacy(
      pharmacyData.value.id,
      pharmacyData.value,
      newFarm.value,
    );
    showNotification("La pharmacie a été mise à jour avec succès");

    localStorage.setItem("pharmacy", pharmacyData.value.pharmacy_cip13);

    localStorage.setItem("pharmacy_id", pharmacyData.value.id);

    localStorage.setItem("modified_farm", "1");
    if (newFarm.value != 2) {
      router.push("/order/create");
    }
  } catch (error) {
    showNotification(
      "Une erreur est survenue lors de la mise à jour de la pharmacie",
      "danger",
    );
    ErrorHandler.handleError(error, {
      component: "PharmacyForm",
      action: "savePharmacy",
    });
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  getOrdersData(page);
};

onMounted(async () => {
  if (route.params.id) {
    await loadPharmacy(route.params.id);
    newFarm.value = 0;
  } else {
    const response_data = await createPharmacy(route.query.searchText);
    pharmacy_data.value = response_data.data;
    Object.assign(pharmacyData.value, response_data.data);
    newFarm.value = 1;
  }

  doIBAN(pharmacyData.value);

  if (isEditing.value) {
    //doIBAN(pharmacyData.value);
  }

  await getOrdersData();

  // Validar campos al cargar
  requiredFields.forEach((field) => {
    const input = document.getElementById(field.field);
    if (input) {
      const value = pharmacyData.value[field.field];
      if (!value || value.trim() === "") {
        input.classList.add("is-invalid");
      } else {
        input.classList.add("is-valid");
      }

      // Añadir event listener para validar campo al cambiar
      input.addEventListener("input", validateField);
    }
  });
});

watch(
  () => pharmacyData.value.pharmacy_iban,
  (newValue) => {
    if (newValue || !!route.params.id) {
      doIBAN(pharmacyData.value);
    }
  },
);

const getOrdersData = async (page = 1) => {
  try {
    const response = await getOrdersPharmacy(
      page,
      perPage.value,
      pharmacyData.value.id,
    );
    orders.value = response.data.data;
    total.value = response.data.total;
    totalPages.value = Math.ceil(response.data.total / perPage.value);
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "PharmacyForm",
      action: "getOrdersData",
    });
    console.error("Erreur lors du chargement des commandes:", error.message);
  }
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
</style>

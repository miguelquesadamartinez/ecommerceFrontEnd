<script setup>
import { ref, onMounted, watch, computed } from "vue";
import {
  getPharmacy,
  createPharmacy,
  searchProducts,
  getAllProductSrv,
} from "../../services/getService";
import { getOrder } from "../../services/orderService";
import {
  sendOrderProduct,
  deleteOrderProduct,
} from "../../services/orderService";
import { useRouter, useRoute } from "vue-router";
import { ErrorHandler } from "../../services/errorHandlingService";

const router = useRouter();
const route = useRoute();

const searchText = ref("");
const pharmacy = ref("");
const pharmacy_data = ref([]);
const products = ref([]);
const products_list = ref([]);
const product_data = ref([]);
const order = ref([]);
const selectedProduct = ref(null);
const quantity = ref(null);
const product_min_order = ref(0);
const product_max_order = ref(0);
const product_short_term = ref(0);
const product_allocation = ref(0);
const product_expiration_date = ref(0);
const product_units_sellable = ref(null);

const order_details = ref([]);

//const order_id = ref(null);
const order_id = ref(route.params.order_id);

const countCategory = ref(0);

const pharmacyData = ref({
  pharmacy_sap_id: "",
  pharmacy_cip13: "",
  pharmacy_type: "",
  pharmacy_status: "",
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
});

// ToDo: Try onBeforeMount(async () => {
onMounted(async () => {
  try {
    const response = localStorage.getItem("pharmacy");
    if (!response || route.params.order_id !== undefined) {
      const response_data = await getOrder(order_id.value);
      order.value = response_data.data.order;
      pharmacy_data.value = response_data.data.pharmacy;
      order_details.value = response_data.data.order_detail;
      Object.assign(pharmacyData.value, pharmacy_data.value);
      localStorage.setItem("pharmacy", pharmacy_data.value.pharmacy_cip13);
      localStorage.setItem("pharmacy_id", pharmacy_data.value.id);
    } else {
      const pharmacy_cip13 = localStorage.getItem("pharmacy");
      const response_data = await getPharmacy(pharmacy_cip13);
      pharmacy_data.value = response_data.data;
      localStorage.removeItem("pharmacy");
    }

    let progressBar = document.getElementById("pfizer_progress_bar");
    let progressWidth =
      (Math.min(parseFloat(totalOrderValue.value), 150) / 150) * 100;
    progressBar.style.width = progressWidth + "%";

    //let progressText = document.getElementById('pfizer_text_1');
    //let progressText_2 = document.getElementById('pfizer_text_2');

    $("#pfizer_text_1").html(totalOrderValue.value + " €");

    if (totalOrderValue.value < 200) {
      $("#pfizer_text_2").html("Le montant minimum est de 200€");
      $("#pfizer_progress_bar").addClass("notAbleOrder");
      $("#pfizer_progress_bar").removeClass("firstStepOrder");
      $("#pfizer_progress_bar").removeClass("secondStepOrder");
      $("#pfizer_text_2").addClass("text-red");
      $("#pfizer_text_2").removeClass("text-blue");
      $("#pfizer_text_2").removeClass("text-green");
    } else {
      $("#pfizer_progress_bar").removeClass("notAbleOrder");
      $("#pfizer_progress_bar").removeClass("firstStepOrder");
      $("#pfizer_progress_bar").addClass("secondStepOrder");
      $("#pfizer_text_2").removeClass("text-red");
      $("#pfizer_text_2").removeClass("text-blue");
      $("#pfizer_text_2").addClass("text-green");
    }

    // This was used for the commented product list
    //await getAllProducts();
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "onMounted",
    });
    console.error("Erreur lors du montage:", error.message);
  }
});

const getProducts = async () => {
  try {
    const response = await searchProducts(searchText.value);
    products.value = response.data;
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "getProducts",
    });
    console.error(
      "Erreur lors de la récupération des produits:",
      error.message,
    );
  }
};

const selectProduct = async (product) => {
  try {
    product_data.value = product;
    localStorage.setItem("product", product.id);
    products.value = [];
    selectedProduct.value = product; // Asignar el producto seleccionado

    // ToDo: Mejor null o vacio ?
    product_min_order.value =
      product.product_min_order != "" ? product.product_min_order : 1;
    product_max_order.value =
      product.product_max_order != "" ? product.product_max_order : null;

    quantity.value =
      product.product_min_order != "" ? product.product_min_order : 1;
    //quantity.value = 0;

    product_allocation.value =
      product.product_allocation != "" ? product.product_allocation : null;
    product_short_term.value =
      product.product_short_term != "" ? product.product_short_term : null;

    product_expiration_date.value =
      product.product_expiration_date != ""
        ? product.product_expiration_date
        : null;

    // ToDo: This seems not needed
    //product_units_sellable.value = ( product.product_units_sellable != '' ) ? product.product_units_sellable : null;
    //if (product_units_sellable.value < product_max_order.value) {
    //  product_max_order.value = product_units_sellable.value;
    //}

    $("#quantityModal").modal("show"); // Mostrar el modal
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "selectProduct",
    });
    console.error("Erreur lors de la sélection du produit:", error.message);
  }
};

const addProductToOrder = async () => {
  try {
    // Validate the quantity before proceeding
    const validation = validateQuantityInput(quantity.value);

    if (!validation.isValid) {
      // Show error message
      alert(validation.message);
      // Update the quantity to the corrected value
      quantity.value = validation.correctedValue;
      return; // Stop execution
    }

    // Continue with the original function if validation passes
    const pharmacy_id = localStorage.getItem("pharmacy_id");
    const response_data = await sendOrderProduct(
      order_id.value,
      pharmacy_id,
      selectedProduct.value.id,
      quantity.value,
    );

    // Rest of the function remains unchanged
    order_id.value = response_data.data.order_id;

    Object.values(response_data.data.all_order_details).forEach(
      (orderDetail) => {
        const product = orderDetail.product; // Aquí obtienes el producto
        const item = orderDetail.items; // Aquí obtienes los detalles del pedido

        const productWithQuantity = {
          ...product, // Usamos product en lugar de selectedProduct.value
          order_detail_quantity: item.order_detail_quantity,
          order_detail_discount: item.order_detail_discount,
          order_detail_price_with_dto: item.order_detail_price_with_dto,
        };

        countCategory.value = response_data.data.countCategory;

        const index = order_details.value.findIndex(
          (item) => item.id === productWithQuantity.id,
        );

        if (index !== -1) {
          order_details.value[index] = productWithQuantity;
        } else {
          order_details.value.push(productWithQuantity);
        }
      },
    );

    searchText.value = "";

    let progressBar = document.getElementById("pfizer_progress_bar");
    let progressWidth =
      (Math.min(parseFloat(totalOrderValue.value), 150) / 150) * 100;
    progressBar.style.width = progressWidth + "%";
    $("#pfizer_text_1").html(totalOrderValue.value + " €");

    if (totalOrderValue.value < 200) {
      $("#pfizer_text_2").html("Le montant minimum est de 200€");
      $("#pfizer_progress_bar").addClass("notAbleOrder");
      $("#pfizer_progress_bar").removeClass("firstStepOrder");
      $("#pfizer_progress_bar").removeClass("secondStepOrder");
      $("#pfizer_text_2").addClass("text-red");
      $("#pfizer_text_2").removeClass("text-blue");
      $("#pfizer_text_2").removeClass("text-green");
    } else {
      $("#pfizer_progress_bar").removeClass("notAbleOrder");
      $("#pfizer_progress_bar").removeClass("firstStepOrder");
      $("#pfizer_progress_bar").addClass("secondStepOrder");
      $("#pfizer_text_2").removeClass("text-red");
      $("#pfizer_text_2").removeClass("text-blue");
      $("#pfizer_text_2").addClass("text-green");
    }

    $("#quantityModal").modal("hide");

    // Después de añadir el producto exitosamente
    setTimeout(() => {
      document.getElementById("orderListSection").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "addProductToOrder",
    });
    console.error("Erreur lors de l'ajout du produit:", error.message);
  }
};

const deleteProductFromOrder = async (product) => {
  try {
    const response_data = await deleteOrderProduct(order_id.value, product.id);
    order_details.value = order.value.filter((item) => item.id !== product.id);

    Object.values(response_data.data.all_order_detail).forEach(
      (orderDetail) => {
        const product = orderDetail.product; // Aquí obtienes el producto
        const item = orderDetail.items; // Aquí obtienes los detalles del pedido

        const productWithQuantity = {
          ...product, // Usamos product en lugar de selectedProduct.value
          order_detail_quantity: item.order_detail_quantity,
          order_detail_discount: item.order_detail_discount,
          order_detail_price_with_dto: item.order_detail_price_with_dto,
        };

        const index = order_details.value.findIndex(
          (item) => item.id === productWithQuantity.id,
        );

        countCategory.value = response_data.data.countCategory;

        if (index !== -1) {
          order_details.value[index] = productWithQuantity;
        } else {
          order_details.value.push(productWithQuantity);
        }
      },
    );

    let progressBar = document.getElementById("pfizer_progress_bar");
    let progressWidth =
      (Math.min(parseFloat(totalOrderValue.value), 150) / 150) * 100;
    progressBar.style.width = progressWidth + "%";
    $("#pfizer_text_1").html(totalOrderValue.value + " €");

    if (totalOrderValue.value < 200) {
      $("#pfizer_text_2").html("Le montant minimum est de 200€");
      $("#pfizer_progress_bar").addClass("notAbleOrder");
      $("#pfizer_progress_bar").removeClass("firstStepOrder");
      $("#pfizer_progress_bar").removeClass("secondStepOrder");
      $("#pfizer_text_2").addClass("text-red");
      $("#pfizer_text_2").removeClass("text-blue");
      $("#pfizer_text_2").removeClass("text-green");
    } else {
      $("#pfizer_progress_bar").removeClass("notAbleOrder");
      $("#pfizer_progress_bar").removeClass("firstStepOrder");
      $("#pfizer_progress_bar").addClass("secondStepOrder");
      $("#pfizer_text_2").removeClass("text-red");
      $("#pfizer_text_2").removeClass("text-blue");
      $("#pfizer_text_2").addClass("text-green");
    }
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "deleteProductFromOrder",
    });
    console.error("Erreur lors de la suppression du produit:", error.message);
  }
};

const totalOrderValue = computed(() => {
  try {
    return order_details.value
      .reduce((sum, item) => {
        return (
          sum + item.order_detail_quantity * item.order_detail_price_with_dto
        );
      }, 0)
      .toFixed(2);
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "computed",
    });
    console.error("Erreur lors du calcul du total:", error.message);
  }
});

const redirectToOrderConfirm = (order_id, pharmacy_id) => {
  router.push({
    name: "OrderConfirm",
    params: { order_id: order_id, pharmacy_id: pharmacy_id },
  });
};

watch(searchText, async (newValue) => {
  await getProducts();
});

const validateQuantityInput = (value) => {
  // Get the current input value as a number
  const inputValue = Number(value);

  if (product_min_order.value && inputValue < product_min_order.value) {
    return {
      isValid: false,
      message: `La quantité minimale est de ${product_min_order.value}`,
      correctedValue: product_min_order.value,
    };
  }

  if (product_max_order.value && inputValue > product_max_order.value) {
    return {
      isValid: false,
      message: `La quantité maximale est de ${product_max_order.value}`,
      correctedValue: product_max_order.value,
    };
  }

  // If we reach here, the value is valid
  return { isValid: true };
};

const getAllProducts = async () => {
  try {
    const response = await getAllProductSrv();
    products_list.value = response.data;
  } catch (error) {
    ErrorHandler.handleError(error, {
      component: "OrderCreate",
      action: "getAllProducts",
    });
    console.error(
      "Erreur lors de la récupération des produits:",
      error.message,
    );
  }
};

// Añadir computed property para agrupar productos por categoría
const groupedProducts = computed(() => {
  const grouped = {};
  if (!products_list.value || !Array.isArray(products_list.value)) {
    return grouped;
  }

  products_list.value.forEach((product_more) => {
    const category = product_more.product_category_name || "Sans catégorie";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product_more);
  });
  return grouped;
});

const scrollToCategory = (category) => {
  setTimeout(() => {
    const element = document.getElementById(
      "heading" + category.replace(/\s+/g, ""),
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 150); // pequeño delay para asegurar que la animación del acordeón ha comenzado
};

// Function to get input attributes for quantity input
const getInputAttributes = () => {
  const attrs = {};

  // Add min attribute if product_min_order is defined
  if (
    product_min_order !== null &&
    product_min_order !== undefined &&
    product_min_order !== ""
  ) {
    attrs.min = product_min_order;
  }

  // Add max attribute if product_max_order is defined
  if (
    product_max_order !== null &&
    product_max_order !== undefined &&
    product_max_order !== ""
  ) {
    attrs.max = product_max_order;
  }

  return attrs;
};
</script>

<template>
  <div class="card shadow mb-4">
    <div class="card-header card-header-left">
      Commande pour la pharmacie:
      <b>{{ pharmacy_data.pharmacy_name ?? "Nouvelle pharmacie" }}</b>
      (
      <b v-if="pharmacy_data.pharmacy_cip13">{{
        pharmacy_data.pharmacy_cip13
      }}</b>
      )
    </div>
    <div class="card-body">
      <div id="div_aginax_status" class="col-xl-12 col-md-12 mb-4">
        <div
          class="card border-left-info shadow h-100 py-2"
          style="margin-bottom: 0px !important"
        >
          <div class="card-body" style="padding-bottom: 0px !important">
            <div class="row no-gutters align-items-center">
              <div class="col-sm-12 mb-3 mb-sm-0">
                <div class="text-xs font-weight-bold text-uppercase">
                  NoName
                </div>
                <div class="row no-gutters align-items-center">
                  <div class="col-auto">
                    <div
                      id="pfizer_text_1"
                      class="h5 mb-0 mr-3 font-weight-bold text-gray-800"
                    >
                      0.00 €
                    </div>
                  </div>
                  <div class="col">
                    <div class="progress progress-sm mr-2">
                      <div
                        id="pfizer_progress_bar"
                        class="progress-bar bg-info"
                        role="progressbar"
                        style="width: 0%"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-12 mb-3 mb-sm-0">
                <div
                  id="pfizer_text_2"
                  class="text-xs font-weight-bold text-uppercase"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Buscador con nuevo header -->
  <div class="card shadow mb-4">
    <div class="card-header card-header-left">
      <h5>Recherche de produits</h5>
    </div>
    <div class="card-body">
      <div class="form-group row">
        <div class="col-sm-12 mb-3 mb-sm-0">
          <input
            value=""
            type="text"
            class="form-control form-control-user"
            name="searchText"
            id="searchText"
            v-model="searchText"
            placeholder="Nom du produit ou CIP13"
          />
          <ul v-if="products.length" class="suggestions-list">
            <li
              class="nav-item"
              v-for="product in products"
              :key="product.id"
              @click="selectProduct(product)"
            >
              {{ product.product_presentation }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Catálogo por categorías -->
  <!-- 
  <div class="card shadow mb-4">
    <div class="card-header card-header-left">
      <h5 class="mb-0">Catalogue de produits par catégorie</h5>
    </div>
    <div class="card-body py-2">
      <div class="accordion" id="productCategories">
        <div v-for="(products, category) in groupedProducts" :key="category" class="card mb-1">
          <div class="card-header py-1" :id="'heading' + category.replace(/\s+/g, '')">
            <h2 class="mb-0">
              <button class="btn btn-link btn-block text-left collapsed py-0" 
                      type="button" 
                      data-toggle="collapse" 
                      :data-target="'#collapse' + category.replace(/\s+/g, '')"
                      :aria-expanded="false" 
                      :aria-controls="'collapse' + category.replace(/\s+/g, '')"
                      @click="scrollToCategory(category)">
                {{ category }}
              </button>
            </h2>
          </div>

          <div :id="'collapse' + category.replace(/\s+/g, '')" 
               class="collapse" 
               :aria-labelledby="'heading' + category.replace(/\s+/g, '')" 
               data-parent="#productCategories">
            <div class="card-body py-1">
              <div class="row g-2">
                <div v-for="product in products" :key="product.id" class="col-md-4 mb-1">
                  <div class="product-card">
                    <div class="content-wrapper">
                      <div class="product-title">{{ product.product_presentation }}</div>
                      <div class="product-info">
                        <span>Prix: {{ product.product_unit_price_pght }} €</span>
                      </div>
                      <button class="btn btn-primary btn-xs" @click="selectProduct(product)">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  -->

  <!-- Nuevo header para la lista de pedidos -->
  <div class="card shadow mb-4" id="orderListSection">
    <div class="card-header card-header-left">
      <h5>Liste des produits commandés</h5>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table
          class="table table-striped table-bordered text-12"
          id="tableOrder"
          width="100%"
          cellspacing="0"
        >
          <thead>
            <tr>
              <th class="th-sm">Référence</th>
              <th class="th-sm">Prix</th>
              <th class="th-sm">Quantité</th>
              <th class="th-sm">Remise</th>
              <th class="th-sm">Prix avec remise</th>
              <th class="th-sm">Total</th>
              <th class="th-sm">Supprimer</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order_details" :key="item.id">
              <td>{{ item.product_presentation }}</td>
              <td>{{ item.product_unit_price_pght }} €</td>
              <td>{{ item.order_detail_quantity }}</td>
              <td>{{ item.order_detail_discount }} %</td>
              <td>{{ item.order_detail_price_with_dto }} €</td>
              <td>
                {{
                  (
                    item.order_detail_quantity *
                    item.order_detail_price_with_dto
                  ).toFixed(2)
                }}
                €
              </td>
              <td>
                <a
                  class="table_button btn btn-danger"
                  href="#"
                  @click.prevent="deleteProductFromOrder(item)"
                >
                  <i class="fas fa-xs fa-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-right mt-3">
        <h5>Montant total de la commande: {{ totalOrderValue }} €</h5>
      </div>
      <div class="text-center mt-3" v-if="parseFloat(totalOrderValue) >= 200">
        <button
          id="buttonRedirectToOrderConfirm"
          class="btn btn-primary"
          @click="redirectToOrderConfirm(order_id, pharmacy_data.id)"
        >
          Voir les détails de la commande
        </button>
      </div>
      <div class="text-center mt-3" v-else-if="countCategory === 0">
        <p class="text-danger font-weight-bold">
          Il faut ajouter un produit générique
        </p>
      </div>
      <div class="text-center mt-3" v-else>
        <p class="text-danger font-weight-bold">
          La commande n'a pas atteint la valeur minimale
        </p>
      </div>
    </div>
  </div>

  <!-- Modal pour sélectionner la quantité -->
  <div
    class="modal fade"
    id="quantityModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="quantityModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="quantityModalLabel">
            Sélectionner la quantité
          </h5>
          <button
            type="button"
            class="close"
            data-bs-dismiss="modal"
            aria-label="Fermer"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="quantityInput">Quantité</label>
            <input
              type="number"
              class="form-control"
              id="quantityInput"
              v-model="quantity"
              v-bind="getInputAttributes()"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57;"
            />
            <small class="text-danger" v-if="product_min_order">
              {{ `Quantité minimale: ${product_min_order}` }}
            </small>
            &nbsp;-&nbsp;
            <small class="text-danger" v-if="product_max_order">
              {{ `Quantité maximale: ${product_max_order}` }}
            </small>
            <small
              class="text-warning d-block"
              v-if="product_short_term && product_short_term == 1"
            >
              Produit à court terme{{
                product_expiration_date
                  ? ` - Date péremption: ${product_expiration_date}`
                  : ""
              }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="addProductToOrder"
          >
            Ajouter à la commande
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notAbleOrder {
  background-color: red !important;
}
.firstStepOrder {
  /*background-color: rgb(52, 22, 219) !important;*/
  background-color: rgb(221, 221, 46) !important;
}
.secondStepOrder {
  background-color: rgb(6, 185, 75) !important;
}
.text-red {
  --bs-text-opacity: 1;
  color: red !important;
}
.text-blue {
  --bs-text-opacity: 1;
  /*color: blue !important;*/
  color: rgb(221, 221, 46) !important;
}
.text-green {
  --bs-text-opacity: 1;
  color: green !important;
}
.text-yellow {
  --bs-text-opacity: 1;
  color: rgb(221, 221, 46) !important;
}

/* Nuevos estilos para el catálogo */
.accordion .btn-link {
  color: #4e73df;
  text-decoration: none;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
}

.accordion .btn-link:hover,
.accordion .btn-link:focus {
  color: #2e59d9;
  text-decoration: none;
  box-shadow: none;
}

.accordion .card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 0.5rem;
}

.accordion .card-header {
  padding: 0;
  background-color: #f8f9fc;
}

.card-title {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.card-text small {
  color: #858796;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.btn-primary {
  margin-top: 0.5rem;
}

.accordion .btn-link {
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
}

.card-title {
  font-size: 0.9rem;
  line-height: 1.2;
}

.card-text small {
  font-size: 0.8rem;
  line-height: 1.1;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.accordion .card {
  margin-bottom: 0.25rem;
}

.accordion .card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.card-body .row {
  margin-right: -0.5rem;
  margin-left: -0.5rem;
}

.card-body .col-md-6 {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.card-body {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.btn-sm {
  padding-top: 0.15rem !important;
  padding-bottom: 0.15rem !important;
  margin-top: 0.25rem !important;
  margin-bottom: 0 !important;
}

.card-title {
  margin-top: 0 !important;
  font-size: 0.9rem;
  line-height: 1.2;
}

.card-text {
  margin-bottom: 0.25rem !important;
}

.card-text small {
  font-size: 0.8rem;
  line-height: 1.1;
}

.product-card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.content-wrapper {
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center; /* Centrar todo el contenido */
}

.product-title {
  font-size: 0.75rem;
  line-height: 1;
  font-weight: 600;
  margin-bottom: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info {
  font-size: 0.7rem;
  line-height: 1;
  color: #666;
  flex-grow: 1;
}

.product-info span {
  display: block;
  margin-bottom: 0.1rem;
}

.btn-xs {
  padding: 0.1rem 0.3rem;
  font-size: 0.7rem;
  line-height: 1;
  border-radius: 0.2rem;
  margin-top: 0.1rem;
  align-self: center; /* Centrar el botón */
}

/* Ajustes del acordeón */
.accordion .card-header {
  padding: 0.25rem;
}

.accordion .btn-link {
  padding: 0;
  font-size: 0.9rem;
}

.accordion .card-body {
  padding: 0.25rem !important;
}

.row {
  margin-right: -0.25rem;
  margin-left: -0.25rem;
}

.col-md-4 {
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}

/* Asegurar que los elementos estén alineados */
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-info {
  flex-grow: 1;
}

/* Eliminar esta línea que estaba causando el problema */
/* .btn-primary {
  align-self: flex-start;
} */
</style>

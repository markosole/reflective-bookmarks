<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    <Modal :size="size" v-if="isAddCatShowModal" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg text-white">
          Add new category
        </div>
      </template>
      <template #body>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-3">
          Fill all details to add new category. Set the order number to arrange it on the list.
        </p>        
        <div class="mb-6">
            <label for="category-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category name</label>
            <input type="text" id="category-name" v-model="categoryName" placeholder="Enter name..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="mb-6">
            <label for="category-order" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Set order</label>
            <input type="number" id="category-order" v-model="categoryOrder" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
      </template>      
      <template #footer>
        <div class="flex justify-between">
          <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Cancel
          </button>
          <button @click="addCategory" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Save
          </button>
        </div>
      </template>
    </Modal>
</template>

<script>
const size = ref('md')
const isAddCatShowModal = ref(false)
function closeModal() {
  isAddCatShowModal.value = false
}

const endpoint = "/";

export default {
  expose: ['addNewCategory'],
  data() {
    return {
      categoryName: '',
      categoryOrder: '', 
    };
  },
  methods: {
    async addCategory() {
        if(this.categoryName == '') {
            this.$parent.createNotification('warning', 'Category not added','Please enter category name');
            return;
        }
        var profile = await this.$parent.getActiveUserProfile();
        var data = {
            category_name: this.categoryName,
            category_order: this.categoryOrder == '' ? 9999 : parseInt(this.categoryOrder),
            category_owner: profile.id ? profile.id : 0
        }
        const sent = await fetch(endpoint + 'add-category', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if (resp.status == "success") {
              isAddCatShowModal.value = false;
              this.$parent.createNotification('success', 'Category added','Category added successfully');
            } else {
              this.$parent.createNotification('warning', 'Category not added','Could not save category');
            }
        }).catch(error => {
            console.log(error)
            this.$parent.createNotification('danger', 'Category not added','Could not save category');
        })
        this.refreshCategories(); 
    },
    refreshCategories() {
        this.$parent.getCategories();
        this.$parent.getAgregatedData();
    },
    addNewCategory() {
      isAddCatShowModal.value = true
    }
  },
};
</script>

<style lang="scss">
.testiram {
  @apply opacity-50 bg-gray-100 border border-blue-500;
}
.overflow-y-auto {
    -webkit-backdrop-filter: saturate(50%) blur(8px);
    backdrop-filter: saturate(50%) blur(8px);
    background: rgba(21, 31, 56, 0.2);
    transition: all 0.3s ease-in-out;
  }
</style>

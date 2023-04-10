<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    <Modal :size="size" v-if="isEditCategoryShowModal" @close="closeModal">
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
        <div class="mb-6">
            <input type="hidden" id="category-order" v-model="categoryId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
      </template>      
      <template #footer>
        <div class="flex justify-between">
          <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Cancel
          </button>
          <button @click="deleteCategory" type="button" class="text-white bg-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-white-300 rounded-lg border border-blue-200 text-sm font-medium px-5 py-2.5 hover:text-white-900 focus:z-10 dark:bg-red-600 bg-red-600 dark:text-white-300 text-white-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-red-700 dark:focus:ring-red-600">
            Delete
          </button>
          <button @click="saveCategoryChanges" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Save changes
          </button>
        </div>
      </template>
    </Modal>
</template>

<script>
import { ref } from 'vue'
const size = ref('md')
const isEditCategoryShowModal = ref(false)
function closeModal() {
    isEditCategoryShowModal.value = false
}

const endpoint = "/";

export default {
  expose: ['editCategory'],
  data() {
    return {
      categoryName: '',
      categoryOrder: '', 
      categoryId: '', 
    };
  },
  methods: {
    editCategory(id, name, order) {
        this.categoryId = id;
        this.categoryName = name;
        this.categoryOrder = order;
        isEditCategoryShowModal.value = true
    },
    async saveCategoryChanges() {
        const profile = await this.$parent.getActiveUserProfile(); //this.$parent.cookies.get("UserProfile");
        var data = {
            _id: this.categoryId,
            category_name: this.categoryName,
            category_order: this.categoryOrder == '' ? 9999 : parseInt(this.categoryOrder),
            category_owner: profile.id
        }
        const sent = await fetch(endpoint + 'category/edit', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if (resp.status == "success") {
                isEditCategoryShowModal.value = false;
                this.refreshCategories();
                this.$parent.createNotification('success', 'Category saved','Category saved successfully');
            } else {
                this.$parent.createNotification('warning', 'Category not saved','Could not save changes');
            }
        }).catch(error => {
            this.$parent.createNotification('danger', 'Category not saved','Could not save changes');
        })
    },
    async deleteCategory() {
        isEditCategoryShowModal.value = false;
        var data = {
            _id: this.categoryId,
        }
        const sent = await fetch(endpoint + 'category/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if (resp.status == "success") {
                this.refreshCategories();
                this.$parent.createNotification('success', 'Category deleted','Category deleted successfully');
            } else {
                this.$parent.createNotification('danger', 'Category not deleted',resp.message);
            }
        }).catch(error => {
            this.$parent.createNotification('danger', 'Category not deleted','Could not delete category');
        })
    },
    refreshCategories() {
        this.$parent.getCategories();
        this.$parent.getAgregatedData();
    }
  },
};
</script>


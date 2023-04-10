<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    <Modal :size="size" v-if="isAddBookmarkShowModal" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg text-white">
          Add new Bookmark
        </div>
      </template>
      <template #body>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-3">
          Fill all details to add new bookmark
        </p>
        
        <div class="mb-6">
            <label for="bookmark-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bookmark name</label>
            <input type="text" id="bookmark-name" v-model="bookmarkName" placeholder="Enter name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="mb-6">
            <label for="bookmark-alias" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bookmark description</label>
            <input type="text" id="bookmark-alias" v-model="bookmarkAlias" placeholder="Enter description" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="mb-6">
            <label for="bookmark-image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bookmark image</label>
            <input type="text" id="bookmark-image" v-model="bookmarkImage" placeholder="Enter path" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="mb-6">
            <label for="bookmark-url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bookmark URL</label>
            <input type="text" id="bookmark-url" v-model="bookmarkUrl" placeholder="Enter URL" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="mb-6">
            <label for="bookmark-order" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Set order</label>
            <input type="number" id="bookmark-order" v-model="bookmarkOrder" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div> 
        
        <div class="mb-6">
            <input type="hidden" id="add-to-category" v-model="bookmarkCategory" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-3">
          Pick category from the list or save as Uncategorized
        </p>
        <label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Category</label>
        <select id="categories" @click="getCategories" v-model="bookmarkCategory" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <template v-for="category in categories" >
            <option :value="category.id">{{ category.category_name }}</option>
          </template>            
        </select>
      </div>
      </template>
      
      <template #footer>
        <div class="flex justify-between">
          <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Cancel
          </button>
          <button @click="addBookmark" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Save
          </button>
        </div>
      </template>
    </Modal>
</template>

<script>

import { ref } from 'vue'
const size = ref('md')
const isAddBookmarkShowModal = ref(false)
function closeModal() {
  isAddBookmarkShowModal.value = false
}

const endpoint = "/";

export default {
expose: ['enterNewBookmark'],
  components: {
  },
  data() {
    return {
      categories: [],
    };
  },
  methods: {
    async addBookmark() {
        if(this.bookmarkName == '' || this.bookmarkUrl == '') {
          this.$parent.createNotification('warning', 'Bookmark not added','Please fill required fields');
          return;
        }
        var profile = await this.$parent.getActiveUserProfile();

        var data = {
            bookmark_name: this.bookmarkName,
            bookmark_alias: this.bookmarkAlias,
            bookmark_image: this.bookmarkImage,
            bookmark_url: this.bookmarkUrl,
            bookmark_order: this.bookmarkOrder == '' ? 9999 : parseInt(this.bookmarkOrder),
            bookmark_category: this.bookmarkCategory == '' ? 0 : parseInt(this.bookmarkCategory),
            bookmark_owner: profile.id
        }

        const sent = await fetch(endpoint + 'add-bookmark', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if (resp.status == "success") {
              isAddBookmarkShowModal.value = false;
              this.$parent.getAgregatedData();
              this.$parent.createNotification('success', 'Bookmark added','Bookmark added successfully');
            } else {
              this.$parent.createNotification('warning', 'Bookmark not added','Could not save bookmark');
            }
        }).catch(error => {
            this.$parent.createNotification('danger', 'Bookmark not added','Could not save bookmark');
        })
    },
    enterNewBookmark(id, name) {
      this.resetFields();
      this.bookmarkCategory = id;
      isAddBookmarkShowModal.value = true
    },
    async getCategories() {
      var cats = await this.$parent.getCategories();
      this.categories = cats;
    },
    resetFields() {
      this.bookmarkName = '';
      this.bookmarkOrder = '';  
      this.bookmarkAlias = '';
      this.bookmarkImage = '';
      this.bookmarkUrl = '';
    }
  },
  mounted() {
    this.getCategories();
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

<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    
    <Modal :size="size" v-if="isEditBookmarkShowModal" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg text-white">
          Edit Bookmark
        </div>
      </template>
      <template #body>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-3">
          Edit or delete this bookmark
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
        <div class="mb-6">
            <input type="hidden" id="bookmark-id" v-model="bookmarkId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div> 

      </template>
      <template #footer>
        <div class="flex justify-between">
          <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Cancel
          </button>

          <button @click="deleteBookmark" type="button" class="text-white bg-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-white-300 rounded-lg border border-blue-200 text-sm font-medium px-5 py-2.5 hover:text-white-900 focus:z-10 dark:bg-red-600 bg-red-600 dark:text-white-300 text-white-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-red-700 dark:focus:ring-red-600">
            Delete
          </button>
          <button @click="saveBookmarkChanges" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Save changes
          </button>
        </div>
      </template>
    </Modal>
</template>

<script>
import { ref } from 'vue'
const size = ref('md')
const isEditBookmarkShowModal = ref(false)

function closeModal() {
  isEditBookmarkShowModal.value = false
}

const serverport = process.env.VUE_APP_SERVER_PORT || (window.location.port !== '' ? window.location.port : 80);
const api_server = process.env.VUE_APP_SERVER_HOST || window.location.href;
const endpoint = api_server + (serverport == 80 ? '/' : ':' + serverport);

export default {
expose: ['enterEditBookmark', 'saveBookmarkOrderedChanges'],
  data() {
    return {
      bookmarkName: '',
      bookmarkOrder: '',  
    };
  },
  components: {
  },
  methods: {
    enterEditBookmark(data) {
      this.bookmarkId = data.id;
      this.bookmarkName = data.bookmark_name;
      this.bookmarkAlias = data.bookmark_alias;
      this.bookmarkImage = data.bookmark_image;
      this.bookmarkUrl = data.bookmark_url;
      this.bookmarkCategory = data.bookmark_category;
      this.bookmarkOrder = data.bookmark_order;
      isEditBookmarkShowModal.value = true
    },
    async saveBookmarkChanges() {
        if(this.bookmarkName == '' || this.bookmarkName == '') {
            this.$parent.createNotification('warning', 'Changes not saved','Please fill required fields');
            return;
        }
        var data = {
            _id: this.bookmarkId,
            bookmark_name: this.bookmarkName,
            bookmark_alias: this.bookmarkAlias,
            bookmark_image: this.bookmarkImage,
            bookmark_url: this.bookmarkUrl,
            bookmark_order: this.bookmarkOrder == '' ? 9999 : parseInt(this.bookmarkOrder),
            bookmark_category: this.bookmarkCategory == '' ? 0 : parseInt(this.bookmarkCategory)
        }

        const sent = await fetch(endpoint + 'bookmark/edit', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            this.$parent.getAgregatedData();
            if (resp.status == "success") {
                this.$parent.createNotification('success', 'Changes saved','Bookmark data saved successfully');
                isEditBookmarkShowModal.value = false;
            } else {
                this.$parent.createNotification('warning', 'Changes not saved','Bookmark changes not saved');
            }

        }).catch(error => {
            this.$parent.createNotification('danger', 'Bookmark changes','Could not save changes');
        })
        data = null;
    },
    // @ Update single bookmark order
    async saveBookmarkOrderedChanges(data) {
      var ordered = {
          _id: data.element.id,
          bookmark_order: data.element.bookmark_order,
          bookmark_category: data.element.bookmark_category
      }
      // Uses same endpoint as saveBookmarkChanges
      if(ordered){
        const sent = await fetch(endpoint + 'bookmark/edit', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(ordered)
      }).then(response => {
          return response.json();
      }).then(resp => {
          this.$parent.getAgregatedData();
          if (resp.status == "success") {
              this.$parent.createNotification('success', 'Changes saved','Bookmark order saved successfully');
          } else {
              this.$parent.createNotification('warning', 'Changes not saved','Could not save order changes');
          }
      }).catch(error => {
          this.$parent.createNotification('danger', 'Changes not saved','Could not save order changes');
      })
      }
      ordered = null;      
    },
    // @ Delete bookmark
    async deleteBookmark(){
      var data = {
            _id: this.bookmarkId
          }
      const sent = await fetch(endpoint + 'bookmark/delete', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      }).then(response => {
          return response.json();
      }).then(resp => {
          this.$parent.getAgregatedData();
          if (resp.status == "success") {
              this.$parent.createNotification('success', 'Bookmark deleted','Bookmark deleted successfully');
              isEditBookmarkShowModal.value = false;
          } else {
              this.$parent.createNotification('warning', 'Bookmark not deleted','Could not delete bookmark');
          }
      }).catch(error => {
          this.$parent.createNotification('danger', 'Bookmark not deleted','Could not delete bookmark');
      })
    }
  }, 
};
</script>

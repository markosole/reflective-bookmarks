<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    <Modal :size="size" v-if="isAddNewProfileModal" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg text-white">
          Create new profile
        </div>
      </template>
      <template #body>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-3">
          Fill all details to add new profile.
        </p>        
        <div class="mb-6">
            <label for="profile-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile name</label>
            <input type="text" id="profile-name" v-model="profileName" placeholder="Enter name..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="mb-6">
            <label for="avatar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avatar image</label>
            <input type="text" id="avatar" v-model="profileAvatar" placeholder="Enter url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
      </template>      
      <template #footer>
        <div class="flex justify-between">
          <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Cancel
          </button>
          <button @click="addProfile" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Save
          </button>
        </div>
      </template>
    </Modal>
</template>

<script>
const size = ref('md')
const isAddNewProfileModal = ref(false)
function closeModal() {
    isAddNewProfileModal.value = false
}

const serverport = process.env.VUE_APP_SERVER_PORT || (window.location.port !== '' ? window.location.port : 80);
const api_server = process.env.VUE_APP_SERVER_HOST || window.location.href;
const endpoint = api_server + (serverport == 80 ? '/' : ':' + serverport);

export default {
  expose: ['addNewProfile'],
  data() {
    return {
      profileName: '',
      profileAvatar: '', 
    };
  },
  methods: {
    async addProfile() {
        var profileName = this.profileName;
        var profileAvatar = this.profileAvatar;
        
        if(profileName == '') {
          this.$parent.createNotification('warning', 'Profile not added','Please fill required fields');
          return;
        }
        var data = {
            profile_name: profileName,
            profile_avatar: profileAvatar
        }

        const sent = await fetch(endpoint + 'user-profiles/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if (resp.status == "success") {
              isAddNewProfileModal.value = false;
              this.$parent.hadleProfileSelection(); 
              this.$parent.createNotification('success', 'New profile added','New profile added successfully');
            } else{
              this.$parent.createNotification('warning', 'Profile not added','Could not add profile');
            }
        }).catch(error => {
            this.$parent.createNotification('danger', 'Profile not added','Could not add profile');
        })
    },
    addNewProfile() {
      isAddNewProfileModal.value = true
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

<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    <Modal :size="size" v-if="isEditProfileModal" @close="closeModal">
      <template #header>
        <div class="flex items-center text-center pl-30 text-lg text-white">
          Your profile
        </div>
      </template>
      <template #body>
        <div class="flex flex-col items-center pb-5">
          <img class="w-32 h-32 rounded-full ml-2 mt-1 sidebar-profile-image" :src="profileAvatar ? profileAvatar : './images/user.png'" :title="profileName">    
          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ profileName }}</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">Private profile</span>
          <p class="flex items-center text-sm text-gray-500 mt-5 -mb-8 dark:text-gray-400">Deleting profile all Bookmark data will be lost <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button"><svg class="w-4 h-4 ml-2 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg><span class="sr-only">Show information</span></button></p>
      </div>        
        
      </template>      
      <template #footer>
        <div class="flex justify-between">
          <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Cancel
          </button>
          <button @click="deleteProfile" v-if="!timeoutExpired" type="button" class="text-white bg-blue-700 hover:bg-gray-800 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-900 dark:focus:ring-gray-600">
            {{  deleteCounter  }}
          </button>
          <button @click="confirmRemoval" v-if="timeoutExpired" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Confirm
          </button>
        </div>
      </template>
    </Modal>
</template>

<script>
const size = ref('md')
const isEditProfileModal = ref(false)
function closeModal() {
    isEditProfileModal.value = false
}

const endpoint = "/";

export default {
  expose: ['EditActiveProfile'],
  data() {
    return {
       profileName: '',
       profileAvatar: '',
       profileId: '',
       deleteCounter: 'Delete profile',
       timeoutExpired: false
    };
  },
  methods: {
    async EditActiveProfile() {
      this.timeoutExpired = false;
      this.deleteCounter = 'Delete profile';
      const profile = await this.$parent.getActiveUserProfile();
      this.profileId = profile.id;
      this.profileName = profile.name;
      this.profileAvatar = profile.avatar;
      isEditProfileModal.value = true
    },
    deleteProfile() {
      let counter = 5;
      let interval = setInterval(() => {
        --counter;
        this.deleteCounter = `Delete profile (${counter})`;
        if (counter === 0) {
          this.timeoutExpired = true;
          clearInterval(interval);
        }
      }, 1000);
    },
    async confirmRemoval() {
      var data = {
            profile_id: this.profileId
        }

        const sent = await fetch(endpoint + 'user-profiles/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
          console.log("Response from delete profile: ", resp);
            if (resp.status == "success") {
              isEditProfileModal.value = false;
              this.$parent.unsetUserProfile();
              this.$parent.createNotification('success', 'User profile removed','Profile removed successfully');
            } else {
              this.$parent.createNotification('warning', 'User profile not removed','User Profile could not be removed');
            }
        }).catch(error => {
            this.$parent.createNotification('danger', 'User profile not removed','User Profile could not be removed');
        })
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

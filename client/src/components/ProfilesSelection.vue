<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template >
    <Modal :size="size" v-if="isUserProfileShowModal" @close="closeProfilesModal">
      <template #body>
        <div class="relative w-full h-full max-w-md md:h-auto">
        <div class="relative rounded-lg dark:bg-gray-700">
            <div class="close-masker"></div>
                <h3 v-if="userprofiles" class="text-base font-semibold text-gray-900 lg:text-xl dark:text-white profiles-header">
                    Bookmark Profiles
                </h3>
                <h3 v-if="!userprofiles" class="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                    Create new profile
                </h3>
            <div class="p-0">
                <p v-if="userprofiles" class="text-sm font-normal text-gray-500 dark:text-gray-400">Select one of available profiles. We will make sure your selection is saved for next 30 days.</p>
                <p v-if="!userprofiles" class="text-sm font-normal text-gray-500 dark:text-gray-400">Enter the Name and add Avatar to create new profle.</p>
                <ul class="my-4 space-y-3">
                    <template v-for="profile in userprofiles" >
                        <li @click="configureProfile(profile.id, profile.profile_name, profile.profile_avatar)">
                        <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <img class="w-10 h-10 rounded-full mt-2" :src="profile.profile_avatar ? profile.profile_avatar : './images/user.png'" :title="profile.profile_name">
                            <span class="flex-1 ml-3 whitespace-nowrap">{{ profile.profile_name }}</span>
                            <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Personal</span>
                        </a>
                    </li>
                    </template> 
                </ul>
                <div>
                    <a href="#" class="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                        <svg aria-hidden="true" class="w-3 h-3 mr-2" focusable="false" data-prefix="far" data-icon="question-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"></path></svg>
                        This will be displayed again in 30 days.</a>
                    <span @click="createBrandNewProfile" class="text-gray-500 dark:text-gray-400 pl-3 pr-3 rounded dark:hover:bg-gray-600  add-new">Add new</span>
                </div>
            </div>
        </div>
    </div>
      </template>
    </Modal>
</template>

<script>
import { ref } from 'vue'
const size = ref('md')
const isUserProfileShowModal = ref(false)

function  closeProfilesModal() {
    isUserProfileShowModal.value = false
}

const serverport = process.env.VUE_APP_SERVER_PORT || (window.location.port !== '' ? window.location.port : 80);
const api_server = process.env.VUE_APP_SERVER_HOST || window.location.href;
const endpoint = api_server + (serverport == 80 ? '/' : ':' + serverport);

export default {
  expose: ['showProfilesModal'],
  components: {
  },
  data() {
    return {
      userprofiles: [],
    };
  },
  methods: {
    async getUserProfiles() {
      const response = await fetch(endpoint + 'user-profiles');
      const data = await response.json();
      this.userprofiles = data;
    },
    showProfilesModal() {
        this.getUserProfiles();
        isUserProfileShowModal.value = true;
    },
    async configureProfile(id, name, avatar) {
        console.log("> Trying to set user profile: " + id + " " + name + " " + avatar + "")
        var user = {id:id, name:name, avatar:avatar};
        this.$parent.setuserProfile(user);
        closeProfilesModal();
    },
    createBrandNewProfile() {
        closeProfilesModal();
        this.$parent.addNewProfile();
    }
  }
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
.close-masker {
    display: none;
    height: 40px;
    width: 40px;
    position: absolute;
    top: -50px;
    right: -10px;
    background: #374151;
}
.profiles-header {
    margin-top: -50px;
}
.add-new {
    cursor: pointer;
    position: absolute;
    right: 0;
}

</style>

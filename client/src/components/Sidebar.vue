<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'

</script>
<template>
    <div class="w-20 h-full fixed bg-gray-900 dark:bg-gray-900 hover:w-60 transition-all text-white reflect-sidebar">
    <div class="h-10 w-40">
        <img src="/images/bm_square.svg" class="mt-4 pt-0 ml-5 logo-small w-9 h-16"/>
        <img src="/images/bm_logo.svg" class="mt-4 ml-5 mr-0 logo-large w-40 h-16">
    </div>
    
    <div class="real-bar absolute mt-3"> 
        <button @click="addCategory" type="button" class="mt-8 ml-12 w-40 text-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-left dark:bg-transparent dark:hover:bg-transparent btns">
            Add Category
        </button>
        
        <button @click="addBookmark" type="button" class="mt-5 ml-12 w-40 text-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-left dark:bg-transparent dark:hover:bg-transparent btns">
            Add Bookmark
        </button>
        <button @click="exportBookmarks" type="button" class="mt-5 ml-12 w-40 text-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-left dark:bg-transparent dark:hover:bg-transparent btns">
            Export Bookmarks
        </button>
        <button @click="importBookmarks" type="button" class="mt-5 ml-12 w-42 text-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-left dark:bg-transparent dark:hover:bg-transparent btns">
            Import Bookmarks
        </button>
    </div>

    <div class="placeholder-bar fixed mt-6 dark:text-gray-600">
        <div class="placeholder m-5 w-10 p-1">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"></path>
            </svg>
        </div>
        <div class="placeholder m-5 w-10 p-1">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <div class="placeholder m-5 w-10 p-1">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path>
            </svg>
        </div>
        <div class="placeholder m-5 w-10 p-1">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
    </div>
    
    <div @click="unsetUserProfile()" class="change-profile absolute inset-x-0 bottom-20 m-2 ml-5 text-center rounded-full h-10 w-10 pt-2.5 pl-2 pb-1 dark:bg-gray-800 bg-gray-800 reflect-devAA"> 
        <svg fill="none" stroke="currentColor" title="Change profile" stroke-width="1.5" viewBox="0 0 33 33" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
        </svg>
    </div>
    <div @click="profileOptions()" class="absolute inset-x-0 bottom-2 m-2 text-center rounded-full h-16 w-16 pt-1 pb-1 dark:bg-gray-800 bg-gray-800 reflect-devAA"> 
        <img class="w-12 h-12 rounded-full ml-2 mt-1 sidebar-profile-image" :src="profileAvatar ? profileAvatar : './images/user.png'" :title="profileName">    
    </div>

    <div class="absolute inset-x-0 bottom-20 m-2 pb-2.5 left-16 change-profile">
        <span class="dark:text-gray-500 text-gray-500 text-xs">Change profile </span>
    </div>

    <div class="absolute inset-x-0 bottom-4 m-2 left-20 footer-profile">
        <span class="dark:text-gray-400 text-gray-400 text-xs">Current profile </span><br>
        <span>{{ profileName }}</span>
    </div>
    </div>
</template>

<script>
const size = ref('md')
export default {
  expose: ['loadProfileAvatar'],
  data() {
    return {
      profileAvatar: "",
      profileName: "",
    };
  },
  methods: {
    importBookmarks() {
        // Use: https://github.com/manuelojeda/vue3-simple-file-input
        this.$parent.createNotification('info', 'Feature not available','Import feature is not available yet.');
    },
    async loadProfileAvatar(){
        var profile = await this.$parent.getActiveUserProfile();
        this.profileAvatar = profile.avatar;
        this.profileName = profile.name;
    },
    addCategory() {
        this.$parent.addCategory();
    },
    addBookmark() {
        this.$parent.addBookmark();
    },
    exportBookmarks(){
        this.$parent.exportBookmarks();
    },
    unsetUserProfile(){
        this.$parent.unsetUserProfile();
    },
    profileOptions(){
        this.$parent.profileOptions();
    }    
  },
    mounted() {
        this.loadProfileAvatar();
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
.reflect-sidebar {
    z-index: 10;
    overflow: hidden;
}
.reflect-sidebar:hover {
// background-color: #0e9f6e;
}
.reflect-dev{
    transition: all 0.3s ease-in-out;
    // border-radius: 50px;
    font-size: 13px;
    height: 60px;
    padding-top: 12px;
    cursor: default;
}
.reflect-devAA {
    cursor: pointer;
}

.reflect-sidebar:hover .reflect-dev {
    background-color: #0067f4;
    border-radius: 4px;
    height: 35px;
    padding-top: 6px;
    font-size: 16px;
}
.reflect-sidebar:hover .placeholder-bar {
    color: #e7e7e7 !important;
    transition: all 0.2s ease-in-out;
}

.btns {
    opacity: 0;
}
.btns:hover {
    color: #c0c0c0;
    padding-left: 23px;
}

.reflect-sidebar:hover .btns {
    transition: all 0.3s ease-in-out;
    opacity: 1;
    display: block;
    // background-color: #085a3f;
}

.logo-small {
    display: block;
    transition: all 0.3s ease-in-out;
}


.reflect-sidebar:hover .logo-small {
    display: none;    
    // width: 0;
    // height: 0;
}
.logo-large {
    display: none;
    transition: all 0.3s ease-in-out;
}

.reflect-sidebar:hover .logo-large {
    display: block;
    transition: all 0.3s ease-in-out;
}
.placeholder-bar {
    margin-left: -3px;
    transition: all 0.2s ease-in-out;

}

.footer-profile {
    opacity: 0;
    margin-bottom: 5px;
}
.reflect-sidebar:hover .footer-profile{
    opacity: 1;
    margin-bottom: 10px;
    transition: all 0.3s ease-in-out;
}
.change-profile {
    opacity: 0;
    margin-bottom: 5px;
    transition: all;
}

.reflect-sidebar:hover > .change-profile {
    // animation: dotty steps(1,end) 1s;
    animation: color-me-in 0.5s 0.3s forwards;
}
@keyframes color-me-in {
    75%  { opacity: 1; }
    100% { opacity: 1; }
}
</style>

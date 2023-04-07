<template>
  <!-- flex items-center justify-center -->
  <div id="app" class="min-h-screen">
    <Sidebar ref="sidebarRef"/>
    <div class="flex flex-col w-full loading-bar" v-if="loading">
      <span class="inline-block w-3 h-3 bg-teal-500 rounded-full"></span>
      <span class="inline-block ml-2 dots-loading">Loading</span>
    </div>
    <div class="home-wrapper">
      
      <AddCategory ref="addCategoryModal"/>
      <AddBookmark ref="addBookmarModal"/>
      <EditBookmark ref="editBookmarkModal"/>
      <EditCategory ref="editCategoryModal"/>
      <ProfilesSelection ref="profilesSelectionModal"/>
      <ProfileAddNew ref="profileAddNewModal"/>
      <EditProfile ref="editProfileModal"/>
      
      <!-- Dahboard stats component - future project  -->
      <div v-if="!showWelcome">
        <h3 class="text-gray-500 ml-8 pt-2">Hi {{ profileName }}, welcome back!</h3>
        <div class="header mt-3" v-for="agregator in agregated" :cat="agregator" :key="categoriesRefreshKey" ref="bookmarkCardRefMain">
              <h3 class="text-2x2 ml-3 font-bold text-white inline-block" :id="agregator.id">{{ agregator.category_name }}</h3>
              <div class="action-buttons">
                <button @click="editCategory(agregator.id, agregator.category_name, agregator.category_order)" type="button" class="reflect-action-button mt-5 ml-3 text-gray-500 hover:text-white hover:bg-gray-100 hover:bg-gray-100  focus:outline-none font-medium rounded-lg text-sm px-2.5 py-1.5 text-center dark:hover:bg-gray-700 dark:hover:bg-gray-500 hover:bg-gray-500">^ Edit Category</button>
                <button @click="addBookmark(agregator.id, agregator.category_name)" type="button" class="reflect-action-button mt-5 ml-3 text-gray-500 hover:text-white hover:bg-gray-100 hover:bg-gray-100  focus:outline-none font-medium rounded-lg text-sm px-2.5 py-1.5 text-center dark:hover:bg-gray-700 dark:hover:bg-gray-500 hover:bg-gray-500">+ Add Bookmark</button>
            </div>
            <span class="spacer"></span>
            <draggable v-model="agregator.bookmarks" :data-category="agregator.id" ghost-class="ghost" group="people" @end="dragEnded" @start="dragStart" :move="checkMove" item-key="index">
              <template #item="{element}">
                <bookmark-card :bookmark="element">
                </bookmark-card>
              </template>
            </draggable>
        </div>
     </div>
      <!-- Welcome section  -->
      <div v-if="showWelcome" class="grid h-screen place-items-center">
        <div class="w-full max-w-lg bg-white dark:border-gray-700 welcome-modal">
          <div class="flex justify-end px-4 pt-4">              
          </div>
          <div class="flex flex-col items-center pb-20 pt-20">
              <h5 class="mb-4 text-xl font-medium text-gray-600 dark:text-white">Hi {{ profileName }}!</h5>
              <span class="text-sm text-center text-gray-500 dark:text-gray-400">Start by adding first category and Bookmark<br>Happy bookmarking!</span>
          </div>
        </div>
      </div>
      
      <!-- Description bottom  -->
      <div v-if="bookmarkDescription" class="samo-testiram dark:text-gray-400 pt-2 text-md">
        <div class="inline-block">
          <span class="block text-white">{{ bookmarkDescription }}</span>
          <span block="block dark:text-gray-200">{{ bookmarkUrl }}</span>
        </div>
      
      <button @click="dismissDescription" type="button" class="ml-10 -mx-4.5 absolute rigt mt-2 -my-1.5 bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex h-7 w-7 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-600 dark:hover:text-white" data-dismiss-target="#alert-5" aria-label="Close">
        <span class="sr-only">Dismiss</span>
        <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
      </div>

    </div>
  </div>
</template>
<script>
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    // Disables dark mode by removing the class
    // document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('dark');
}
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import BookmarkCard from "./components/BookmarkCard";
import ProfilesSelection from "./components/ProfilesSelection";
import AddCategory from "./components/AddCategory";
import AddBookmark from "./components/AddBookmark";
import EditBookmark from "./components/EditBookmark";
import EditCategory from "./components/EditCategory";
import EditProfile from "./components/EditProfile";
import Sidebar from "./components/Sidebar";
import ProfileAddNew from './components/ProfileAddNew.vue';
import Draggable from 'vuedraggable'
import { globalCookiesConfig } from "vue3-cookies";
import { useCookies } from "vue3-cookies";
import { ref } from 'vue';
import { defineComponent } from 'vue'
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

globalCookiesConfig({
  expireTimes: "30d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});

const categoriesRefreshKey  = ref(0);
const addCategoryModal      = ref(0);
const addBookmarModal       = ref(0);
const editBookmarkModal     = ref(0);
const editCategoryModal     = ref(0);
const editProfileModal      = ref(0);
const bookmarkCardRefMain   = ref(0);
const bookmarkCardRef       = ref(0);
const showProfilesModal     = ref(0);
const ProfileAddNewModal    = ref(0);
const sidebarRef            = ref(0);

var sortedItem = null;
const serverport = process.env.VUE_APP_SERVER_PORT || (window.location.port !== '' ? window.location.port : 80);
const api_server = process.env.VUE_APP_SERVER_HOST || window.location.href;
const endpoint = api_server + (serverport == 80 ? '/' : ':' + serverport);

export default {
  name: "App",
  components: {
    Draggable,
    AddCategory,
    AddBookmark,
    EditBookmark,
    EditCategory,
    BookmarkCard,
    Sidebar,
    ProfilesSelection,
    ProfileAddNew,
    EditProfile
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {    
    return {
      agregated: [],
      bookmarksData: [],
      categoriesRefreshKey: 0,
      loading: true,
      showWelcome: false,
      profileAvatar: "",
      profileName: "",
      bookmarkDescription: '',
      bookmarkUrl: '',
    }
  },
  methods: {
    async getCategories(){
      this.loading = true;
      // Fetch categories only
      var profile_id = await this.getActiveUserProfile();
      var data = {category_owner: profile_id.id ? profile_id.id : null};
      
      if(data.category_owner != null){
        const cats = await fetch(endpoint + 'categories', {
          method: 'POST',
            headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if(resp.length > 0 && resp != null && resp.status != "error"){
              this.loading = false;              
              return resp;
            } else {
              this.loading = true;
              return [];
            }
        }).catch(error => {
            this.createNotification('danger', 'Loading categories error','Can not load dategories');         
        })
        return cats;

      } else {
        this.loading = false;
        return [];
      }

    },
    async getAgregatedData(){
      this.loading = true;
      // Fetch agregated dashboard data
      var profile_id = await this.getActiveUserProfile();
      var data = {category_owner: profile_id.id ? profile_id.id : null, bookmark_owner: profile_id.id ? profile_id.id : null};
      
      if(data.category_owner != null){
        const agregated = await fetch(endpoint + 'agregated', {
          method: 'POST',
            headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if(resp.length > 0 && resp != null && resp.status != "error"){
              this.loading = false;
              this.agregated = resp;
              this.methodThatForcesUpdate();   
            } else {
              // this.showWelcome = true;
              this.loading = true;
              this.createNotification('info', 'Loading error','Can not load Dashboard data');
            }
            // if tehre is only Uncategorized category and no bookmarks, hide welcome message
            if(resp.length == 1){
              if(resp[0].bookmarks.length == 0){
                this.showWelcome = true;
              } else {
                this.showWelcome = false;
              }
            } else {
              this.showWelcome = false;
            }
        }).catch(error => {
            this.createNotification('danger', 'Loading error','Can not load Dashboard data');           
        })
      } else {
        this.showWelcome = true;
        this.loading = false;
        // this.createNotification('warning', 'Select profile first','Plese select profile first');           
      }
    },
    async getActiveUserProfile(){
      var profileret = await localStorage.getItem("UserProfile");
      var profile = JSON.parse(profileret);
      if(profile?.name){
        this.profileAvatar = profile.avatar;
        this.profileName = profile.name;
        return {id: profile.id, name: profile.name, avatar: profile.avatar};
      } else {
        return {};
      }
    },
    methodThatForcesUpdate() {
      this.$forceUpdate();  // Notice we have to use a $ here
      // this.categoriesRefreshKey += 1;
    },
    editCategory(id, name, order){
      this.$refs.editCategoryModal.editCategory(id, name, order);
    },
    addBookmark(id, name){
      this.$refs.addBookmarModal.enterNewBookmark(id, name);
    },
    addCategory(){
      this.$refs.addCategoryModal.addNewCategory();
    },
    editBookmarkParent(data){
      this.$refs.editBookmarkModal.enterEditBookmark(data);
    },
    dragStart(){
      //  FixMe:  Replace this with better method
      this.showOrdering();
      // this.$refs.bookmarkCardRef.showOrderingOverlay(true);
    },
    dragEnded(evt, originalEvent){
      // Set target category
      sortedItem.element.bookmark_category = evt.to.dataset.category;
      this.$refs.editBookmarkModal.saveBookmarkOrderedChanges(sortedItem);

      //  FixMe:  Replace this with better method
      this.hideOrdering();
      // Then call to refresh the dashboard list
      this.getAgregatedData();
    },
    showOrdering(){
      const bookmarks = document.querySelectorAll('.order-number');
      bookmarks.forEach(bookmark => {
        bookmark.style.display = 'block';
      });
    },
    hideOrdering(){
      const bookmarks = document.querySelectorAll('.order-number');
      bookmarks.forEach(bookmark => {
        bookmark.style.display = 'none';
      });
    },
    checkMove(evt, originalEvent){
      sortedItem = evt.draggedContext;
      sortedItem.element.bookmark_order = evt.draggedContext.futureIndex;
      return true;
    },
    async exportBookmarks(){
      this.loading = true;
      // Fetch agregated dashboard data
      var profile_id = await this.getActiveUserProfile();
      var data = {category_owner: profile_id.id ? profile_id.id : null, bookmark_owner: profile_id.id ? profile_id.id : null};
      
      if(data.category_owner != null){
        const agregated = await fetch(endpoint + 'agregated', {
          method: 'POST',
            headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(resp => {
            if(resp.length > 0 && resp != null && resp.status != "error"){
              this.loading = false;
              var dataURI = "data:text/plain;base64," + encodeBase64(JSON.stringify(resp));
              saveAs(dataURI, "Bookmarks_" + profile_id.id + ".json");
            } else {
              this.loading = true;
            }            
        }).catch(error => {
            this.createNotification('danger', 'Export not available','Could not generate export file');           
        })
      }
    },
    async hadleProfileSelection(){
      var profile_cookie = await this.getActiveUserProfile();
      console.log("> Reading saved Profile in cookie: ", profile_cookie)
      if(profile_cookie?.name){
      } else {
        // Show modal with profiles...
       this.$refs.profilesSelectionModal.showProfilesModal();
      }
    },
    setuserProfile(user){
      localStorage.setItem('UserProfile',JSON.stringify(user));
      this.$refs.sidebarRef.loadProfileAvatar();
      this.getAgregatedData();
      // JSON support in cookie
      // var user = { id:1, name:'Journal',session:'25j_7Sl6xDq2Kc3ym0fmrSSk2xV2XkUkX' };
      // this.$cookies.set('user',user);
      // console.log(this.$cookies.get('user').name)
    },
    unsetUserProfile(){
      // this.cookies.remove("UserProfile");
      localStorage.removeItem("UserProfile");
      this.agregated = [];
      this.hadleProfileSelection();
    },
    profileOptions(){
      this.$refs.editProfileModal.EditActiveProfile();
    },
    addNewProfile(){
      this.$refs.profileAddNewModal.addNewProfile();
    },
    showDescription(desc, url) {
      this.bookmarkDescription = desc;
      this.bookmarkUrl = url;
    },
    dismissDescription() {
      this.bookmarkDescription = '';
    },
    createNotification(type, title, message) {
      var color = '';
      if(type == 'success'){
        color = '#1f2937';
      } else if(type == 'danger'){
        color = '#EF4444';
      } else if(type == 'warning'){
        color = '#F59E0B';
      } else if(type == 'info'){
        color = '#3B82F6';
      } else {
        color = '#1f2937';
      }
      createToast({
        title: title, 
        description: message
      },{
        type: type, // 'info', 'danger', 'warning', 'success', 'default'
        timeout: 8000,
        showCloseButton: true,
        position: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
        transition: 'bounce',
        hideProgressBar: false,
        swipeClose: true,
        toastBackgroundColor: color,
        onClose: null
      })
    },
  },
  props: {
    category: {
      type: Object,
      default: () => ({})
    }
  },
 mounted() {
 
    this.hadleProfileSelection();
    this.getAgregatedData();
  },
}
</script>

<style lang="scss">

html {
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
.moving-card {
  @apply opacity-50 bg-gray-100 border border-blue-500;
}
.bookmarks-list {
  flex-direction: column;
  flex-wrap: wrap;
  column-count: 6;
}

.home-wrapper {
  max-width: 1700px;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 1840px) {
  .home-wrapper {
    margin-left: 60px;
    margin-right: 0;
  }
}
  

.header {
  width: calc(100% - 23px);
  border-bottom: 1px solid #4a5568;
  margin-left: 25px;
  min-height: 100px;
}
.header .spacer {
  height: 10px;
  display: block;
}

.btn {
  @apply bg-blue-500 text-white font-bold py-1 px-2 rounded;
}

.reflect-action-button  {
  margin-top: -2px;
  margin-bottom: 5px;
  height: 24px;
  padding-top: 3px;
  padding-bottom: 20px;
  position: relative;
}

.action-buttons {
  display: inline-block;
  opacity: 0;
  position: absolute;
  padding-top: 11px;
  margin-top: -9px !important;
  transition: all .3s ease-in-out;
}

.header:hover .action-buttons {
  display: inline-block;
  margin-top: -12px !important;
  opacity: 1;
}

#app {
  background-color: #1e283a;
}
.single-bookmark {
  background-color: #293344;
}
.loading-bar {
  font-weight: 600;
  text-align: center;
  display: block;
  color: #4a5568;
  background-color: #171f2d;
  padding: 5px;
  position: fixed;
  z-index: 999999;
}
.dots-loading {
  width: 75px;
  text-align: left;
}
.dots-loading::after {
    display: inline-block;
    animation: dotty steps(1,end) 1s infinite;
    content: '';
}
    
@keyframes dotty {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
}

.welcome-modal {
  background-color: #212a395d;
  background-color: transparent;
}
</style>

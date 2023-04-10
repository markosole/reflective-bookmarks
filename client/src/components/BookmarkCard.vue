<template>
  <li class="p-2 mb-3 m-1.5 flex items-center bg-gray-900 shadow rounded-lg single-bookmark hover:bg-green-500">
      <div class="items-center">
            <p class="flex absolute items-center text-sm dark:text-white text-white info-button"><button @click="showDescription(bookmark)" data-popover-target="popover-description" data-popover-placement="bottom-end" type="button"><svg class="w-4 h-4 ml-2 text-gray-400 hover:text-gray-100 dark:text-gray-100" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg><span class="sr-only">Show information</span></button></p>
            <button @click="editBookmarkParent(this.bookmark);" type="button" class="bookmark-edit h-6 w-6 text-white bg-green-700 dark:hover:bg-green-800 font-medium rounded-lg text-sm text-center dark:bg-green-600 dark:hover:bg-gray-600">
            <svg class="w-4 h-4 dark:text-white m-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          <span v-if="isOrdering" class="absolute text-white font-small text-sm order-number">{{ bookmark.bookmark_order}}</span>
          <div class="w-10 h-10 rounded-full mt-2 bg-gray-900 circle-placeholder" :style="'background-color: #' + bookmark.id.substring(5,8)" v-if="!bookmark.bookmark_image">{{ bookmark.bookmark_name.charAt(0) + bookmark.bookmark_name.charAt(3)}}</div>
          <img class="w-10 h-10 rounded-full mt-2" v-if="bookmark.bookmark_image" :src="bookmark.bookmark_image" :title="bookmark.bookmark_alias">
          <a :href="bookmark.bookmark_url" :title="bookmark.bookmark_url" :data-category="bookmark.bookmark_category" :data-order="bookmark.bookmark_order" class="ml-2 font-sans tracking-wide text-white bookmark-name">{{bookmark.bookmark_name}}</a>
      </div>
  </li> 
</template>
<script>
import Avatar from "vue3-avatar";
export default {
  expose: ['showOrdering'],
  components: {
    Avatar,
  },
  data() {    
    return {
      isOrdering: true,
    }
  },
  props: {
    bookmark: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    showOrderingOverlay(param) {
      this.isOrdering = param;
    },
    editBookmarkParent(bookmark) {
      this.$parent.$parent.editBookmarkParent(bookmark);
    },
    showDescription(bookmark) {
      const bookmark_alias = bookmark.bookmark_alias ? bookmark.bookmark_alias : bookmark.bookmark_name + " | Description missing ";
      const bookmark_url = bookmark.bookmark_url;
      this.$parent.$parent.showDescription(bookmark_alias, bookmark_url)
    }
  }
}
</script>

<style lang="scss">
  
  .bookmark-name {
    text-align: center; 
    padding: 0;
    margin: 0;
    margin-top: -20px;
    margin-left: -8px;
    padding-top: 25px;
    font-size: 12px;
    line-height: 16px;
    height: 60px;
    display: inline-block;
    padding-left: 5px;
    padding-right: 2px;
    overflow: hidden;
    position: absolute;
    width: 125px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .bookmark-name:hover {
    // background-color: rgba(9, 89, 69, 0.565);
    // background gradient 
    // background: linear-gradient(0deg, rgba(13, 136, 95,0.3) 0%, rgba(13, 136, 95,0.3) 50%, rgba(13, 136, 95,0.3) 100%);
    // -webkit-backdrop-filter: saturate(50%) blur(8px);
    // backdrop-filter: saturate(50%) blur(8px);
    
  }
  .actions-btns {
    // padding-top: 10px;
    // margin-bottom: -15px;    
    outline: none;
    box-shadow: none;
  }
  .actions-btns button {
    width: 65px;
    text-align: center;
  }
  .actions-btns button:active 
  {
    background-color: rgba(244, 242, 242, 0.332);
  }
  .circle-icon {
    height: 15px;
  }
  .last-icon {
    margin-left: 5px;
  }

  .single-bookmark {
    display: inline-block;
    // width: 150px;
    // height: 110px;
    width: 125px;
    height: 100px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }
  .single-bookmark img {
    margin-left: auto;
    margin-right: auto;
  }

  .bookmark-edit {
    position: absolute;
    margin-left: 85px;
    display: none;
    margin-top: -7px;
  }
  .bookmark-edit svg {
    margin-top: 4px;
    margin-left: 4px;
  }

  .single-bookmark:hover .bookmark-edit, .single-bookmark:hover .info-button {
    display: block;
  }
  .circle-placeholder {
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    color: #fff;
    font-size: 20px;
    padding-top: 4px;
    // font-size: 26px;

    font-weight: 600;
    text-transform: uppercase !important;
  }
  .single-bookmark:hover .circle-placeholder {
    background-color: #015541;
  }

  .order-number {
    display: none;
    width: 125px;
    height: 100px;
    border-radius: 6px;
    margin-top: -16px;
    margin-left: -8px;
    margin-right: auto;
    text-align: center;
    color: #fff;
    font-size: 24px;
    color: rgba(255, 255, 255, 0.492);
    padding-top: 14px;
    // font-size: 26px;
    background-color: #111827;
    
  }
  .info-button {
    margin-top: -5px;
    margin-left: -5px;
    display: none
  }

  .samo-testiram {
    position: absolute;
    z-index: 4;
    background-color: #374151;
    width: 100%;
    height: 60px;
    border-radius: 6px;
    bottom: 0;
    left: 0;
    text-align: center;
  }

</style>

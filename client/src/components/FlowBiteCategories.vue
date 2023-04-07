<template>
    <dropdown clas="dark:bg-gray-600" text="Select category" placement="bottom">
      <list-group>
        <list-group-item>Item #1</list-group-item>
        <list-group-item>Item #2</list-group-item>
        <list-group-item>Item #3</list-group-item>
      </list-group>
    </dropdown>
  </template>
  <script setup>
  import { Dropdown, ListGroup, ListGroupItem } from 'flowbite-vue'
  </script>
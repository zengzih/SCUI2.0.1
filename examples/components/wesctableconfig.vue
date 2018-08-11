<template>
  <wesc-table-config :data="data"></wesc-table-config>
</template>

<script>
  import Json from '../../JsonData/tableconfig.json';
  export default {
    data() {
      return {
        data: Json.rows
      };
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style>

</style>
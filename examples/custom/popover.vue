<template>
  <div class="sc-popover">
    <div class="popper__arrow"></div>
  </div>
</template>

<style>
  .sc-popover {
    position: absolute;
    background: #fff;
    min-width: 150px;
    height: 50px;
    border-radius: 2px;
    border: 1px solid rgb(209, 211, 229);
    padding: 10px;
    z-index: 2000;
    font-size: 12px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
    display: none;
    .popper__arrow {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      left: 103.5px;
      top: -6px;
      margin-right: 3px;
      border-top-width: 0;
      border-bottom-color: rgb(209, 211, 229);
      border-color: transparent;
      border-style: solid;
      border-width: 6px;
      &::after {
         content: " ";
         position: absolute;
         display: block;
         width: 0;
         height: 0;
         border-color: transparent;
         border-style: solid;
         top: 1px;
         margin-left: -6px;
         border-top-width: 0;
         border-bottom-color: #fff;
      }
    }
  }
</style>

<script>
  export default {
    data() {
      return {};
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
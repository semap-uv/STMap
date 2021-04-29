<template>
  <div id="app">
    <MapView />
  </div>
</template>

<script>
import MapView from "./components/MapView.vue";

export default {
  name: "App",
  components: {
    MapView,
  },
};
</script>

<style>
.leaflet-control.leaflet-timeline-control {
  box-sizing: border-box;
  width: calc(100vw - 27px);
  margin-left: 5px;
  margin-bottom: 25px;
  border-radius: 0px;
  border: none;
  box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%);
}
.leaflet-left .leaflet-control {
    margin-left: 17px;
}
.leaflet-top .leaflet-control {
  margin-top: 60px;
}
</style>

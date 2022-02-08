<template>
  <div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: "App",
};
</script>

<style>
.leaflet-left .leaflet-control {
  margin-left: 17px;
}
.leaflet-top .leaflet-control {
  margin-top: 60px;
}
html {
  text-size-adjust: 100%;
}
.leaflet-overlay-pane svg {
  user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  -webkit-user-select: none !important;
}
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
  background-clip: padding-box !important;
  -webkit-background-clip: padding-box !important;
}
</style>

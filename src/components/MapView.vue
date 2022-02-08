<template>
  <v-app>
    <v-main>
      <v-overlay class="overlay-progress" :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <div class="map-overlay">
        <v-toolbar dense width="450" max-width="90vw">
          <v-text-field
            hide-details
            prepend-icon="mdi-magnify"
            single-line
            placeholder="Búsqueda"
            clearable
            type="text"
            v-model="searchText"
            @click:prepend="applyFilter"
            @click:clear="clearSearch"
            @keydown.enter.prevent="applyFilter"
          ></v-text-field>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on" style="padding-top: 20px; padding-left: 20px">
                <v-checkbox
                  v-model="deepSearch"
                  aria-label="Deep search"
                ></v-checkbox>
              </span>
            </template>
            <span>Búsqueda profunda</span>
          </v-tooltip>

          <!-- Descomentar cuando esté la busqueda avanzada 
            <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-dialog
              v-model="dialog"
              style="z-index: 99999"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="light" light v-bind="attrs" v-on="on">
                  {{ translate.busqueda }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ translate.busqueda }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field :label="translate.buscar"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :label="translate.material"> </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :label="translate.tecnica"> </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :label="translate.categoria"> </v-select>
                      </v-col>

                      <v-divider></v-divider>

                      <v-col cols="12" sm="6">
                        <v-select :label="translate.museo"> </v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select :label="translate.autor"> </v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    {{ translate.cerrar }}
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    {{ translate.aplicar }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-menu> -->
        </v-toolbar>
        <filter-menu
          :filter_change="onChangeFilter"
          :date_change="onChangeDate"
          :apply="applyFilter"
          :geoJSON="geoJSON"
          :categoryDictionary="categoryDictionary"
          :techniqueDictionary="techniqueDictionary"
          :materialDictionary="materialDictionary"
          :museumDictionary="museumDictionary"
          :countryDictionary="countryDictionary"
          :centuryDictionary="centuryDictionary"
          :timelineShow="timelineShow"
          ref="filterMenuComponent"
        />

        <v-card
          v-if="loadingObjectInfo"
          width="450"
          max-width="90vw"
          class="card-description"
        >
          <v-skeleton-loader
            type="image,table-heading,article,list-item-three-line"
          ></v-skeleton-loader
        ></v-card>
        <v-card
          v-if="selectedMarker"
          width="450"
          max-width="90vw"
          class="card-description"
        >
          <v-img
            height="300px"
            v-if="selectedImage && loadedImage"
            :src="selectedImage"
            @error="objectImageLoadError"
          >
          </v-img>
          <v-card-title> {{ selectedMarker.n }}</v-card-title>
          <v-card-text>
            <v-btn
              depressed
              color="primary"
              :href="selectedMarkerUri"
              target="_blank"
            >
              {{ translate.ceres }}
              <v-icon dark right> launch </v-icon>
            </v-btn>

            <v-dialog
              v-model="dialogNotification"
              style="z-index: 99999"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="red" v-bind="attrs" v-on="on" right>
                  <v-icon>mdi-alert</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Informar de errores</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <h4>
                          {{ selectedMarker.inventario }} |
                          {{ selectedMarker.n }}
                        </h4>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Nombre de Usuario"
                          v-model="notification.user"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-select
                          v-model="notification.type"
                          :items="errorTypes"
                          label="Categoría de error"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          name="input-7-1"
                          v-model="notification.description"
                          label="Descripción del error"
                          rows="6"
                          no-resize
                          value=""
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialogNotification = false"
                  >
                    {{ translate.cerrar }}
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="sendNotification">
                    Enviar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <div class="my-4 subtitle-2">
              <p class="text-justify">
                <v-icon left>museum</v-icon> {{ selectedMarker.nombreMuseo }}
              </p>
              <p class="text-justify" v-if="selectedMarker.autor">
                <v-icon left>person</v-icon>
                {{ selectedMarker.autor }}
              </p>
              <p class="text-justify" v-if="selectedMarker.procedencia">
                <v-icon left>place</v-icon> {{ selectedMarker.procedencia }}
              </p>
              <p
                class="text-justify"
                v-if="selectedMarker.s || selectedMarker.e"
              >
                <v-icon left>date_range</v-icon>
                {{ selectedMarker.s }} -
                {{ selectedMarker.e }}
              </p>
              <p class="text-justify" v-if="selectedMarkerCategories">
                <v-icon left>category</v-icon>
                {{ selectedMarkerCategories }}
              </p>

              <p class="text-justify" v-if="selectedMarkerTechniques">
                <v-icon left>mdi-hammer-screwdriver</v-icon>
                {{ selectedMarkerTechniques }}
              </p>
              <p class="text-justify" v-if="selectedMarkerMaterials">
                <v-icon left>mdi-flask</v-icon>
                {{ selectedMarkerMaterials }}
              </p>
            </div>

            <div v-if="selectedMarker.descripcion">
              <p class="text-justify">
                {{ selectedMarker.descripcion }}
              </p>
            </div>
          </v-card-text>
        </v-card>
        <div class="text-center" style="position:absolute z-index:9999"></div>
      </div>
      <div class="alert-overlay">
        <v-alert
          border="top"
          dismissible
          elevation="14"
          type="error"
          max-width="400px"
          class="text-center"
          :value="showAlert"
          v-model="showAlert"
        >
          {{ alertErrorMessage }}</v-alert
        >
      </div>

      <!-- SliderBar -->
      <div class="map-parent">
        <SideBar
          :layer_change="onChangeLayer"
          :map_set="onChangeMapLocal"
          :map_change="onChangeMap"
          :translate_change="onChangeTranslate"
          :sidebarShow="sidebarShow"
          :filter_change="onChangeFilter"
          :date_change="onChangeDate"
          :apply="applyFilter"
          :geoJSON="geoJSON"
          :show="show"
          ref="sideBarComponent"
        />

        <div id="mapid">
          <v-btn
            aria-label="Settings"
            style="z-index: 999; margin-top: 30px"
            color="indigo"
            fab
            dark
            absolute
            small
            top
            left
            @click="sidebarShow = !sidebarShow"
          >
            <v-icon v-if="!sidebarShow">settings</v-icon>
            <v-icon v-else>close</v-icon>
          </v-btn>
          <v-btn
            aria-label="Settings"
            style="z-index: 999"
            class="timeline-btn-toggle"
            color="primary"
            v-bind:class="{ active: timelineShow }"
            transition="scroll-y-transition"
            fab
            dark
            absolute
            small
            bottom
            left
            @click="toggleTimeline"
          >
            <v-icon v-if="!timelineShow">date_range</v-icon>
            <v-icon v-else>close</v-icon>
          </v-btn>
          <Timeline
            :centuryDictionary="centuryDictionary"
            :timelineShow="timelineShow"
            :apply="applyFilterTimeline"
            v-on:mousedown.stop
            v-on:mousemove.stop
            v-on:mouseclick.stop
            id="timeline-dom-element"
            ref="timelineComponent"
          />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import L from "leaflet";
require("leaflet/dist/leaflet.css");
require("@/assets/leaflet-providers");
import "leaflet.markercluster";
require("leaflet.markercluster/dist/MarkerCluster.css");
require("leaflet.markercluster/dist/MarkerCluster.Default.css");
import "leaflet.markercluster.layersupport";
//sidebar
import SideBar from "../components/SideBar.vue";
import FilterMenu from "../components/FilterMenu.vue";
import Timeline from "../components/Timeline.vue";
export default {
  name: "MapView",
  components: {
    SideBar,
    FilterMenu,
    Timeline,
  },
  props: {},
  data() {
    return {
      map: null,
      myTileLayer: null,
      selectedMarker: null,
      seasons: [134, 1500, 1600, 1800],

      translate: {},
      timelineShow: false,
      sidebarShow: false,
      map_local: null,
      filters: [],
      dateMin: null,
      dateMax: null,
      dateF: false,

      locationLayer: null,
      procedenceLayer: null,
      procedenceMarkerClusterGroup: null,
      locationMarkerClusterGroup: null,
      geoJSON: null,
      overlay: false,
      loadedImage: false,
      dialog: false,
      dialogNotification: false,
      materialDictionary: null,
      techniqueDictionary: null,
      categoryDictionary: null,
      museumDictionary: null,
      countryDictionary: null,
      centuryDictionary: null,
      searchText: "",
      selectedFilters: null,
      showAlert: false,
      alertErrorMessage: "",
      loadingObjectInfo: false,
      visualizationMode: "procedence",
      deepSearch: false,
      errorTypes: [
        "Ubicación",
        "Procedencia",
        "Identificación",
        "Datación",
        "Otro",
      ],
      notification: {
        id: null,
        user: null,
        type: "Ubicación",
        description: null,
      },
    };
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    next();
  },
  computed: {
    selectedImage: function () {
      if (this.selectedMarker) {
        var m = this.selectedMarker;
        if (m.acronimo && m.inventario)
          return (
            process.env.VUE_APP_API_ENDPOINT +
            "/imageThumbnail?acronimo=" +
            m.acronimo +
            "&inventario=" +
            m.inventario
          );
        else return "";
      } else return "";
    },
    selectedMarkerUri: function () {
      if (this.selectedMarker) {
        var m = this.selectedMarker;
        //if(m.acronimo && m.inventario && m.inventario)
        return (
          "http://ceres.mcu.es/pages/Main?idt=" +
          m.identificador +
          "&inventary=" +
          m.inventario +
          "&table=FMUS&museum=" +
          m.acronimo
        );
        //else return ""
      } else return "";
    },
    selectedMarkerMaterials: function () {
      var self = this;
      if (
        this.selectedMarker &&
        this.selectedMarker.m &&
        this.selectedMarker.m.length > 0
      ) {
        let materials = [];
        this.selectedMarker.m.forEach((mat) => {
          materials.push(
            self.materialDictionary.find((obj) => obj.id === mat).nombre
          );
        });
        return materials;
      } else return null;
    },
    selectedMarkerTechniques: function () {
      var self = this;
      if (
        this.selectedMarker &&
        this.selectedMarker.t &&
        this.selectedMarker.t.length > 0
      ) {
        let techniques = [];
        this.selectedMarker.t.forEach((t) => {
          techniques.push(
            self.techniqueDictionary.find((obj) => obj.id === t).nombre
          );
        });
        return techniques;
      } else return null;
    },
    selectedMarkerCategories: function () {
      var self = this;
      if (
        this.selectedMarker &&
        this.selectedMarker.c &&
        this.selectedMarker.c.length > 0
      ) {
        let categories = [];
        this.selectedMarker.c.forEach((c) => {
          categories.push(
            self.categoryDictionary.find((obj) => obj.id === c).nombre
          );
        });
        return categories;
      } else return null;
    },
  },
  created() {
    //this.overlay = true;
    this.loadFilters();
    this.fetchData();

    //this.overlay = false;
  },
  mounted() {
    //Init Map
    this.map = L.map("mapid", {
      minZoom: 2,
      maxZoom: 17,

      maxBounds: [
        //south west
        [90, 180],
        //north east
        [-90, -180],
      ],
    }).setView([45.46, 20], 4);

    //Local-storage
    switch (this.map_local) {
      case "Normal":
        this.myTileLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data &copy; <a href="http://..org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 17,
          }
        );
        break;
      case "Topographic":
        this.myTileLayer = L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 17,
            attribution:
              'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          }
        );
        break;
      case "Dark":
        this.myTileLayer = L.tileLayer(
          "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=602fd506-6378-488f-8825-7bffa40767ad",
          {
            maxZoom: 17,
            attribution:
              '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          }
        );
        break;
      default:
        break;
    }

    this.myTileLayer.addTo(this.map);
    //L.tileLayer.provider("Esri.WorldStreetMap").addTo(this.map);

    //this.locationLayer = L.layerGroup();
    this.procedenceLayer = L.layerGroup();
    this.loadInfo();
  },
  methods: {
    loadFilters: function () {
      var self = this;
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/tipologia/")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.categoryDictionary = json;
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/material/")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.materialDictionary = json;
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/tecnica/")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.techniqueDictionary = json;
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/museo/")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.museumDictionary = json;
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/country/")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.countryDictionary = json;
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/tiempo/")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.centuryDictionary = json;
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
    },
    objectImageLoadError: function () {
      console.log("error Loading Img");
      this.loadedImage = false;
    },
    show: function () {
      this.sidebarShow = true;
    },
    loadInfo: function () {
      this.$refs.sideBarComponent.loadInfo();
    },
    loadObjectInfo: function (id) {
      var self = this;
      self.selectedMarker = null;
      self.loadingObjectInfo = true;
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/?id=" + id)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.loadingObjectInfo = false;
          self.selectedMarker = {};
          self.selectedMarker.u = id;
          if (json.procedencia)
            self.selectedMarker["procedencia"] = json.procedencia;
          if (json.nombreMuseo)
            self.selectedMarker["nombreMuseo"] = json.nombreMuseo;
          if (json.acronimo) self.selectedMarker["acronimo"] = json.acronimo;
          if (json.descripcion)
            self.selectedMarker["descripcion"] = json.descripcion;
          if (json.inventario)
            self.selectedMarker["inventario"] = json.inventario;
          if (json.identificador)
            self.selectedMarker["identificador"] = json.identificador;
          if (json.n) self.selectedMarker["n"] = json.n;
          if (json.s) self.selectedMarker["s"] = json.s;
          if (json.e) self.selectedMarker["e"] = json.e;
          if (json.autor) self.selectedMarker["autor"] = json.autor;
          if (json.m) self.selectedMarker["m"] = json.m.split(",").map(Number);
          if (json.t) self.selectedMarker["t"] = json.t.split(",").map(Number);
          if (json.c) self.selectedMarker["c"] = json.c.split(",").map(Number);

          var copy = Object.assign({}, self.selectedMarker);
          self.selectedMarker = copy;
        })
        .catch(function (error) {
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
          self.alertErrorMessage = "Error al cargar detalles del objeto";
          self.selectedMarker = null;
          self.showAlert = true;
        });
    },
    fetchData: function () {
      var self = this;
      fetch(process.env.VUE_APP_API_ENDPOINT + "/objects/json/")
        //fetch("https://www.uv.es/semap//semap5.min.geojson")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.overlay = true;
          self.loadGeoJSON(json);
        })
        .catch(function (error) {
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
          self.alertErrorMessage =
            "Error al cargar datos desde la Base de datos";
          self.showAlert = true;
          self.overlay = false;
        });
    },
    async loadGeoJSON(json) {
      var self = this;
      var addToMap = false;
      /* CLUSTERING */
      if (!this.procedenceMarkerClusterGroup) {
        var mcgOptions = {
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true,
          maxClusterRadius: 120,
          chunkedLoading: true,
          chunkInterval: 50,
          chunkProgress: updateProgressBar,
        };
        this.procedenceMarkerClusterGroup = L.markerClusterGroup(mcgOptions);
        this.procedenceMarkerClusterGroup.on("clusterclick", function (a) {
          if (self.map.getZoom() >= self.map.options.maxZoom) {
            if (a.layer._childCount <= 30) {
              a.layer.spiderfy();
            } else if (a.layer._childCount <= 300) {
              self
                .postData(
                  process.env.VUE_APP_API_ENDPOINT + "/objects/gallery",
                  a.layer.getAllChildMarkers().map((o) => o.features.u)
                )
                .then((data) => {
                  window.sessionStorage.setItem("galleryData", JSON.stringify(data));
                  self.$router.push({
                    name: "Gallery"
                  });
                })
                .catch(function (error) {
                  self.alertErrorMessage = "Error de base de datos";
                  self.showAlert = true;
                });
            } else {
              self.alertErrorMessage = "Cluster demasiado grande";
              self.showAlert = true;
            }
          }
        });
        this.map.on(
          "click",
          function (e) {
            this.selectedMarker = null;
          },
          this
        );
        addToMap = true;
      }
      var customIcon = self.generateIcon(0);
      // Load GEOJSON information and apply conditional styles
      /*var geoJSONLayer = L.geoJSON(this.geoJSON, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: customIcon });
        },
        onEachFeature: this.onEachFeature,
      });*/

      var initClustering = false;
      function updateProgressBar(processed, total, elapsed, layersArray) {
        if (total == 0) {
          console.log("total = 0 to cluster");
          self.overlay = false;
          initClustering = false;
          return;
        }
        console.log("clustering " + processed + " of " + total);
        if (!initClustering && total > 0) {
          console.log("init clustering");
          self.overlay = true;
          initClustering = true;
        }
        //console.log("Processed " + processed + " markers of " + total);
        if (initClustering && processed === total) {
          self.overlay = false;
          initClustering = false;
          console.log("Finished clustering in " + elapsed * 0.001 + "s");
        }
      }
      // Generación de Clusters de marcadores a partir de las capas

      /*
      //PRUEBA PABLO
      //var markerGroupLocation = L.markerClusterGroup.layerSupport(mcgOptions);
      this.procedenceMarkerClusterGroup =
        L.markerClusterGroup.layerSupport(mcgOptions);

      //markerGroupLocation.addTo(this.map);
      //markerGroupLocation.checkIn(this.locationLayer);
      this.procedenceMarkerClusterGroup.addTo(this.map);
      this.procedenceMarkerClusterGroup.checkIn(this.procedenceLayer);

      this.procedenceLayer.addTo(this.map);
      */

      start = window.performance.now();
      if (addToMap) this.map.addLayer(this.procedenceMarkerClusterGroup);
      end = window.performance.now();
      console.log(`Execution add group to map: ${end - start} ms`);
      var markerList = [];

      //console.log('start creating markers: ' + window.performance.now());
      function markerOnClick(e) {
        var marker = e.target;
        self.loadedImage = true;
        self.loadObjectInfo(e.target.features.u);
      }
      var start = window.performance.now();
      for (var i = 0; i < json.length; i++) {
        var a = json[i];

        var marker = L.marker(L.latLng(a.lt, a.lg), {
          icon: customIcon,
        });
        marker.on("click", markerOnClick);
        marker.features = { u: a.u };
        markerList.push(marker);
      }
      var end = window.performance.now();
      console.log(`Execution time Marker Creation: ${end - start} ms`);

      /*
		for (var i = 0; i < addressPoints2.length; i++) {
			var a = addressPoints2[i];
			var title = a[2];
			var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
			marker.bindPopup(title);
			markerList.push(marker);
		}*/

      start = window.performance.now();
      this.procedenceMarkerClusterGroup.addLayers(markerList);
      markerList = null;
      end = window.performance.now();
      console.log(`Execution time Add Layers to group: ${end - start} ms`);

      /* CLUSTERING */
    },
    loadGeoJSONMuseums: function (json) {
      var self = this;
      var addToMap = false;
      /* CLUSTERING */
      if (!this.locationMarkerClusterGroup) {
        var mcgOptions = {
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true,
          maxClusterRadius: 120,
          chunkedLoading: true,
          chunkInterval: 150,
          chunkProgress: updateProgressBar,
          iconCreateFunction: function (cluster) {
            var children = cluster.getAllChildMarkers();
            var childCount = 0;
            for (var i = 0; i < children.length; i++) {
              childCount += children[i].numObjects;
            }
            var c = " marker-cluster-";
            if (childCount < 10) {
              c += "small";
            } else if (childCount < 100) {
              c += "medium";
            } else {
              c += "large";
            }

            return new L.DivIcon({
              html: "<div><span>" + childCount + "</span></div>",
              className: "marker-cluster" + c,
              iconSize: new L.Point(40, 40),
            });
          },
        };
        this.locationMarkerClusterGroup = L.markerClusterGroup(mcgOptions);
        addToMap = true;
        this.geoJSON = json;
      } else {
        this.geoJSON = json;
      }

      var initClustering = false;
      function updateProgressBar(processed, total, elapsed, layersArray) {
        if (total == 0) {
          console.log("total = 0 to cluster");
          self.overlay = false;
          initClustering = false;
          return;
        }
        if (!initClustering && total > 0) {
          console.log("init clustering");
          self.overlay = true;
          initClustering = true;
        }
        //console.log("Processed " + processed + " markers of " + total);
        if (initClustering && processed === total) {
          self.overlay = false;
          initClustering = false;
          console.log("Finished clustering in " + elapsed * 0.001 + "s");
        }
      }
      var markerList = [];

      function markerOnClick(e) {
        var marker = e.target;
        self.loadedImage = true;
        self.loadObjectInfo(e.target.features.u);
      }

      for (var i = 0; i < this.geoJSON.length; i++) {
        var a = this.geoJSON[i];

        var marker = L.marker(L.latLng(a.lt, a.lg), {
          icon: self.generateIcon(1, a.num),
        });
        marker.numObjects = a.num;
        var objmuseo = self.museumDictionary.find((obj) => {
          return obj.idmuseo === a.u;
        });
        marker.bindTooltip("" + objmuseo.museo, {
          direction: "top",
          offset: [0, -40],
        });
        //marker.on("click", markerOnClick);
        //marker.features = { u: a.u };
        markerList.push(marker);
      }

      if (addToMap) this.map.addLayer(this.locationMarkerClusterGroup);
      this.locationMarkerClusterGroup.addLayers(markerList);

      /* CLUSTERING */
    },

    onChangeLan: function (datos) {
      this.translate = datos;
    },

    onChangeMapLocal: function (datos) {
      this.map_local = datos;
    },

    onEachFeature: function (feature, layer) {
      var self = this;
      layer.on("click", function (e) {
        if (feature.properties) {
          self.selectedMarker = feature.properties;
          self.loadedImage = true;
          self.loadObjectInfo();
        }
      });
      self.procedenceLayer.addLayer(layer);
    },

    generateIcon: function (markerColor = 0, label = "") {
      var x = markerColor == 0 ? "#004777e0" : "#6D213Ce0";
      const markerHtmlStyles = `
        background-color: ${x};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;
      const labelMarkerStyle = `
        color:white;
        transform: rotate(-45deg);
        width: 2rem;
        height: 2rem;
        text-align: center;
        font-size: 0.75rem;
        padding-top: 5px;
        font-weight: bold;
        `;
      const iconCategoryStyle = `
        color:white;
        transform: rotate(-45deg);
        width: 2rem;
        height: 2rem;
        text-align: center;
        font-size: 1.1rem;
        padding-top: 5px;
        font-weight: bold;
        `;

      const customIconLabel = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [-8, 16],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}"><p style="${labelMarkerStyle}">${label}</p></span>`,
      });
      const customIconCategory = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [-8, 16],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}"></span>`,
      });
      return label != "" ? customIconLabel : customIconCategory;
    },

    updateValue(value) {
      console.log(value);
    },
    onChangeLayer(value) {
      this.visualizationMode = value;
      this.applyFilter();
    },
    onChangeMap() {
      this.map.removeLayer(this.myTileLayer);
      switch (this.map_local) {
        case "Normal":
          this.myTileLayer = L.tileLayer(
            "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                'Map data &copy; <a href="http://..org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
              maxZoom: 18,
            }
          );
          break;
        case "Topographic":
          this.myTileLayer = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 17,
              attribution:
                'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            }
          );
          break;
        case "Dark":
          this.myTileLayer = L.tileLayer(
            "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=602fd506-6378-488f-8825-7bffa40767ad",
            {
              maxZoom: 20,
              attribution:
                '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            }
          );
          break;
        default:
          break;
      }
      this.myTileLayer.addTo(this.map);
    },

    onChangeTranslate(datos) {
      this.translate = datos;
      //this.$refs.filterMenuComponent.onChangeTranslate(datos);
    },

    onChangeFilter(datos) {
      this.filters = datos;
    },

    onChangeDate(datos1, datos2, datos3) {
      this.dateMin = datos1;
      this.dateMax = datos2;
      this.dateF = datos3;
    },
    clearSearch() {
      this.searchText = "";
      this.applyFilter();
    },
    applyFilterTimeline(selectedTime) {
      if (this.selectedFilters == null) {
        this.selectedFilters = {};
      }
      this.selectedFilters.time = [selectedTime];
      this.applyFilter();
    },
    applyFilter(selectedFilters) {
      this.selectedMarker = null;
      if (
        typeof selectedFilters != "undefined" &&
        typeof selectedFilters.material != "undefined"
      )
        this.selectedFilters = selectedFilters;

      var self = this;

      var urlParams = "";
      if (this.selectedFilters) {
        urlParams = Object.entries(this.selectedFilters)
          .flatMap((pair) =>
            pair[1].length == 0 ? [] : pair.map(encodeURIComponent).join("=")
          )
          .join("&");
      }
      if (this.searchText != "" && this.searchText != null) {
        var searchType = this.deepSearch ? "&searchType=1" : "&searchType=2";
        if (urlParams != "")
          urlParams = urlParams.concat("&text=" + this.searchText + searchType);
        else
          urlParams = urlParams.concat("text=" + this.searchText + searchType);
      }

      var visualizationEndpoint =
        this.visualizationMode == "procedence"
          ? "/objects/search/?"
          : "/museums/search/?";
      //this.$router.push("?"+urlParams)
      fetch(
        process.env.VUE_APP_API_ENDPOINT + visualizationEndpoint + urlParams
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          //debugger;
          this.overlay = true;
          this.procedenceMarkerClusterGroup.clearLayers();
          if (this.locationMarkerClusterGroup)
            this.locationMarkerClusterGroup.clearLayers();
          this.visualizationMode == "procedence"
            ? this.loadGeoJSON(json)
            : this.loadGeoJSONMuseums(json);
        })
        .catch(function (error) {
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
          self.alertErrorMessage = "Error de búsqueda";
          self.showAlert = true;
        });
    },
    toggleTimeline() {
      var msPointer = !window.PointerEvent && window.MSPointerEvent;
      var POINTER_DOWN = msPointer ? "MSPointerDown" : "pointerdown";
      this.timelineShow = !this.timelineShow;
      if (!this.timelineShow) {
        if (this.selectedFilters == null) {
          this.selectedFilters = {};
        }
        this.selectedFilters.time = [];
        this.applyFilter();
        document
          .getElementById("timeline-dom-element")
          .removeEventListener(POINTER_DOWN, this.handlerPointerDown);
      } else {
        document
          .getElementById("timeline-dom-element")
          .addEventListener(POINTER_DOWN, this.handlerPointerDown);
      }
    },
    handlerPointerDown(event) {
      event.stopPropagation();
    },
    sendNotification() {
      var self = this;
      this.notification.id = this.selectedMarker.u;
      this.postData(
        process.env.VUE_APP_API_ENDPOINT + "/objects/error",
        this.notification
      )
        .then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
          self.dialogNotification = false;
          self.notification = {
            id: null,
            user: null,
            type: "Ubicación",
            description: null,
          };
        })
        .catch(function (error) {
          self.alertErrorMessage = "Error de base de datos";
          self.showAlert = true;
        });
    },
    async postData(url = "", data = {}) {
      // Opciones por defecto estan marcadas con un *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-parent {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
}
#mapid {
  flex: 1;
}
.map-overlay {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 999;
  display: block;
}
.alert-overlay {
  position: absolute;
  top: 10px;
  z-index: 999;
  left: 0;
  right: 0;

  display: block;
}
.timeline-overlay {
}
.timeline-overlay > :first-child {
  margin-left: auto;
  margin-right: auto;
}
.alert-overlay > :first-child {
  margin-left: auto;
  margin-right: auto;
}
.card-description {
  max-height: 85vh;
  overflow-y: auto;
}
.overlay-progress {
  z-index: 99999 !important;
}
.timeline-btn-toggle {
  margin-bottom: 40px;
}
.timeline-btn-toggle.active {
  margin-bottom: 140px;
}
</style>

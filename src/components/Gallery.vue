<template>
  <v-app style="background-color: #3c3c3c">
    <v-main>
      <div id="container"></div>
      <div id="menu">
        <v-btn id="table" depressed color="secondary"> Tabla </v-btn>
        <v-btn id="sphere" depressed color="secondary"> Esfera </v-btn>
        <v-btn id="helix" depressed color="secondary"> Hélice </v-btn>
        <v-btn id="grid" depressed color="secondary"> Grid </v-btn>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import * as THREE from "three";
const TWEEN = require("@tweenjs/tween.js");
import { TrackballControls } from "three/examples/jsm/controls/experimental/CameraControls";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

//import ceresTable from "./table";
export default {
  name: "Gallery",
  data() {
    return {
      table: Array,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      objects: [],
      targets: { table: [], sphere: [], helix: [], grid: [] },
    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init: function () {
      this.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.z = 3000;

      // alert(table.length/5);
      this.scene = new THREE.Scene();

      // table

      let posX = 0;
      let maxX = 18;
      let posY = 0;
      this.table = JSON.parse(sessionStorage.getItem("galleryData"));
      for (let i = 0; i < this.table.length; i++) {
        const element = document.createElement("div");
        element.className = "element";
        /*element.style.backgroundColor =
          "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";*/
        element.style.backgroundColor = "#03A9F4";
        element.style.backgroundImage =
          "url('" +
          process.env.VUE_APP_API_ENDPOINT +
          "/imageGallery?imgUrl=" +
          encodeURIComponent(this.table[i].linkImage) +
          "')";

        //element.style.backgroundAttachment = "fixed";
        element.style.backgroundPosition = "top center";
        element.style.backgroundSize = "contain";
        element.style.backgroundRepeat = "no-repeat";

        element.backgroundOrigin = "border-box;";

        const details = document.createElement("div");
        details.className = "details";
        const anchor = document.createElement("a");
        anchor.setAttribute("href", this.table[i].link);
        anchor.setAttribute("target", "_blank");
        anchor.innerHTML = this.table[i].n;
        details.innerHTML = this.table[i].u + "<br>";
        
        details.appendChild(anchor);
        element.appendChild(details);
        anchor.addEventListener(
          "click",
          this.onObjectClicked.bind(null, this.table[i].link)
        );

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        this.scene.add(objectCSS);

        this.objects.push(objectCSS);

        //

        const object = new THREE.Object3D();
        object.position.x = posX * 140 - 1330;
        object.position.y = -(posY * 180) + 990;

        posX++;

        if (posX > maxX) {
          posX = 0;
          posY++;
        }

        this.targets.table.push(object);
      }

      // sphere

      const vector = new THREE.Vector3();

      for (let i = 0, l = this.objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;

        const object = new THREE.Object3D();

        object.position.setFromSphericalCoords(800, phi, theta);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        this.targets.sphere.push(object);
      }

      // helix

      for (let i = 0, l = this.objects.length; i < l; i++) {
        const theta = i * 0.175 + Math.PI;
        const y = -(i * 8) + 450;

        const object = new THREE.Object3D();

        object.position.setFromCylindricalCoords(900, theta, y);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        this.targets.helix.push(object);
      }

      // grid

      for (let i = 0; i < this.objects.length; i++) {
        const object = new THREE.Object3D();

        object.position.x = (i % 5) * 400 - 800;
        object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
        object.position.z = Math.floor(i / 25) * 1000 - 2000;

        this.targets.grid.push(object);
      }

      //

      this.renderer = new CSS3DRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document
        .getElementById("container")
        .appendChild(this.renderer.domElement);

      //

      this.controls = new TrackballControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.minDistance = 500;
      this.controls.maxDistance = 6000;
      this.controls.addEventListener("change", this.render);

      var self = this;
      const buttonTable = document.getElementById("table");
      buttonTable.addEventListener("click", function () {
        self.transform(self.targets.table, 2000);
      });

      const buttonSphere = document.getElementById("sphere");
      buttonSphere.addEventListener("click", function () {
        self.transform(self.targets.sphere, 2000);
      });

      const buttonHelix = document.getElementById("helix");
      buttonHelix.addEventListener("click", function () {
        self.transform(self.targets.helix, 2000);
      });

      const buttonGrid = document.getElementById("grid");
      buttonGrid.addEventListener("click", function () {
        self.transform(self.targets.grid, 2000);
      });

      this.transform(this.targets.table, 2000);

      //
      window.addEventListener("resize", this.onWindowResize);
    },

    transform: function (targets, duration) {
      TWEEN.removeAll();

      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        const target = targets[i];

        new TWEEN.Tween(object.position)
          .to(
            {
              x: target.position.x,
              y: target.position.y,
              z: target.position.z,
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to(
            {
              x: target.rotation.x,
              y: target.rotation.y,
              z: target.rotation.z,
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(this.render)
        .start();
    },
    mouseRaycast: function (event) {
      var vector = new THREE.Vector3();
      var raycaster = new THREE.Raycaster();
      var dir = new THREE.Vector3();

      if (this.camera instanceof THREE.OrthographicCamera) {
        vector.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          -1
        ); // z = - 1 important!

        vector.unproject(this.camera);

        dir.set(0, 0, -1).transformDirection(this.camera.matrixWorld);

        raycaster.set(vector, dir);
      } else if (this.camera instanceof THREE.PerspectiveCamera) {
        vector.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        ); // z = 0.5 important!

        vector.unproject(this.camera);

        raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
      }

      var intersects = raycaster.intersectObjects(this.objects, false);
      debugger;
      for (var i = 0; i < intersects.length; i++) {
        debugger;
      }
    },
    onObjectClicked: function (url) {
      window.open(url, "_blank");
    },
    onWindowResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.render();
    },

    animate: function () {
      requestAnimationFrame(this.animate);

      TWEEN.update();

      this.controls.update();
    },

    render: function () {
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>
<style>
body {
  margin: 0;
  background-color: #333333 !important;
  color: #fff;
  font-family: Monospace;
  font-size: 13px;
  line-height: 24px;
  overscroll-behavior: none;
}

a {
  color: #ff0;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
  text-transform: uppercase;
}
a {
  color: #8ff;
}

#menu {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}

.element {
  width: 120px;
  height: 160px;
  box-shadow: 0px 0px 12px #7c4dff;
  border: 1px solid rgba(127, 255, 255, 0.25);
  font-family: Helvetica, sans-serif;
  text-align: center;
  line-height: normal;
  cursor: default;
}

.element:hover {
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .number {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

.element .symbol {
  position: absolute;
  top: 40px;
  left: 0px;
  right: 0px;
  font-size: 60px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
}

.element .details {
  position: absolute;
  bottom: 15px;
  left: 0px;
  right: 0px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

/*button {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0px;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

button:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}*/

#info {
  position: absolute;
  top: 0px;
  width: 100%;
  padding: 10px;

  box-sizing: border-box;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
  z-index: 1; /* TODO Solve this in HTML */
}
</style>

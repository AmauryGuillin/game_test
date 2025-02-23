import { createMemoryHistory, createRouter } from "vue-router";
import Map2 from "./components/Map2.vue";
import Map3 from "./components/Map3.vue";
import Movement from "./components/Movement.vue";

const routes = [
  { path: "/", component: Movement },
  { path: "/map2/:positionX/:positionY", component: Map2 },
  { path: "/map3", component: Map3 },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export { router };

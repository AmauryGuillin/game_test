<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

let alreadyX = 0;
let alreadyY = 0;

if (route.params.positionX) {
  alreadyX = Number(route.params.positionX);
}

if (route.params.positionY) {
  alreadyY = Number(route.params.positionY);
}

const positionX = alreadyX !== 0 ? ref(alreadyX) : ref(window.innerWidth / 2);
const positionY = alreadyY !== 0 ? ref(alreadyY) : ref(window.innerHeight / 2);

function moveDot(input: KeyboardEvent) {
  if (input.key === "ArrowUp") {
    positionY.value -= 20;
  } else if (input.key === "ArrowDown") {
    positionY.value += 20;
  } else if (input.key === "ArrowLeft") {
    positionX.value -= 20;
  } else if (input.key === "ArrowRight") {
    positionX.value += 20;
  }

  if (positionX.value >= window.innerWidth - 100) {
    console.log("hors limites X droite");
    positionX.value = window.innerWidth - positionX.value;
    router.push(`/map3/${positionX.value}/${positionY.value}`);
  }

  if (positionX.value < 0) {
    console.log("hors limites X gauche");
    positionX.value = window.innerWidth - positionX.value - 200;
    router.push(`/map2/${positionX.value}/${positionY.value}`);
  }

  if (positionY.value >= window.innerHeight - 100) {
    console.log(window.innerHeight);
    console.log("hors limites Y inférieure");
  }

  if (positionY.value < 0) {
    console.log("hors limites Y supérieure");
  }
}

onMounted(() => {
  window.addEventListener("keydown", moveDot);
});

onUnmounted(() => {
  window.removeEventListener("keydown", moveDot);
});
</script>

<template>
  <section
    class="h-screen max-h-screen w-full max-w-full overflow-x-hidden bg-gray-900 relative"
  >
    <div class="text-white">Movement</div>
    <div
      id="character"
      class="h-40 w-40 absolute"
      :style="{ left: `${positionX}px`, top: `${positionY}px` }"
    >
      <img src="/character.gif" alt="player image" class="w-full" />
    </div>
  </section>
</template>

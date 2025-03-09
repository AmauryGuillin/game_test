<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
//import { useRoute, useRouter } from "vue-router";
import { useRoute } from "vue-router";

//const router = useRouter();
const route = useRoute();

const windowWidth = ref(window.innerWidth);
const windowWHeight = ref(window.innerHeight);

let alreadyX = 0;
let alreadyY = 0;

const character = ref<HTMLElement | null>(null);
const obstacles = ref<HTMLElement[]>([]);

if (route.params.positionX) {
  alreadyX = Number(route.params.positionX);
}

if (route.params.positionY) {
  alreadyY = Number(route.params.positionY);
}

const positionX = alreadyX !== 0 ? ref(alreadyX) : ref(575);
const positionY = alreadyY !== 0 ? ref(alreadyY) : ref(460);

const obstacleData = [
  { posX: 25.3, posY: 44, width: 50, height: 52 },
  { posX: 40, posY: 71, width: 230, height: 35 },
  { posX: 35, posY: 28.6, width: 250, height: 35 },
  { posX: 32.5, posY: 28.6, width: 35, height: 86 },
  { posX: 10, posY: 34, width: 260, height: 35 },
];

function checkCollision(newX: number, newY: number) {
  const player = character.value;

  if (!player) return false;

  const charRect = player.getBoundingClientRect();

  const nextCharRect = {
    left: charRect.left + (newX - positionX.value),
    right: charRect.right + (newX - positionX.value),
    top: charRect.top + (newY - positionY.value),
    bottom: charRect.bottom + (newY - positionY.value),
  };

  return obstacles.value.some((obstacle) => {
    const obsRect = obstacle.getBoundingClientRect();
    return !(
      nextCharRect.right < obsRect.left ||
      nextCharRect.left > obsRect.right ||
      nextCharRect.bottom < obsRect.top ||
      nextCharRect.top > obsRect.bottom
    );
  });
}

function moveDot(input: KeyboardEvent) {
  let newX = positionX.value;
  let newY = positionY.value;

  if (input.key === "ArrowUp") {
    newY -= 20;
    if (!checkCollision(newX, newY)) {
      positionY.value = newY;
    }
  } else if (input.key === "ArrowDown") {
    newY += 20;
    if (!checkCollision(newX, newY)) {
      positionY.value = newY;
    }
  } else if (input.key === "ArrowLeft") {
    newX -= 20;
    if (!checkCollision(newX, newY)) {
      positionX.value = newX;
    }
  } else if (input.key === "ArrowRight") {
    newX += 20;
    if (!checkCollision(newX, newY)) {
      positionX.value = newX;
    }
  }

  if (positionX.value >= 1150 - 100) {
    console.log("hors limites X droite");
    //positionX.value = 1150 - positionX.value;
    alert("Work in progress :)\nPlayer position is reset");
    positionX.value = 575;
    positionY.value = 460;
    //router.push(`/map3/${positionX.value}/${positionY.value}`);
  }

  if (positionX.value < 0) {
    console.log("hors limites X gauche");
    //positionX.value = 1150 - positionX.value - 200;
    alert("Work in progress :)\nPlayer position is reset");
    positionX.value = 575;
    positionY.value = 460;
    //router.push(`/map2/${positionX.value}/${positionY.value}`);
  }

  if (positionY.value >= 920 - 100) {
    console.log("hors limites Y inférieure");
    alert("Work in progress :)\nPlayer position is reset");
    positionX.value = 575;
    positionY.value = 460;
  }

  if (positionY.value < 0) {
    console.log("hors limites Y supérieure");
    alert("Work in progress :)\nPlayer position is reset");
    positionX.value = 575;
    positionY.value = 460;
  }
}

onMounted(() => {
  window.addEventListener("keydown", moveDot);
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
  obstacles.value = Array.from(document.querySelectorAll(".obstacle"));
});

onUnmounted(() => {
  window.removeEventListener("keydown", moveDot);
  window.removeEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});
</script>

<template>
  <section
    v-if="windowWidth >= 1150 || windowWHeight >= 920"
    class="bg-black min-h-screen flex flex-col justify-center items-center"
  >
    <section class="animate-pulse text-red-500 font-bold text-4xl my-4">
      WORK IN PROGRESS
    </section>
    <section
      class="h-[920px] w-[1150px] max-w-[1150px] mx-auto overflow-x-hidden relative bg-[url(/maps/route-101.png)] bg-no-repeat bg-cover bg-center rounded-3xl"
    >
      <div class="text-white">Movement</div>
      <div
        id="character"
        ref="character"
        class="h-20 w-20 absolute z-50 flex justify-center items-center"
        :style="{ left: `${positionX}px`, top: `${positionY}px` }"
      >
        <img src="/test-char.gif" alt="player image" class="w-20 h-20" />
      </div>
      <div
        v-for="(obs, index) in obstacleData"
        :key="index"
        class="absolute obstacle"
        :style="{
          left: `${obs.posX}%`,
          top: `${obs.posY}%`,
          width: `${obs.width}px`,
          height: `${obs.height}px`,
        }"
      ></div>
    </section>
  </section>
  <section v-else>écran pas assez grand !</section>
</template>

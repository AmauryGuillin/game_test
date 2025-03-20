<script setup lang="ts">
import { io } from "socket.io-client";
import { onMounted, onUnmounted, ref } from "vue";
//import { useRoute, useRouter } from "vue-router";
import { useRoute } from "vue-router";

//const router = useRouter();
const route = useRoute();
const socket = io("http://localhost:3000/");
//const socket = io("https://socket-test-production-cb2a.up.railway.app/");

const windowWidth = ref(window.innerWidth);
const windowWHeight = ref(window.innerHeight);

const isItboxesShown = ref(true);
const myPlayerId = ref(null);

let alreadyX = 0;
let alreadyY = 0;

const character = ref<HTMLElement | null>(null);
const otherPlayers = ref<HTMLElement[]>([]);
//const obstacles = ref<HTMLElement[]>([]);
//const battlezones = ref<HTMLElement[]>([]);
const isInBattleMode = ref<boolean>(false);
const transitionToBattle = ref<boolean>(false);
const canPlayerMove = ref<boolean>(true);

if (route.params.positionX) {
  alreadyX = Number(route.params.positionX);
}

if (route.params.positionY) {
  alreadyY = Number(route.params.positionY);
}

const positionX = alreadyX !== 0 ? ref(alreadyX) : ref(520);
const positionY = alreadyY !== 0 ? ref(alreadyY) : ref(460);

const messageDisplayed = ref(null);
const messagePlayerID = ref(null);

type playersData = {
  id: number;
  posX: number;
  posY: number;
};

const otherPlayersData = ref<playersData[]>([]);

const obstacleData = [
  { posX: 25.3, posY: 44, width: 50, height: 52 },
  { posX: 40, posY: 71, width: 230, height: 35 },
  { posX: 35, posY: 28.6, width: 250, height: 35 },
  { posX: 32.5, posY: 28.6, width: 35, height: 86 },
  { posX: 10, posY: 34, width: 260, height: 35 },
];

const battleZonesData = [{ posX: 55, posY: 50, width: 290, height: 180 }];

function connectToWebSocket(data: string) {
  socket.emit("message", data);
  socket.on("instanciatePlayer", (playersList: playersData[]) => {
    otherPlayersData.value = playersList;
  });
}

function sendPlayerPosition(posX: number, posY: number) {
  socket.emit("move", posX, posY);
  socket.on("updatePlayerPosition", (updatedPlayers) => {
    otherPlayersData.value = Object.values(updatedPlayers);
  });
}

function openSendMessageBox() {
  const message = prompt("What is your message?");
  console.log(message);
  if (message) {
    sendChatMessage(message);
  }
}

function sendChatMessage(message: string) {
  socket.emit("sendChatMessage", message, myPlayerId.value);
}

socket.on("receiveChatMessage", (message, id) => {
  messageDisplayed.value = message;
  messagePlayerID.value = id;
  setTimeout(() => {
    messageDisplayed.value = null;
    messagePlayerID.value = null;
  }, 3000);
});

function manageHitboxesDisplay() {
  if (isItboxesShown.value) {
    isItboxesShown.value = false;
  } else {
    isItboxesShown.value = true;
  }
}

function setBattleModeOff() {
  isInBattleMode.value = false;
  canPlayerMove.value = true;
}

function battleTest() {
  if (checkBattleZone(positionX.value, positionY.value)) {
    const randomNumber = Math.round(Math.random() * 100);
    if (randomNumber >= 95) {
      canPlayerMove.value = false;
      //alert("Un Pokémon sauvage apparaît !");
      transitionToBattle.value = true;
      setTimeout(() => {
        transitionToBattle.value = false;
        isInBattleMode.value = true;
      }, 800);
    }
  }
}

function checkBattleZone(newX: number, newY: number) {
  const playerWidth = 80;
  const playerHeight = 80;

  const nextCharRect = {
    left: newX,
    right: newX + playerWidth,
    top: newY,
    bottom: newY + playerHeight,
  };

  return battleZonesData.some((zone) => {
    const zoneLeft = (zone.posX / 100) * 1150;
    const zoneTop = (zone.posY / 100) * 920;
    const zoneRight = zoneLeft + zone.width;
    const zoneBottom = zoneTop + zone.height;

    return !(
      nextCharRect.right < zoneLeft ||
      nextCharRect.left > zoneRight ||
      nextCharRect.bottom < zoneTop ||
      nextCharRect.top > zoneBottom
    );
  });
}

function checkCollision(newX: number, newY: number) {
  const playerWidth = 80;
  const playerHeight = 80;

  const nextCharRect = {
    left: newX,
    right: newX + playerWidth,
    top: newY,
    bottom: newY + playerHeight,
  };

  return obstacleData.some((obs) => {
    const obsLeft = (obs.posX / 100) * 1150;
    const obsTop = (obs.posY / 100) * 920;
    const obsRight = obsLeft + obs.width;
    const obsBottom = obsTop + obs.height;

    return !(
      nextCharRect.right < obsLeft ||
      nextCharRect.left > obsRight ||
      nextCharRect.bottom < obsTop ||
      nextCharRect.top > obsBottom
    );
  });
}

function moveDot(input: KeyboardEvent) {
  if (!canPlayerMove.value) return;
  let newX = positionX.value;
  let newY = positionY.value;

  if (input.key === "ArrowUp") newY -= 20;
  else if (input.key === "ArrowDown") newY += 20;
  else if (input.key === "ArrowLeft") newX -= 20;
  else if (input.key === "ArrowRight") newX += 20;
  else return;

  if (!checkCollision(newX, newY)) {
    positionX.value = newX;
    positionY.value = newY;

    for (const player of otherPlayersData.value) {
      if (player.id === myPlayerId.value) {
        player.posX = newX;
        player.posY = newY;
      }
    }

    sendPlayerPosition(newX, newY);
  }

  if (checkBattleZone(newX, newY)) {
    battleTest();
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
  //obstacles.value = Array.from(document.querySelectorAll(".obstacle"));
  otherPlayers.value = Array.from(document.querySelectorAll(".other-players"));
  socket.on("yourId", (id) => {
    myPlayerId.value = id;
  });
  connectToWebSocket("user connected");
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
    v-if="(windowWidth >= 1150 || windowWHeight >= 920) && !isInBattleMode"
    class="bg-black min-h-screen flex flex-col justify-center items-center"
    :class="{ 'animate-ping duration-1000': transitionToBattle }"
  >
    <section class="my-4">
      <h1 class="animate-pulse text-red-500 font-bold text-4xl p-2">
        WORK IN PROGRESS
      </h1>
      <div class="w-full flex justify-center items-center gap-2">
        <button
          class="text-white border-2 rounded-lg p-2 cursor-pointer hover:bg-gray-800"
          @click="manageHitboxesDisplay()"
        >
          Show hitboxes
        </button>
        <button
          class="text-white border-2 rounded-lg p-2 cursor-pointer hover:bg-gray-800"
          @click="openSendMessageBox()"
        >
          Send a message
        </button>
      </div>
    </section>
    <section
      class="h-[920px] w-[1150px] max-w-[1150px] mx-auto overflow-x-hidden relative bg-[url(/maps/route-101.png)] bg-no-repeat bg-cover bg-center rounded-3xl"
    >
      <div
        v-for="(player, index) in otherPlayersData"
        id="character"
        ref="character"
        :key="index"
        class="absolute other-players h-20 w-20 z-50 flex flex-col justify-center items-center"
        :class="{
          'border-2 border-red-500': isItboxesShown,
          'opacity-50': player.id !== myPlayerId,
        }"
        :style="{ left: `${player.posX}px`, top: `${player.posY}px` }"
      >
        <div class="relative w-full flex flex-col justify-center items-center">
          <div
            v-if="player.id === messagePlayerID"
            class="absolute top-[-150%] left-[0%] min-w-[200%] w-fit z-50 bg-white text-black text-center font-bold"
          >
            {{ messageDisplayed }}
          </div>
          {{ player.id === myPlayerId ? "Moi" : player.id }}
        </div>
        <img src="/test-char.gif" alt="player image" class="w-20 h-20" />
      </div>
      <div
        v-for="(obs, index) in obstacleData"
        :key="index"
        class="absolute obstacle"
        :class="{ 'border-4 border-red-500': isItboxesShown }"
        :style="{
          left: `${obs.posX}%`,
          top: `${obs.posY}%`,
          width: `${obs.width}px`,
          height: `${obs.height}px`,
        }"
      ></div>
      <div
        v-for="(battleZone, index) in battleZonesData"
        :key="index"
        class="absolute battlezone"
        :class="{ 'border-4 border-blue-600': isItboxesShown }"
        :style="{
          left: `${battleZone.posX}%`,
          top: `${battleZone.posY}%`,
          width: `${battleZone.width}px`,
          height: `${battleZone.height}px`,
        }"
      ></div>
    </section>
  </section>
  <section v-if="!(windowWidth >= 1150 || windowWHeight >= 920)">
    écran pas assez grand !
  </section>
  <section
    v-if="isInBattleMode"
    class="flex flex-col justify-center items-center bg-black h-screen gap-20"
  >
    <h1 class="text-white font-bold">mdr c'est un combat mon gars</h1>
    <button
      class="text-white border-2 rounded-lg p-2 cursor-pointer hover:bg-gray-800"
      @click="setBattleModeOff()"
    >
      Retour
    </button>
  </section>
</template>

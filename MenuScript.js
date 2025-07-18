let settingsBtn = document.getElementById("settings-btn");
let settingsPopup = document.getElementById("settings");
let saveBtn = document.getElementById("save-btn");

settingsBtn.addEventListener("click", function () {
  settingsPopup.style.display = "block";
});

saveBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const theme = document.querySelector('input[name="theme-choice"]:checked');
  if (theme) {
    localStorage.setItem("theme", theme.value);
  }

  const music = document.querySelector('input[name="music-choice"]:checked');
  if (music) {
    localStorage.setItem("music", music.value);
  }

  const sound = document.querySelector('input[name="game-sound-choice"]:checked');
  if (sound) {
    localStorage.setItem("sound", sound.value);
  }

  settingsPopup.style.display = "none";
});


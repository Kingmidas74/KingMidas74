/**
 * Initializes the mode switcher component with static data.
 * @param {Document} document - The document object of the page.
 * @param {Object} data - The data for the mode switcher.
 */
const init = (document, data) => {
  const modeSwitcherElement = document.getElementById("mode-switcher");
  if (!modeSwitcherElement) return;
  
  modeSwitcherElement.addEventListener("change", (event) => {
    switchMode(document, data, event.detail.value ? "life" : "work");
  });
};

const switchMode = async (document, data, mode) => {
  document.getElementsByTagName("body")[0].setAttribute("data-mode", mode);
  document.getElementsByClassName("header__name")[0].textContent = data[mode].full_name;
  document.getElementsByClassName("header__position")[0].textContent = data[mode].position;
}

export { init };

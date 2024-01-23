import { Data } from "../components/social-buttons/social-buttons.js";

/**
 * Initializes the skills percentage chart with given data.
 * @param {Document} document - The document object of the page.
 * @param {Array<Data>} data - An array of objects.
 */
const init = (document, data) => {
  const socialButtons = document.getElementsByClassName("social-buttons");
  if (!socialButtons) return;

  for (let i = 0; i < socialButtons.length; i++) {
    socialButtons[i].data = data;

    socialButtons[i].addEventListener("export", () => {
      exportToPDF(document);
    });
  }
};

const exportToPDF = (document) => {
  // const printContents = document.querySelector('*[data-mode="pdf"').innerHTML;
  // const originalContents = document.body.innerHTML;

  // document.body.innerHTML = printContents;

  window.print();

  // document.body.innerHTML = originalContents;

  // const currentMode = document
  //   .getElementsByTagName("body")[0]
  //   .getAttribute("data-mode");
  // document.getElementsByTagName("body")[0].setAttribute("data-mode", "pdf");
  // window.setTimeout(() => {
  //   window.print();
  //   document
  //     .getElementsByTagName("body")[0]
  //     .setAttribute("data-mode", currentMode);
  // }, 1000);
};

export { init };

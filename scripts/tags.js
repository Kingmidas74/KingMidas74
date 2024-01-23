/**
 * Initializes the language tags with given data.
 * @param {Document} document - The document object of the page.
 * @param {Array} data - An array of objects each containing 'title' and 'weight' properties.
 */
const init = (document, data) => {
  const languageTags = document.querySelectorAll(".skills__cloud")
  for (let index = 0; index < languageTags.length; index++) {
    const element = languageTags[index];
    element.data = data;
  }
};

export { init };

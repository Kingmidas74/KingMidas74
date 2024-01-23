/**
 * Initializes the language tags with given data.
 * @param {Document} document - The document object of the page.
 * @param {Array} data - An array of objects.
 */
const init = (document, data) => {
  const timelines = document.querySelectorAll(".timeline")
  for (let index = 0; index < timelines.length; index++) {
    const element = timelines[index];
    element.data = data[element.attributes.getNamedItem("data-mode").value].timeline
  }
};

export { init };

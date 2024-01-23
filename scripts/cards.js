/**
 * Initializes the cards component with static data.
 * @param {Document} document - The document object of the page.
 * @param {Array} data - An array of objects.
 */
const init = (document, data) => {
  const cards = document.querySelectorAll(".portfolio__cards");
  for (let index = 0; index < cards.length; index++) {
    const element = cards[index];
    element.data = data[element.attributes.getNamedItem("data-mode").value].cards;
  }
};

export { init };

import { Data } from "../components/chart-pie/chart-pie.js";

/**
 * Initializes the skills percentage chart with given data.
 * @param {Document} document - The document object of the page.
 * @param {Array} data - An array of objects each containing 'language' and 'percentage' properties.
 */
const init = (document, data) => {
  const skillsPercentage = document.getElementById("skills-percentage");
  if (!skillsPercentage) return;
  skillsPercentage.data = data.map(
    (val) => new Data(val.language, val.percentage)
  );
};

export { init };

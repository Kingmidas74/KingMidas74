export class Data {
  constructor(title, percentage) {
    this.title = title;
    this.percentage = percentage;
  }
}

class Sector {
  /**
   * @param {Data} data
   * @param {Number} idx
   * @param {Number} startAngle
   */
  constructor(data, idx, startAngle) {
    this.title = data.title;
    this.percentage = data.percentage;
    this.startAngle = startAngle;

    this.idx = idx;
  }
}

class SectorGenerator {
  
  #data;

  constructor(data) {
    this.#data = data;
  }

  *generate() {
    let startAngle = 0;
    for (const el of this.#data) {
      
      yield {
        startAngle,
      };

      startAngle = startAngle + 360 * (el.percentage / 100);
    }
  }

  *[Symbol.iterator]() {
    for (const [index, sectorData] of [
      ...this.generate(),
    ].entries()) {
      yield new Sector(
        this.#data[index],
        index,
        sectorData.startAngle
      );
    }
  }
}

export class CHART_PIE extends HTMLElement {

  #shadow;

  #template;

  #pendingData;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#template = this.#initializeTemplateParser().catch((err) => {
      CHART_PIE.logger.error(err);
    });
  }

  async #initializeTemplateParser() {
    const [cssResponse, htmlResponse] = await Promise.all([
      CHART_PIE.windowProvider.fetch(
        new URL(CHART_PIE.stylePath, new URL(import.meta.url)).href
      ),
      CHART_PIE.windowProvider.fetch(
        new URL(CHART_PIE.templatePath, new URL(import.meta.url)).href
      ),
    ]);
    const [styleContent, templateContent] = await Promise.all([
      cssResponse.text(),
      htmlResponse.text(),
    ]);
    const style = CHART_PIE.documentProvider.createElement("style");
    style.textContent = styleContent;
    this.#shadow.append(style);
    return templateContent;
  }

  /**
   * @param {Array<Data>} data
   */
  set data(data) {
    if (!this.isConnected) {
      this.#pendingData = data;
      return;
    }

    this.#template
      .then((templateContent) => {
        const sectors = new SectorGenerator(data);

        this.#render(templateContent, {
          title: this.getAttribute("title"),
          items: Array.from(sectors, (s) => s),
          legend: ["true", "1"].includes(this.getAttribute("with-legend")),
        });
      })
      .catch((err) => {
        CHART_PIE.logger.error(err);
      });
  }

  #render(templateContent, templateData) {
    const template = CHART_PIE.documentProvider.createElement("template");
    template.innerHTML = CHART_PIE.templateParser?.parse(
      templateContent,
      templateData
    );
    this.#shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.#pendingData) {
      this.data = this.#pendingData;
      this.#pendingData = null;
    }
  }
}

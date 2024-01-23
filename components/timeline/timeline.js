export class TIMELINE extends HTMLElement {
  /**
   * @static
   * @type {Console}
   * @description This is logger.
   */
  static logger;

  #shadow;

  #template;

  #cards;

  #pendingData;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#template = this.#initializeTemplateParser().catch((err) => {
      TIMELINE.logger.error(err);
    });
  }

  async #initializeTemplateParser() {
    const [cssResponse, htmlResponse] = await Promise.all([
      TIMELINE.windowProvider.fetch(
        new URL(TIMELINE.stylePath, new URL(import.meta.url)).href
      ),
      TIMELINE.windowProvider.fetch(
        new URL(TIMELINE.templatePath, new URL(import.meta.url)).href
      ),
    ]);
    const [styleContent, templateContent] = await Promise.all([
      cssResponse.text(),
      htmlResponse.text(),
    ]);
    const style = TIMELINE.documentProvider.createElement("style");
    style.textContent = styleContent;
    this.#shadow.append(style);
    return templateContent;
  }

  set data(data) {
    if (!this.isConnected) {
      this.#pendingData = data;
      return;
    }

    data.items = data.items.map((item) => {
      return {
        ...item,
        color: this.#generateHslaColors(),
      };
    });


    this.#template
      .then((templateContent) => {

        this.#render(templateContent, {
          title: this.getAttribute("title"),
          items: data.items.map((item, idx) => {
            return {
              ...item,
              order: idx,
            };
          }),
          legends: data.legends,
        });
      })
      .catch((err) => {
        TIMELINE.logger.error(err);
      });
  }

  #generateHslaColors() {
    const hue = TIMELINE.windowProvider.Math.floor(
      TIMELINE.windowProvider.Math.random() * 360
    );
    const saturation = TIMELINE.windowProvider.Math.floor(
      TIMELINE.windowProvider.Math.random() * 101
    );
    const value = TIMELINE.windowProvider.Math.floor(
      TIMELINE.windowProvider.Math.random() * 101
    );

    return `hsl(${hue},${saturation}%,${value}%)`;
  }

  #render(templateContent, templateData) {
    const template = TIMELINE.documentProvider.createElement("template");
    template.innerHTML = TIMELINE.templateParser?.parse(
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

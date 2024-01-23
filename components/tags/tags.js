export class TAGS extends HTMLElement {
  /**
   * @static
   * @type {Console}
   * @description This is logger.
   */
  static logger;

  #shadow;

  #template;

  #pendingData;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#template = this.#initializeTemplateParser().catch((err) => {
      TAGS.logger.error(err);
    });
  }

  async #initializeTemplateParser() {
    const [cssResponse, htmlResponse] = await Promise.all([
      TAGS.windowProvider.fetch(
        new URL(TAGS.stylePath, new URL(import.meta.url)).href
      ),
      TAGS.windowProvider.fetch(
        new URL(TAGS.templatePath, new URL(import.meta.url)).href
      ),
    ]);
    const [styleContent, templateContent] = await Promise.all([
      cssResponse.text(),
      htmlResponse.text(),
    ]);
    const style = TAGS.documentProvider.createElement("style");
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
        this.#render(templateContent, {
          items: data.sort( () => Math.random() - 0.5),
        });
      })
      .catch((err) => {
        TAGS.logger.error(err);
      });
  }

  #render(templateContent, templateData) {
    const template = TAGS.documentProvider.createElement("template");
    template.innerHTML = TAGS.templateParser?.parse(
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

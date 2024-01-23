export class Data {
  /**
   *
   * @param {String} title title for availability
   * @param {String} description description for availability
   * @param {String} link link to social
   * @param {String} icon button icon
   * @param {String} text visible text
   */
  constructor(title, description, link, icon, text) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.icon = icon;
    this.text = text;
  }
}

export class SOCIAL_BUTTONS extends HTMLElement {
  /**
   * @static
   * @type {Console}
   * @description This is logger.
   */
  static logger;

  #shadow;

  #template;

  #pdfBtn;

  #pendingData;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#template = this.#initializeTemplateParser().catch((err) => {
      SOCIAL_BUTTONS.logger.error(err);
    });
  }

  async #initializeTemplateParser() {
    const [cssResponse, htmlResponse] = await Promise.all([
      SOCIAL_BUTTONS.windowProvider.fetch(
        new URL(SOCIAL_BUTTONS.stylePath, new URL(import.meta.url)).href
      ),
      SOCIAL_BUTTONS.windowProvider.fetch(
        new URL(SOCIAL_BUTTONS.templatePath, new URL(import.meta.url)).href
      ),
    ]);
    const [styleContent, templateContent] = await Promise.all([
      cssResponse.text(),
      htmlResponse.text(),
    ]);
    const style = SOCIAL_BUTTONS.documentProvider.createElement("style");
    style.textContent = styleContent;
    this.#shadow.append(style);
    return templateContent;
  }

  set data(data) {
    if (!this.isConnected) {
      this.#pendingData = data;
      return;
    }

    this.#template
      .then((templateContent) => {
        this.#render(templateContent, {
          title: this.getAttribute("title"),
          items: data,
        });
      })
      .then(() => {
        this.#pdfBtn = this.#shadow.getElementById("pdf");
        this.#pdfBtn?.addEventListener("click", this.export_pdf, false);
      })
      .catch((err) => {
        SOCIAL_BUTTONS.logger.error(err);
      });
  }

  #render(templateContent, templateData) {
    const template = SOCIAL_BUTTONS.documentProvider.createElement("template");
    template.innerHTML = SOCIAL_BUTTONS.templateParser?.parse(
      templateContent,
      templateData
    );
    this.#shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.#pendingData) {
      this.data = this.#pendingData;
      this.#pendingData = null;
      console.log("here");
    }
  }

  disconnectedCallback() {
    this.#pdfBtn?.removeEventListener("click", this.export_pdf, false);
  }

  export_pdf = (e) => {
    this.dispatchEvent(
      new SOCIAL_BUTTONS.windowProvider.CustomEvent("export", {})
    );
  };
}

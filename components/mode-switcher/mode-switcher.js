import { debounce } from "../../core/decorators.js";

export class MODE_SWITCHER extends HTMLElement {
  /**
   * @static
   * @type {Console}
   * @description This is logger.
   */
  static logger;

  #shadow;

  #template;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });
    

    this.#template = this.#initializeTemplateParser().catch((err) => {
      MODE_SWITCHER.logger.error(err);
    });

    // MODE_SWITCHER.windowProvider.setTimeout(() => {
    //   this.#handleColorSchemeChange();
    // }, 100);
  }

  async #initializeTemplateParser() {
    const [cssResponse, htmlResponse] = await Promise.all([
      MODE_SWITCHER.windowProvider.fetch(
        new URL(MODE_SWITCHER.stylePath, new URL(import.meta.url)).href
      ),
      MODE_SWITCHER.windowProvider.fetch(
        new URL(MODE_SWITCHER.templatePath, new URL(import.meta.url)).href
      ),
    ]);
    const [styleContent, templateContent] = await Promise.all([
      cssResponse.text(),
      htmlResponse.text(),
    ]);
    const style = MODE_SWITCHER.documentProvider.createElement("style");
    style.textContent = styleContent;
    this.#shadow.append(style);
    return templateContent;
  }

  #render(templateContent, templateData) {
    const template = MODE_SWITCHER.documentProvider.createElement("template");
    template.innerHTML = MODE_SWITCHER.templateParser?.parse(
      templateContent,
      templateData
    );
    this.#shadow.appendChild(template.content.cloneNode(true));
  }

  /**
   * Dispatches 'change' event with the given value.
   * @param {Boolean} val On/Off value
   */
  #dispatchEvent = (val) => {
    this.dispatchEvent(
      new MODE_SWITCHER.windowProvider.CustomEvent("change", {
        detail: { value: val },
      })
    );
  }

  #handleColorSchemeChange = () => {
    this.#dispatchEvent(MODE_SWITCHER.windowProvider.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    MODE_SWITCHER.windowProvider
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => this.#dispatchEvent(event.matches));
  };

  set value(val) {
    this.#shadow.getElementById("mode-switcher").checked = val;
  }

  connectedCallback() {
    this.#template
      .then((templateContent) => {
        this.#render(templateContent, {
          on: {
            title: "Work",
            description: "Show my work activities",
            img: "./assets/images/sprite.svg#workIcon",
          },
          off: {
            title: "Life",
            description: "Show my life activities",
            img: "./assets/images/sprite.svg#lifeIcon",
          },
        });

        //this.#handleColorSchemeChange();

        this.#shadow
          .getElementById("mode-switcher")
          .addEventListener("change", (e) => {
            this.#dispatchEvent(e.target.checked);
          });
      })
      .catch((err) => {
        MODE_SWITCHER.logger.error(err);
      });
  }

  disconnectedCallback() {
    this.#shadow.getElementById("mode-switcher").removeEventListener("change");
  }
}

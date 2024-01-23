export class Data {
  /**
   *
   * @param {String} img src of image
   * @param {String} name title for card
   * @param {String} description Short description (image author..)
   * @param {String} link link to project
   */
  constructor(img, name, description, link) {
    this.img = img;
    this.name = name;
    this.description = description;
    this.link = link;
  }
}

export class CARDS extends HTMLElement {
  /**
   * @static
   * @type {Console}
   * @description This is logger.
   */
  static logger;

  #shadow;

  #template;

  #slider;

  #pendingData;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#template = this.#initializeTemplateParser().catch((err) => {
      CARDS.logger.error(err);
    });
  }

  async #initializeTemplateParser() {
    const [cssResponse, htmlResponse] = await Promise.all([
      CARDS.windowProvider.fetch(
        new URL(CARDS.stylePath, new URL(import.meta.url)).href
      ),
      CARDS.windowProvider.fetch(
        new URL(CARDS.templatePath, new URL(import.meta.url)).href
      ),
    ]);
    const [styleContent, templateContent] = await Promise.all([
      cssResponse.text(),
      htmlResponse.text(),
    ]);
    const style = CARDS.documentProvider.createElement("style");
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
          items: data.map((item, i) => {
            return {
              ...item,
              id: i,
            };
          }),
        });
        this.#slider = this.#shadow.querySelector('.slider');
        this.#shadow.addEventListener('click', this.nextSlide, false);
      })
      .catch((err) => {
        CARDS.logger.error(err);
      });
  }

  #render(templateContent, templateData) {
    const template = CARDS.documentProvider.createElement("template");
    template.innerHTML = CARDS.templateParser?.parse(
      templateContent,
      templateData
    );
    this.#shadow.appendChild(template.content.cloneNode(true));
  }

  nextSlide = (event) => {
    if (!event.target.parentNode.matches('.slide')) {
      console.log('not slide', event.target.parentNode);
      return;
    }

    const items = this.#shadow.querySelectorAll('.slide');
    for (let i = 2; i < items.length; i++) {
      if (items[i] === event.target.parentNode) {
        for (let j = 0; j < i-1; j++) {
          ((index) => {
            setTimeout(() => {
              this.#slider.append(items[index]);

              this.#shadow.querySelectorAll('.slide').forEach((item, id) => {
                item.style.setProperty('--index', id);
              });

            }, 500 * (index));
          })(j);
        }
        break;
      }
    }
  }

  connectedCallback() {
    if (this.#pendingData) {
      this.data = this.#pendingData;
      this.#pendingData = null;
    }
  }

  disconnectedCallback () {

  }
}

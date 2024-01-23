import { CHART_PIE } from "../components/chart-pie/chart-pie.js";
import { CARDS } from "../components/cards/cards.js";
import { TAGS } from "../components/tags/tags.js";
import { MODE_SWITCHER } from "../components/mode-switcher/mode-switcher.js";
import { TIMELINE } from "../components/timeline/timeline.js";
import { SOCIAL_BUTTONS } from "../components/social-buttons/social-buttons.js";

import { Component } from "../core/decorators.js";

/**
 * Initializes custom components by defining them in the customElements registry.
 * @param {Window} window - The window object of the page.
 * @param {Document} document - The document object of the page.
 * @param {Console} [logger=console] - The logger object used for logging. Defaults to the console object.
 */
const init = (window, document, logger = console) => {
  const componentOptions = {
    templatePath: null,
    stylePath: null,
    windowProvider: window,
    documentProvider: document,
    logger,
  };

  const components = [
    {
      name: "chart-pie",
      component: CHART_PIE,
      templatePath: "./chart-pie.html",
      stylePath: "./chart-pie.css",
    },
    {
      name: "my-cards",
      component: CARDS,
      templatePath: "./cards.html",
      stylePath: "./cards.css",
    },
    {
      name:"my-tags",
      component: TAGS,
      templatePath: "./tags.html",
      stylePath: "./tags.css",
    },
    {
      name: "mode-switcher",
      component: MODE_SWITCHER,
      templatePath: "./mode-switcher.html",
      stylePath: "./mode-switcher.css",
    },
    {
      name: "time-line",
      component: TIMELINE,
      templatePath: "./timeline.html",
      stylePath: "./timeline.css",
    },
    {
      name: "social-buttons",
      component: SOCIAL_BUTTONS,
      templatePath: "./social-buttons.html",
      stylePath: "./social-buttons.css",
    },
  ];

  components.forEach(({ name, component, templatePath, stylePath }) => {
    if (templatePath && stylePath) {
      componentOptions.templatePath = templatePath;
      componentOptions.stylePath = stylePath;
      window.customElements.define(
        name,
        Component(componentOptions)(component)
      );
    } else {
      window.customElements.define(name, component);
    }
  });
};

export { init };

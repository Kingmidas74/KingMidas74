import { GithubProvider } from "./services/github-service.js";
import { DataProvider } from "./services/data-service.js";

import { init as initModeSwitcher } from "./scripts/mode-switcher.js";
import { init as initSkillPercentage } from "./scripts/skills.js";
import { init as initCards } from "./scripts/cards.js";
import { init as initLanguageTags } from "./scripts/tags.js";
import { init as initTimelines } from "./scripts/timeline.js";
import { init as initSocialButtons } from "./scripts/social-buttons.js";
import { init as initializeComponents } from "./scripts/components.js";

/**
 * Initializes the page by setting up components and event listeners.
 * @param {Window} window - The window object of the page.
 * @param {Document} document - The document object of the page.
 * @param {Storage} localStorage - The localStorage object used for storage.
 * @param {JSON} JSON - The JSON object used for parsing and stringifying JSON data.
 */
const init = (window, document, localStorage, JSON) => {
  document.addEventListener("DOMContentLoaded", async () => {
    initializeComponents(window, document);

    const githubProvider = new GithubProvider(
      "KingMidas74",
      localStorage,
      JSON
    );

    const dataProvider = new DataProvider(
      localStorage,
      JSON
    );

    const data = await dataProvider.getData('./data.json');
    initModeSwitcher(document, data);
    initSocialButtons(document, data.contacts);
    initCards(document, data);
    initTimelines(document, data);
    
    const languageData = await githubProvider.getLanguageFrequency(5, true);
    initSkillPercentage(document, languageData)
    initLanguageTags(document, [
      { title: "C#", weight: 4 },
      { title: "Golang", weight: 4 },
      { title: "RabbitMQ", weight: 3 },
      { title: "Redis", weight: 1 },
      { title: "JavaScript", weight: 2 },
      { title: "TypeScript", weight: 1 },
      { title: "Angular", weight: 3 },
      { title: "GraphQL", weight: 1 },
      { title: "REST", weight: 1 },
      { title: "k8s", weight: 2 },
      { title: "Docker", weight: 2 },
    ]);
  });
};

init(window, document, localStorage, JSON);

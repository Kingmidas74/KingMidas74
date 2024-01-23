class LanguageInfo {
  /**
   *
   * @param {String} language
   * @param {Number} percentage
   */
  constructor(language, percentage) {
    this.language = language;
    this.percentage = percentage;
  }
}

export class GithubProvider {
  static domain = "https://api.github.com";

  #login;
  #localStorageProvider;
  #jsonProvider;

  /**
   *
   * @param {String} login -- github username
   * @param {Storage} localStorageProvider Interface supported localStorage access
   * @param {JSON} jsonProvider Interface supported JSON access
   */
  constructor(login, localStorageProvider, jsonProvider) {
    this.#login = login;
    this.#localStorageProvider = localStorageProvider;
    this.#jsonProvider = jsonProvider;
  }

  async getUserInfo() {
    const githubResponse = await fetch(
      `${GithubProvider.domain}/users/${username}`
    );
    return await githubResponse.json();
  }

  /**
   *
   * @param {Number} top Limit of languages sorted by frequency
   * @param {Boolean} aggregateRemains Replace last element to remain percentage as "other"
   * @returns {PromiseLike<Array<LanguageInfo>>}
   */
  async getLanguageFrequency(top, aggregateRemains) {
    const KEY = "languages-statistic-info";
    const data = this.#localStorageProvider.getItem(KEY);
    if (data) {
      const parsedData = this.#jsonProvider.parse(data);
      if(parsedData.length == top) {
        return parsedData;
      }
    }

    const response = await fetch(
      `${GithubProvider.domain}/users/${this.#login}/repos`
    ).then((response) => response.json());
    console.log(response);
    const aggregateInfo = response
      .filter((repo) => !repo.fork && !repo.archived && !!repo.language)
      .map((repo) => repo.language)
      .map((lang) => 
        ["javascript", "css", "html", "typescript"].includes(lang?.toLowerCase())
          ? "Front-end"
          : lang
      )
      .reduce((acc, curr) => ((acc[curr] = (acc[curr] || 0) + 1), acc), {});

    let totalCount = 0;
    for (const lang in aggregateInfo) {
      totalCount += aggregateInfo[lang];
    }

    const stat = Object.entries(aggregateInfo).reduce((acc, [key, value]) => {
      acc[key] = parseInt((value / totalCount) * 100);
      return acc;
    }, {});

    const topLanguages = Object.entries(stat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, aggregateRemains ? top - 1 : top);

    let totalPercentage = 0;
    for (const [_, percentage] of topLanguages) {
      totalPercentage += percentage;
    }
    if (aggregateRemains) {
      topLanguages.push(["others", 100 - totalPercentage]);
    }

    const result = topLanguages.map(([lang, percentage]) => new LanguageInfo(lang, percentage));

    this.#localStorageProvider.setItem(KEY, this.#jsonProvider.stringify(result));

    return result;
  }
}

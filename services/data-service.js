export class DataProvider {

  #localStorageProvider;
  #jsonProvider;

  /**
   *
   * @param {Storage} localStorageProvider Interface supported localStorage access
   * @param {JSON} jsonProvider Interface supported JSON access
   */
  constructor(localStorageProvider, jsonProvider) {
    this.#localStorageProvider = localStorageProvider;
    this.#jsonProvider = jsonProvider;
  }

  async getData(json_url) {
    const githubResponse = await fetch(
      `${json_url}`
    );
    return await githubResponse.json();
  }
}

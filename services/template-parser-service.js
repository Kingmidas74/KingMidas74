export class TemplateParser {
  constructor() {}

  /**
   *
   * @param {String} template raw string with template literals
   * @param {Object} data Any object with values for template
   */
  parse(template, data) {
    const regexFor =
      /{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%}([\s\S]+?){%\s*endfor\s*%}/gi;
    const regexIf = /{%\s*if\s+([\w.]+)\s*%}([\s\S]+?){%\s*endif\s*%}/gi;
    let match;
    let output = template;

    // Handle 'for' directive
    while ((match = regexFor.exec(template)) !== null) {
      const loopVariable = match[1];
      const loopArray = data[match[2]];
      const loopBlock = match[3];

      let renderedLoop = "";
      loopArray.forEach((item) => {
        // Create a new data object for each loop iteration
        const loopData = { ...data, [loopVariable]: item };
        renderedLoop += this.parse(loopBlock, loopData);
      });
      output = output.replace(match[0], renderedLoop);
    }

    // Reset the lastIndex property of the regex to ensure proper execution
    regexFor.lastIndex = 0;

    // Handle 'if' directive
    while ((match = regexIf.exec(output)) !== null) {
      const condition = match[1];
      const ifBlock = match[2];
      // Function to resolve the value of a property, supporting both top-level and nested properties
      const resolveCondition = (data, path) => {
        // Split the path by dots to handle nested properties
        const parts = path.split(".");
        // Use reduce to navigate through the object properties
        return parts.reduce((current, part) => {
          return current !== undefined ? current[part] : undefined;
        }, data);
      };

      // Resolve the condition value
      const conditionValue = resolveCondition(data, condition);

      if (conditionValue) {
        output = output.replace(match[0], this.parse(ifBlock, data));
      } else {
        output = output.replace(match[0], "");
      }
    }

    // Reset the lastIndex property of the regex to ensure proper execution
    regexIf.lastIndex = 0;

    // Handle interpolation
    output = output.replace(/{{\s*([^}\s]+)\s*}}/gi, (_, key) => {
      // Split the key by dots to get individual property names
      const properties = key.split(".");

      // Use reduce to navigate through the object properties
      const result = properties.reduce((current, property) => {
        return current ? current[property] : undefined;
      }, data);

      return result !== undefined ? result : "";
    });

    return output;
  }
}

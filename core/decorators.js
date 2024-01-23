import { TemplateParser } from "../services/template-parser-service.js";

export function Component({
  templatePath,
  stylePath,
  windowProvider = window,
  documentProvider = document,
  logger = console,
  templateParser = new TemplateParser(),
}) {
  return (OriginalClass) => {
    OriginalClass.stylePath = stylePath;
    OriginalClass.templatePath = templatePath;
    OriginalClass.windowProvider = windowProvider;
    OriginalClass.documentProvider = documentProvider;
    OriginalClass.logger = logger;
    OriginalClass.templateParser = templateParser;
    return OriginalClass;
  };
}

export const debounce = ({ windowProvider = window, func, interval=100 }) => {
  let timer;
  return (event) => {
    if (timer) windowProvider.clearTimeout(timer);
    timer = windowProvider.setTimeout(func, interval, event);
  };
};

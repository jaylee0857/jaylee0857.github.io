import { getNormalize, getFilename } from "./_rename";
import * as R from "ramda";
const files = import.meta.globEager("../locales/**/*.js");
const messages = {};

for (let path in files) {
  const [, , locale, ...paths] = getNormalize(path).split("/");
  const filename = getFilename(path);
  const messageKey = R.join(".", [...paths, filename]);
  const fileObj = files[path].default;

  messages[locale] = R.reduce(
    (merge, key) =>
      R.mergeDeepRight(merge, {
        [`${messageKey}.${key}`]: fileObj[key],
      }),
    messages[locale] || {},
    R.keys(fileObj)
  );
}

export default messages;

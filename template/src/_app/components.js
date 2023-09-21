import { getFilename } from "./_rename";
const files = import.meta.globEager("../components/*.vue");
const modules = [];

for (let path in files) {
  const filename = getFilename(path);
  modules.push({
    componentName: filename,
    component: files[path].default,
  });
}

const components = {
  install: (app) => {
    modules.forEach((m) => {
      app.component(m.componentName, m.component);
    });
  },
};

export default components;

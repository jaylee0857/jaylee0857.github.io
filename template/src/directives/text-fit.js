import $ from "jquery";
import textfit from "textfit";

const $run = (el, settings) => {
  if (!el.textContent) {
    console.warn(
      "%cThe v-text-fit is missing the textContent.",
      "color: lightgreen;"
    );
    return;
  }

  if (!el.offsetHeight || !el.offsetWidth) {
    console.log(
      "%cThe v-text-fit is missing has not finished rendering. \nMaybe use 'v-if'",
      "color: lightgreen;"
    );
    return;
  }

  if (settings.fontSizeRange !== undefined) {
    const computedStyle = window.getComputedStyle(el);
    const fontSize = computedStyle.getPropertyValue("font-size");
    const originFontSize = +fontSize.replace("px", "");
    settings.minFontSize = originFontSize - settings.fontSizeRange;
    settings.maxFontSize = originFontSize + settings.fontSizeRange;
  }

  textfit(el, settings);
};

export default {
  created(el, binding) {
    /** 預設值 */
    const settings = {
      alignVert: binding.value?.alignVert ?? false, // if true, textFit will align vertically using css tables
      alignHoriz: binding.value?.alignHoriz ?? false, // if true, textFit will set text-align: center
      multiLine: binding.value?.multiLine ?? false, // if true, textFit will not set white-space: no-wrap
      detectMultiLine: binding.value?.detectMultiLine ?? true, // disable to turn off automatic multi-line sensing
      minFontSize: binding.value?.minFontSize ?? 6,
      maxFontSize: binding.value?.maxFontSize ?? 80,
      reProcess: binding.value?.reProcess ?? true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
      widthOnly: binding.value?.widthOnly ?? false, // if true, textFit will fit text to element width, regardless of text height
      alignVertWithFlexbox: binding.value?.alignVertWithFlexbox ?? false, // if true, textFit will use flexbox for vertical alignment
      fontSizeRange: binding.value?.fontSizeRange,
    };

    $(el).data("text-fit-setting", settings);
  },
  mounted(el) {
    $run(el, $(el).data("text-fit-setting"));
  },
  updated(el, binding, node) {
    const hasFitted = $(el).has(".textFitted");
    if (hasFitted) {
      $(el).find(".textFitted").replaceWith(node.children[0].children);
    }
    $run(el, $(el).data("text-fit-setting"));
  },
};

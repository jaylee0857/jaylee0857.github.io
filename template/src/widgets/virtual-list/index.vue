<template>
  <div ref="root" class="overflow-x-hidden overflow-y-auto" @scroll="onScroll">
    <div :class="wrapClass" role="group" :style="wrapperStyle">
      <Item
        v-for="source in displaySource"
        :key="source.uniqId"
        :source="source"
        @updated="onItemUpdated"
      >
        <slot :source="source" />
      </Item>
    </div>
    <div ref="shepherd" style="width: 100%; height: 0"></div>
  </div>
</template>
<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";

/** class */
import { Virtual } from "./virtual";

/** components */
import Item from "./item";

const props = defineProps({
  dataKey: {
    type: [String, Function],
    required: true,
  },
  dataSources: {
    type: Array,
    required: true,
  },

  keeps: {
    type: Number,
    default: 30,
  },
  extraProps: {
    type: Object,
  },
  estimateSize: {
    type: Number,
    default: 50,
  },

  direction: {
    type: String,
    default: "vertical", // the other value is horizontal
  },
  start: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
  topThreshold: {
    type: Number,
    default: 0,
  },
  bottomThreshold: {
    type: Number,
    default: 0,
  },
  wrapClass: {
    type: String,
    default: "",
  },
  wrapStyle: {
    type: Object,
  },
});
const emit = defineEmits([
  "virtualList",
  "resized",
  "totop",
  "tobottom",
  "scroll",
]);

const root = ref();
const shepherd = ref();
const wrapperStyle = computed(() => {
  const { padFront, padBehind } = range.value;
  const paddingStyle = { padding: `${padFront}px 0px ${padBehind}px` };
  return props.wrapStyle
    ? Object.assign({}, props.wrapStyle, paddingStyle)
    : paddingStyle;
});
const displaySource = computed(() => {
  const { start, end } = range.value;
  const dataKey = props.dataKey;
  return props.dataSources.slice(start, end + 1).map((source, idx) => ({
    ...source,
    index: start + idx,
    uniqId: typeof dataKey === "function" ? dataKey(source) : source[dataKey],
  }));
});

const getUniqueIdFromDataSources = () => {
  const dataKey = props.dataKey;
  return props.dataSources.map((dataSource) =>
    typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
  );
};
const range = ref();
const virtual = new Virtual(
  {
    slotHeaderSize: 0,
    slotFooterSize: 0,
    keeps: props.keeps,
    estimateSize: props.estimateSize,
    buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
    uniqueIds: getUniqueIdFromDataSources(),
  },
  (val) => {
    range.value = val;
  }
);
range.value = virtual.getRange();

/** methods */
const getSize = (id) => {
  return virtual.sizes.get(id);
};

const getOffset = () => {
  return root.value ? Math.ceil(root.value.scrollTop) : 0;
};

const getClientSize = () => {
  return root.value ? Math.ceil(root.value.clientHeight) : 0;
};

const getScrollSize = () => {
  return root.value ? Math.ceil(root.value.scrollHeight) : 0;
};

const scrollToIndex = (index) => {
  // scroll to bottom
  if (index >= props.dataSources.length - 1) {
    scrollToBottom();
  } else {
    const offset = virtual.getOffset(index);
    scrollToOffset(offset);
  }
};

const scrollToOffset = (offset) => {
  root.value.scrollTop = offset;
};

// set current scroll position to bottom
const scrollToBottom = () => {
  if (shepherd.value) {
    const offset = shepherd.value.offsetTop;
    scrollToOffset(offset);

    // check if it's really scrolled to the bottom
    // maybe list doesn't render and calculate to last range
    // so we need retry in next event loop until it really at bottom
    setTimeout(() => {
      if (getOffset() + getClientSize() + 1 < getScrollSize()) {
        scrollToBottom();
      }
    }, 3);
  }
};

const onScroll = (evt) => {
  const offset = getOffset();
  const clientSize = getClientSize();
  const scrollSize = getScrollSize();

  // iOS scroll-spring-back behavior will make direction mistake
  if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
    return;
  }

  virtual.handleScroll(offset);
  emitEvent(offset, clientSize, scrollSize, evt);
};

// emit event in special position
const emitEvent = (offset, clientSize, scrollSize, evt) => {
  emit("scroll", evt, range.value);

  if (
    virtual.isFront() &&
    !!props.dataSources.length &&
    offset - props.topThreshold <= 0
  ) {
    emit("totop");
  } else if (
    virtual.isBehind() &&
    offset + clientSize + props.bottomThreshold >= scrollSize
  ) {
    emit("tobottom");
  }
};

const isScrollAtBottom = () => {
  return (
    virtual.isBehind() &&
    getOffset() + getClientSize() + props.bottomThreshold >= getScrollSize()
  );
};

const onItemUpdated = (id, size) => {
  virtual.saveSize(id, size);
};

onMounted(() => {
  emit("virtualList", {
    scrollToBottom,
    scrollToOffset,
  });

  // set position
  if (props.start) {
    scrollToIndex(props.start);
  } else if (props.offset) {
    scrollToOffset(props.offset);
  }
});

onBeforeUnmount(() => {
  virtual.destroy();
});

watch(
  () => props.dataSources.length,
  () => {
    virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
  }
);

watch(
  () => props.keeps,
  (newValue) => {
    virtual.updateParam("keeps", newValue);
    virtual.handleSlotSizeChange();
  }
);

watch(
  () => props.start,
  (newValue) => {
    scrollToIndex(newValue);
  }
);

watch(
  () => props.offset,
  (newValue) => {
    scrollToOffset(newValue);
  }
);

defineExpose({
  getSize,
  isScrollAtBottom,
  scrollToIndex,
  scrollToOffset,
  scrollToBottom,
});
</script>

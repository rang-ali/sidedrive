<!-- 
  File heavily inspired by the project sl-vue-tree made by holiber.

  https://github.com/holiber/sl-vue-tree
  @author holiber
  MIT licensed
 -->

<template>
  <div
    class="vue-tree select-none"
    :class="{
      'vue-tree-root': isRoot,
    }"
    :style="isRoot && {
      paddingBottom: `${NODE_HEIGHT}px`,
    }"
    @dragend="onDragendHandler(null, $event)"
    @mousemove.passive="onMousemoveHandler"
    @mouseleave="onMouseleaveHandler"
  >
    <div
      ref="nodes"
      :class="{
        'vue-tree-cursor-inside': cursorPosition && cursorPosition.node && cursorPosition.node.data.id === 'root'
      }"
      class="vue-tree-nodes-list"
      @mouseleave="$emit('mouseleave')"
    >
      <div
        v-for="(node, nodeInd) in nodes"
        :key="nodeInd"
        :class="{
          'vue-tree-cursor-inside':
              cursorPosition &&
              cursorPosition.placement === 'inside' &&
              cursorPosition.node.pathStr === node.pathStr
        }"
        :style="{ '--depth': depth }"
        class="vue-tree-node"
      >
        <div
          class="vue-tree-cursor vue-tree-cursor_before"
          @dragover.prevent
        >
          <!-- suggested place for node insertion  -->
        </div>
        <div
          class="vue-tree-node-item"
          @mousedown="onNodeMousedownHandler($event, node)"
          @mouseup="onNodeMouseupHandler($event, node)"
          :path="node.pathStr"
          :class="{
            'vue-tree-cursor-hover':
              cursorPosition &&
              cursorPosition.node.pathStr === node.pathStr,
          }"
        >
          <div v-for="gapInd in gaps" :key="gapInd" class="vue-tree-gap" />
          <div class="vue-tree-title w-full">
            <slot
              name="title"
              :node="node"
              :toggle="onToggleHandler"
              :selected="selectedIds.includes(node.data.id)"
              :hasHover="cursorPosition && cursorPosition.node.pathStr === node.pathStr"
              :cursorInside="cursorPosition && cursorPosition.placement === 'inside' && cursorPosition.node.pathStr === node.pathStr"
              :isDragging="isDragging"
            >
              {{ node.title }}
            </slot>
            <slot
              v-if="!node.isLeaf && node.children.length == 0 && expandedIds.includes(node.data.id)"
              name="emptyNode"
              :node="node"
              :isLoading="loadingIds.includes(node.data.id)"
              :isEmpty="node.isEmpty"
            />
            <slot
              v-if="nodes.length === nodeInd + 1"
              name="fetchMore"
            />
          </div>
          <div class="vue-tree-sidebar">
            <slot name="sidebar" :node="node"></slot>
          </div>
        </div>
        <vue-tree
          v-if="node.children && node.children.length && expandedIds.includes(node.data.id)"
          :value="node.children"
          :level="node.level"
          :parentInd="nodeInd"
          :allowMultiselect="allowMultiselect"
          :allowToggleBranch="allowToggleBranch"
          :expandedIds="expandedIds"
          :loadingIds="loadingIds"
          :selectedIds="selectedIds"
          :edgeSize="edgeSize"
          @dragover.prevent
        >
          <template #title="{ node }">
            <slot
              name="title"
              :node="node"
              :toggle="onToggleHandler"
              :selected="selectedIds.includes(node.data.id)"
              :hasHover="!node.isLeaf && cursorPosition && cursorPosition.node.pathStr === node.pathStr"
              :cursorInside="cursorPosition && cursorPosition.placement === 'inside' && cursorPosition.node.pathStr === node.pathStr"
              :isDragging="isDragging"
            >
              {{ node.title }}
            </slot>
          </template>
          <template #toggle="{ node }">
            <slot name="toggle" :node="node">
            <span>
              {{ !node.isLeaf ? (expandedIds.includes(node.data.id) ? '-' : '+') : '' }}
            </span>
            </slot>
          </template>
          <template #sidebar="{ node }">
            <slot name="sidebar" :node="node"></slot>
          </template>
          <template #emptyNode="{ node }">
            <slot
              v-if="!node.isLeaf && node.children.length == 0 && expandedIds.includes(node.data.id)"
              name="emptyNode"
              :node="node"
              :isLoading="loadingIds.includes(node.data.id)"
              :isEmpty="node.isEmpty"
            >
            </slot>
          </template>
          <template #fetchMore>
            <slot name="fetchMore" />
          </template>
        </vue-tree>
        <div
          class="vue-tree-cursor vue-tree-cursor_after"
          @dragover.prevent
          :style="{
            'visibility': cursorPosition &&
              cursorPosition.node.pathStr === node.pathStr &&
              cursorPosition.placement === 'after' ?
              'visible' :
              'hidden',
          }"
        >
          <!-- suggested place for node insertion  -->
        </div>
      </div>
      <teleport to="body">
        <div
          v-show="isDragging && selectionSize"
          v-if="isRoot"
          ref="dragInfo"
          class="fixed z-50 h-0 w-0 select-none"
          style="cursor: grabbing;"
        >
          <slot name="draginfo">
            Items: {{selectionSize}}
          </slot>
        </div>
      </teleport>
    </div>
    <teleport to="head">
      <component v-if="isRoot && isDragging" :is="'style'">
        div {
          cursor: grabbing !important;
          cursor: grabbing !important;
          cursor: -moz-grabbing !important;
          cursor: -webkit-grabbing !important;
          user-select: none !important;
        }
      </component>
    </teleport>
  </div>
</template>
<script>
import { onClickOutside } from '@vueuse/core';
const NODE_HEIGHT = 28;

export default {
  name: 'vue-tree',
  inheritAttrs: false,
  emits: [
    'update:modelValue',
    'update:expandedIds',
    'update:selectedIds',
    'dragTo',
    'drop',
    'beforedrop',
    'dragChange',
    'mouseleave'
  ],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    expandedIds: {
      type: Array,
      required: true,
    },
    loadingIds: {
      type: Array,
      required: true,
    },
    selectedIds: {
      type: Array,
      required: true,
    },
    edgeSize: {
      type: Number,
      default: 3
    },
    level: {
      type: Number,
      default: 0
    },
    parentInd: {
      type: Number
    },
    allowMultiselect: {
      type: Boolean,
      default: true
    },
    allowToggleBranch: {
      type: Boolean,
      default: true
    },
    multiselectKey: {
      type: [String, Array],
      default() {
        return ['ctrlKey', 'metaKey']
      },
      validator(value) {
        let allowedKeys = ['ctrlKey', 'metaKey', 'altKey'];
        let multiselectKeys = Array.isArray(value) ? value : [value];
        multiselectKeys = multiselectKeys.filter(keyName => allowedKeys.indexOf(keyName ) !== -1);
        return !!multiselectKeys.length;
      }
    },
    scrollAreaHeight: {
      type: Number,
      default: 70
    },
    maxScrollSpeed: {
      type: Number,
      default: 20
    },
    dragToRoot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rootCursorPosition: null,
      scrollIntervalId: 0,
      scrollSpeed: 0,
      lastSelectedNode: null,
      mouseIsDown: false,
      isDragging: false,
      lastMousePos: {x: 0, y: 0},
      preventDrag: false,
      // modelValue: this.modelValue,
      rootBcr: null,
      NODE_HEIGHT,
    };
  },

  mounted() {
    if (this.isRoot) {
      document.addEventListener('mouseup', this.onDocumentMouseupHandler);
      document.addEventListener('keyup', this.onEsc);

      onClickOutside(this.$refs.nodes, () => {
        this.emitSelect([]);
      });
    }
  },

  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseupHandler);
    document.removeEventListener('keyup', this.onEsc);
  },

  watch: {
    // stringifiedModel(newValue) {
    //   this.modelValue = this.modelValue;
    // },
    isDragging(val) {
      this.$emit('dragChange', val)
      if (val) return;
      this.rootBcr = null;
    },
  },

  computed: {
    // stringifiedModel() {
    //   return JSON.stringify(this.modelValue.map(x => x.id));
    // },
    cursorPosition() {
      if (this.isRoot) return this.rootCursorPosition;
      return this.getParent().cursorPosition;
    },

    depth() {
      return this.gaps.length
    },

    nodes() {
      if (this.isRoot) {
        return this.getNodes(this.modelValue);
      }

      return this.getParent().nodes[this.parentInd].children;
    },

    /**
   * gaps is using for nodes indentation
   * @returns {number[]}
   */
    gaps() {
      const gaps = [];
      let i = this.level - 1;
      i++;
      while (i-- > 0) gaps.push(i);
      return gaps;
    },

    isRoot() {
      return !this.level
    },

    selectionSize() {
      return this.getSelected().length;
    },

    dragSize() {
      return this.getDraggable().length;
    }
  },
  methods: {
    setCursorPosition(pos) {
      if (this.isRoot) {
        const node = pos ? pos.node : null;
        if (this.dragToRoot && (node?.isLeaf && node?.level === 1 || pos?.placement === 'after')) {
          // Drag hovering over root
          this.rootCursorPosition = {
            node: {
              pathStr: '',
              isLeaf: false,
              path: node.path,
              data: {
                id: 'root',
              },
            },
            placement: 'inside',
          };
        }  else {
          this.rootCursorPosition = node ? { node: this.getClosestFolder(node), placement: 'inside' } : null;
        }
        return;
      }
      this.getParent().setCursorPosition(pos);
    },

    getNodes(nodeModels, parentPath = []) {

      return nodeModels.map((nodeModel, ind) => {
        const nodePath = parentPath.concat(ind);
        return this.getNode(nodePath, nodeModel, nodeModels);
      })
    },

    getNode(
      path,
      nodeModel = null,
      siblings = null,
    ) {
      const ind = path.slice(-1)[0];

      // calculate nodeModel, siblings fields if it is not passed as arguments
      siblings = siblings || this.getNodeSiblings(this.modelValue, path);
      nodeModel = nodeModel || (siblings && siblings[ind]) || null;

      if (!nodeModel) return null;

      const isDraggable = nodeModel.isDraggable; // nodeModel.isDraggable ? true : !!nodeModel.isDraggable;
      const isSelectable = nodeModel.isSelectable; // nodeModel.isSelectable ? true : !!nodeModel.isSelectable;

      const node = {

        // define the all ISlTreeNodeModel props
        // title: nodeModel.title,
        isLeaf: !!nodeModel.isLeaf,
        children: nodeModel.children ? this.getNodes(nodeModel.children, path) : [],
        isDraggable,
        isSelectable,
        data: nodeModel.data !== undefined ? nodeModel.data : {},
        // define the all ISlTreeNode computed props
        path: path,
        pathStr: JSON.stringify(path),
        level: path.length,
        ind,
        // isFirstChild: ind == 0,
        // isLastChild: ind === siblings.length - 1
      };
      return node;
    },

    getClosestFolder(node) {
      const { path, isLeaf } = node || {};
      const isNested = path?.length > 1;
      if (isLeaf && isNested) {
        const parentPath = path.slice(0, -1);
        return this.getNode(parentPath);
      }
      return node;
    },

    emitSelect(selectedNodes, event) {
      this.getRoot().$emit('update:selectedIds', selectedNodes.map(x => x.data.id));
    },

    emitBeforeDrop(draggingNodes, position, cancel) {
      this.getRoot().$emit('beforedrop', draggingNodes, position, cancel);
    },

    emitDrop(draggingNodes, position, event) {
      this.getRoot().$emit('drop', draggingNodes, position, event);
    },

    emitToggle(toggledNode, event) {
      // this.getRoot().$emit('toggle', toggledNode, event);
      this.getRoot().$emit(
        'update:expandedIds',
        this.expandedIds.includes(toggledNode.data.id)
          ? this.expandedIds.filter(x => x !== toggledNode.data.id)
          : [...this.expandedIds, toggledNode.data.id]
      );
    },

    select(path, addToSelection = false, event = null) {
      const multiselectKeys = Array.isArray(this.multiselectKey) ?
        this.multiselectKey:
        [this.multiselectKey];
      const multiselectKeyIsPressed = event && !!multiselectKeys.find(key => event[key]);
      addToSelection = (multiselectKeyIsPressed || addToSelection) && this.allowMultiselect;

      const selectedNode = this.getNode(path);
      if (!selectedNode) return null;
      const newNodes = this.modelValue; // this.copy(this.modelValue);
      const shiftSelectionMode = this.allowMultiselect && event && event.shiftKey && this.lastSelectedNode;
      const selectedNodes = [];
      let shiftSelectionStarted = false;

      this.traverse((node, nodeModel) => {
        let isSelected = addToSelection ? this.selectedIds.includes(node.data.id) : false;

        if (shiftSelectionMode) {
          if (node.pathStr === selectedNode.pathStr || node.pathStr === this.lastSelectedNode.pathStr) {
            isSelected = node.isSelectable;
            shiftSelectionStarted = !shiftSelectionStarted;
          }
          if (shiftSelectionStarted) isSelected = node.isSelectable;
        } else if (node.pathStr === selectedNode.pathStr) {
          const shouldDeselect = this.selectedIds.includes(node.data.id) && multiselectKeyIsPressed;
          isSelected = shouldDeselect ? false : node.isSelectable;
        } else if (!addToSelection && isSelected) {
          isSelected = false;
        }

        if (isSelected) selectedNodes.push(node);

      }, newNodes);

      this.lastSelectedNode = selectedNode;
      // this.emitInput(newNodes);
      this.emitSelect(selectedNodes, event);
      return selectedNode;
    },

    onMousemoveHandler(event) {
      if (!this.isRoot) {
        this.getRoot().onMousemoveHandler(event);
        return;
      }

      if (this.preventDrag) return;

      const initialDraggingState = this.isDragging;
      const isDragging =
        this.isDragging || (
        this.mouseIsDown &&
        (this.lastMousePos.x !== event.clientX || this.lastMousePos.y !== event.clientY)
      );

      const isDragStarted = initialDraggingState === false && isDragging === true;

      this.lastMousePos = {
        x: event.clientX,
        y: event.clientY
      };

      if (!isDragging) return;

      if (!this.rootBcr) this.setRootBcr();
      const $dragInfo = this.$refs.dragInfo;
      const dragInfoTop = event.clientY; // (event.clientY - rootRect.top + $root.scrollTop - ($dragInfo.style.marginBottom | 0) );
      const dragInfoLeft = event.clientX; // (event.clientX - rootRect.left);

      $dragInfo.style.top = dragInfoTop + 'px';
      $dragInfo.style.left = dragInfoLeft + 'px';

      const cursorPosition = this.getCursorPositionFromCoords(event.clientX, event.clientY);
      const destNode = cursorPosition.node;
      let placement = cursorPosition.placement;

      if (isDragStarted && !this.selectedIds.includes(destNode.data.id)) {
        this.select(destNode.path, false, event);
      }

      // This approach fixes dragging of nodes when no node has been selected yet.
      // SelectedIds is still empty so we need to spread it before the value has had time to emit and pass down as an updated prop
      const draggableNodes = this.getDraggable([...this.selectedIds, destNode.data.id]);
      if (!draggableNodes.length) {
        this.preventDrag = true;
        return;
      }

      this.isDragging = isDragging;

      if (this.dragToRoot) {
        placement = !event.target.closest('.vue-tree-node') && !!event.target.closest('.vue-tree-root') ? 'after' : placement;
      }

      this.setCursorPosition({ node: destNode, placement });

      const scrollBottomLine = this.rootBcr.bottom - this.scrollAreaHeight;
      const scrollDownSpeed = (event.clientY - scrollBottomLine) / (this.rootBcr.bottom - scrollBottomLine);
      const scrollTopLine = this.rootBcr.top + this.scrollAreaHeight;
      const scrollTopSpeed = (scrollTopLine - event.clientY) / (scrollTopLine - this.rootBcr.top);

      if (scrollDownSpeed > 0) {
        this.startScroll(scrollDownSpeed);
      } else if (scrollTopSpeed > 0) {
        this.startScroll(-scrollTopSpeed)
      } else {
        this.stopScroll();
      }
    },

    getCursorPositionFromCoords(x, y) {
      const $target = document.elementFromPoint(x, y);
      const $nodeItem = $target.getAttribute('path') ? $target : this.getClosetElementWithPath($target);
      let destNode;

      if ($nodeItem) {
        destNode = this.getNode(JSON.parse($nodeItem.getAttribute('path')));
      } else {
        if (!this.rootBcr) this.setRootBcr();
        if (y > this.rootBcr.top + (this.rootBcr.height / 2)) {
          destNode = this.getLastNode();
        } else {
          destNode = this.getFirstNode();
        }
      }

      return { node: destNode, placement: 'inside' };
    },

    getClosetElementWithPath($el) {
      if (!$el) return null;
      if ($el.getAttribute('path')) return $el;
      return this.getClosetElementWithPath($el.parentElement);
    },

    onMouseleaveHandler(event) {
      if (!this.isRoot || !this.isDragging) return;
      // TODO Set to root
      this.setCursorPosition({ node: this.getFirstNode(), placement: 'after'});
    },

    getNodeEl(path) {
      this.getRoot().$el.querySelector(`[path="${JSON.stringify(path)}"]`);
    },

    getLastNode() {
      let lastNode  = null;
      this.traverse((node) => {
        lastNode = node;
      });
      return lastNode;
    },

    getFirstNode() {
      return this.getNode([0]);
    },

    setRootBcr() {
      const $root = document.getElementById('listContainer');
      this.rootBcr = $root.getBoundingClientRect();
    },

    onNodeMousedownHandler(event, node) {
      // handle only left mouse button
      if (event.button !== 0) return;

      if (!this.isRoot) {
        this.getRoot().onNodeMousedownHandler(event, node);
        return;
      }
      this.mouseIsDown = true;
    },

    startScroll(speed) {
      const $root = document.getElementById('listContainer'); // .getRoot().$el;
      if (this.scrollSpeed === speed) {
        return;
      } else if (this.scrollIntervalId) {
        this.stopScroll();
      }

      this.scrollSpeed = speed;
      this.scrollIntervalId = setInterval(() => {
        $root.scrollTop += this.maxScrollSpeed * speed;
      }, 20);
    },

    stopScroll() {
      clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = 0;
      this.scrollSpeed = 0;
    },

    onDocumentMouseupHandler(event) {
      if (this.isDragging) this.onNodeMouseupHandler(event);
    },

    onNodeMouseupHandler(event, targetNode = null) {
      // handle only left mouse button
      if (event.button !== 0) return;

      if (!this.isRoot) {
        this.getRoot().onNodeMouseupHandler(event, targetNode);
        return;
      }

      this.mouseIsDown = false;

      if (!this.isDragging && targetNode && !this.preventDrag) {
        this.select(targetNode.path, false, event);
      }

      this.preventDrag = false;

      if (!this.cursorPosition) {
        this.stopDrag();
        return;
      };

      const draggingNodes = this.getDraggable();

      // check that nodes is possible to insert
      for (let draggingNode of draggingNodes) {
        if (draggingNode.pathStr == this.cursorPosition.node.pathStr) {
          this.stopDrag();
          return;
        }

        if (this.checkNodeIsParent(draggingNode, this.cursorPosition.node)) {
          this.stopDrag();
          return;
        }
      }

      const newNodes = this.modelValue; // this.copy(this.modelValue);
      const nodeModelsSubjectToInsert = [];

      // find dragging model to delete
      for (let draggingNode of draggingNodes) {
        const sourceSiblings = this.getNodeSiblings(newNodes, draggingNode.path);
        const draggingNodeModel = sourceSiblings[draggingNode.ind];
        nodeModelsSubjectToInsert.push(draggingNodeModel);
      }

      // allow the drop to be cancelled
      let cancelled = false;
      this.emitBeforeDrop(draggingNodes, this.cursorPosition, () => cancelled = true);

      if (cancelled) {
          this.stopDrag();
          return;
      }

      const nodeModelsToInsert = [];

      // mark dragging model to delete
      for (let draggingNodeModel of nodeModelsSubjectToInsert) {
          nodeModelsToInsert.push(this.copy(draggingNodeModel));
      }

      if (!this.cursorPosition.node.isLeaf) {
        this.$emit('dragTo', { payload: nodeModelsToInsert.map(x => x.data.id), to: this.cursorPosition.node.data.id });
      }

      this.lastSelectedNode = null;
      // this.emitInput(newNodes);
      this.emitDrop(draggingNodes, this.cursorPosition, event);
      this.stopDrag();
    },

    onToggleHandler(event, node) {
      if (!this.allowToggleBranch) return;

      // this.updateNode(node.path, { isExpanded: !node.isExpanded });
      this.emitToggle(node, event);
      event.stopPropagation();
    },

    stopDrag() {
      this.isDragging = false;
      this.mouseIsDown = false;
      this.setCursorPosition(null);
      this.stopScroll();
    },
    onEsc(e) {
      if (![27, 'Escape'].includes(e.key)) return;
      this.stopDrag();
    },

    getParent() {
      return this.$parent;
    },

    getRoot() {
      if (this.isRoot) return this;
      return this.getParent().getRoot();
    },

    getNodeSiblings(nodes, path) {
      if (path.length === 1) return nodes;
      return this.getNodeSiblings(nodes[path[0]].children, path.slice(1));
    },

    getSelected() {
      const selectedNodes = [];
      this.traverse((node) => {
        if (this.selectedIds.includes(node.data.id)) selectedNodes.push(node);
      });
      return selectedNodes;
    },

    getDraggable(items) {
      const draggedNodes = [];
      const selectedIds = items || this.selectedIds
      this.traverse((node) => {
        if (selectedIds.includes(node.data.id) && node.isDraggable) draggedNodes.push(node);
      });
      return draggedNodes;
    },


    traverse(
      cb,
      nodeModels = null,
      parentPath = []
    ) {
      if (!nodeModels) nodeModels = this.modelValue;

      let shouldStop = false;

      const nodes = [];

      for (let nodeInd = 0; nodeInd < nodeModels.length; nodeInd++) {
        const nodeModel = nodeModels[nodeInd];
        const itemPath = parentPath.concat(nodeInd);
        const node = this.getNode(itemPath, nodeModel, nodeModels);
        shouldStop = cb(node, nodeModel, nodeModels) === false;
        nodes.push(node);

        if (shouldStop) break;

        if (nodeModel.children) {
          shouldStop = this.traverse(cb, nodeModel.children, itemPath) === false;
          if (shouldStop) break;
        }
      }

      return !shouldStop ? nodes : false;
    },

    checkNodeIsParent(sourceNode, destNode) {
      const destPath = destNode.path;
      return JSON.stringify(destPath.slice(0, sourceNode.path.length)) == sourceNode.pathStr;
    },

    copy(entity) {
      return JSON.parse(JSON.stringify(entity));
    }

  }
};
</script>
<style lang="scss">
.drop-indicator-bg {
  position: absolute;
  pointer-events: none;
  content: '';
  left: calc(var(--depth) * var(--treeGap));
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 5px;
  background-color: hsl(218, 100%, 95%);
  box-shadow: inset 0 0 0 1px hsla(218, 100%, 50%, 0.2);
}

.vue-tree {
  --treeGap: 20px;
  position: relative;
  cursor: default;
  user-select: none;

}

.vue-tree-node.vue-tree-cursor-inside {
  position: relative;
  &::before {
    @extend .drop-indicator-bg;
  }
}

.vue-tree-root > .vue-tree-nodes-list {
  overflow: hidden;
  width: 100%;
  position: relative;
  padding-bottom: 4px;
  &.vue-tree-cursor-inside::before {
    @extend .drop-indicator-bg;
    left: 0;
  }
}

.vue-tree-node-list,
.vue-tree-node-item {
  position: relative;
  display: flex;
  flex-direction: row;
}

.vue-tree-gap {
  width: var(--treeGap);
  min-height: 1px;
}

.vue-tree-sidebar {
  margin-left: auto;
}

</style>

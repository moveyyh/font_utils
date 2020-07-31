import _ from "lodash";

export class Tree {
  constructor({ nodeName = "节点", child = [] } = {}) {
    this.root = {
      id: "root",
      child,
    };
    this.nodeName = nodeName;
  }

  /* 添加、修改、删除方法 */
  addNode(parentId, child) {
    let parentNode;

    if (!parentId) parentNode = this.root;
    else parentNode = this.getItemById(parentId);

    parentNode.child && parentNode.child.push(this._createNode(child));
  }

  // 通过id删除项
  deleteById(id, parentNode) {
    if (!parentNode) {
      const path = this.getNodePathById(id);
      if (path && path.length > 1) {
        // 获取父节点
        parentNode = path[path.length - 2];
      }
    }

    if (!parentNode) return;

    const index = parentNode.child.findIndex((item) => item.id === id);

    if (~index) {
      parentNode.child.splice(index, 1);
    }
  }

  // 添加节点下的元素
  appendChild({ id, parentId, name } = {}) {
    if (!id) return;

    // 将id添加到对应的节点中
    const parentNode = parentId ? this.getItemById(parentId) : this.root;

    if (parentNode && parentNode.child) {
      const itemNode = this.getItemById(id);

      if (itemNode) {
        // 删除id原node中的值
        this.deleteById(id);

        parentNode.child.push(itemNode);
      } else {
        parentNode.child.push(this._createItem(id, name));
      }
    }
  }

  /* 获取方法 */
  getNodePathById(id) {
    const path = [];

    if (!id) return path;

    const getNodePath = (child) => {
      let isChildFind; // 子孙节点中存在
      path.push(child);

      if (child.id === id) {
        return true;
      }

      if (child.child && child.child.length > 0) {
        for (let i = 0; !isChildFind && i < child.child.length; i++) {
          isChildFind = getNodePath(child.child[i]);
        }
      }

      //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
      if (!isChildFind) path.pop();

      return isChildFind;
    };
    getNodePath(this.root);

    return path;
  }

  // 获取节点下一级id
  getSubChildrenByNodeId(id, { includeNode = false } = {}) {
    if (!id) return [];

    const node = this.getItemById(id);
    let child = node && node.child ? node.child : [];

    if (!includeNode) child = child.filter((item) => item.nodeType !== "node");

    return child;
  }

  // 获取节点下所有子孙的id
  getAllChildrenByNodeId(id, { includeNode = false } = {}) {
    let res = [];

    if (!id) return res;

    const node = this.getItemById(id);

    if (!node || (node && node.nodeType !== "node")) return res;

    const collectNodes = (child) => {
      child.forEach((item) => {
        res.push(item);
        item.child && collectNodes(item.child);
      });
    };

    collectNodes(node.child || []);

    if (!includeNode) res = res.filter((item) => item.nodeType !== "node");

    return res;
  }

  // 获取所有的节点
  getAllNode() {
    const nodes = [];

    const collectNodes = (child) => {
      child.forEach((item) => {
        if (item.nodeType === "node") {
          nodes.push(item);
          collectNodes(item.child);
        }
      });
    };

    collectNodes(this.root.child);

    return nodes;
  }

  // 通过id 找到对应项
  getItemById(id) {
    return this._getItemById(this.root, id);
  }

  _createItem(id, name) {
    return {
      id,
      name,
      nodeType: "item",
    };
  }

  _createNode(child = []) {
    let createIndex = 1;
    const maxIndex = 10000;
    const nodes = this.getAllNode();
    const nodesMap = _.countBy(nodes, (nodes) => nodes.createIndex);

    while (nodesMap[createIndex]) {
      createIndex++;
      if (createIndex > maxIndex) break;
    }

    return {
      id: Math.uuid(20),
      name: `${this.nodeName}${createIndex}`,
      nodeType: "node",
      createIndex, // 创建顺序，用于集合的数字
      child,
    };
  }

  // 根据id查找节点
  _getItemById(item, id) {
    if (item.id == id) {
      return item;
    } else if (item.child && item.child.length > 0) {
      let result = null;
      for (let i = 0; result == null && i < item.child.length; i++) {
        result = this._getItemById(item.child[i], id);
      }
      return result;
    }
    return null;
  }

  // 导入数据数据
  importRoot(root) {
    this.root = root;
  }

  // 导出数据数据
  exportRoot() {
    return this.root;
  }
}

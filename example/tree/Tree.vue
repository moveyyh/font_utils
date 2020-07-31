<template>
  <div class="home">
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <span>树结构</span>
      </el-header>

      <el-main>
        <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                ref="tree"
              >
              </el-tree>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="6">
                  <el-input
                    v-model="addNodeParentId"
                    label="添加节点的父节点ID"
                  ></el-input>
                  <el-button @click="addNode">添加节点</el-button>
                </el-col>
                <el-col :span="6">
                  <el-input
                    v-model="findParanetId"
                    label="查找id对应节点"
                  ></el-input>

                  <el-button @click="getItemById">查找id对应节点</el-button>
                </el-col>
                <el-col :span="6">
                  <el-input
                    v-model="getNodePathId"
                    label="通过ID获取path"
                  ></el-input>

                  <el-button @click="getPathById">通过ID获取path</el-button>
                </el-col>
                <el-col :span="6">
                  <el-input
                    v-model="deleteId"
                    label="通过ID获取path"
                  ></el-input>

                  <el-button @click="deleteById">通过ID删除元素</el-button>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="appendItemId" label="添加元素"></el-input>
                  <el-input
                    v-model="appendParentId"
                    label="添加元素"
                  ></el-input>

                  <el-button @click="appendItem">添加元素</el-button>
                </el-col>
                <el-col :span="6">
                  <el-input
                    v-model="getSubChildNodeId"
                    label="获取下一级对象"
                  ></el-input>
                  <el-form-item label="是否包括节点">
                    <el-radio-group v-model="getSubChildrenIncludeNode">
                      <el-radio :label="true"></el-radio>
                      <el-radio :label="false"></el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-button @click="getSubChildrenByNodeId"
                    >获取下一级对象</el-button
                  >
                </el-col>
                <el-col :span="6">
                  <el-input
                    v-model="getAllChildrenNodeId"
                    label="获取节点下所有对象"
                  ></el-input>
                  <el-form-item label="是否包括节点">
                    <el-radio-group v-model="getAllChildrenIncludeNode">
                      <el-radio :label="true"></el-radio>
                      <el-radio :label="false"></el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-button @click="getAllChildrenByNodeId"
                    >获取节点下所有对象</el-button
                  >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-button @click="saveTreeData">保存树结构数据</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button @click="importTreeData">导入树结构数据</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Tree } from "@/assets/js/tree.js";

export default {
  name: "Home",

  data() {
    const tree = new Tree();
    return {
      tree,
      sizeForm: {},
      treeData: tree.root.child,
      addNodeParentId: "",
      findParanetId: "",
      getNodePathId: "",
      deleteId: "",
      appendItemId: "",
      appendParentId: "",
      getSubChildNodeId: "",
      getSubChildrenIncludeNode: false,
      getAllChildrenNodeId: "",
      getAllChildrenIncludeNode: false,
      defaultProps: {
        children: "child",
        label: "id",
      },
    };
  },

  methods: {
    addNode(id, parent) {
      this.tree.addNode(this.addNodeParentId);
    },
    getItemById() {
      const res = this.tree.getItemById(this.findParanetId);
      console.log(res);
    },
    getPathById() {
      const res = this.tree.getNodePathById(this.getNodePathId);
      console.log(res);
    },
    deleteById() {
      const res = this.tree.deleteById(this.deleteId);
      console.log(res);
    },
    appendItem() {
      const res = this.tree.appendChild({
        id: this.appendItemId,
        parentId: this.appendParentId,
      });
      console.log(res);
    },
    getSubChildrenByNodeId() {
      const res = this.tree.getSubChildrenByNodeId(this.getSubChildNodeId, {
        includeNode: this.getSubChildrenIncludeNode,
      });
      console.log(res.map(item => item.id).join(','));
    },
    getAllChildrenByNodeId() {
      const res = this.tree.getAllChildrenByNodeId(this.getAllChildrenNodeId, {
        includeNode: this.getAllChildrenIncludeNode,
      });
      console.log(res.map(item => item.id).join(','));
    },
    saveTreeData() {
      const tree = this.tree.exportRoot();
      localStorage.setItem("treeData", JSON.stringify(tree));
    },
    importTreeData() {
      this.tree.importRoot(JSON.parse(localStorage.getItem("treeData")));
      this.treeData = this.tree.root.child;
    },
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

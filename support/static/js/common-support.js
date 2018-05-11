
var treeItemTemplate = '<li :class="{active: model.id===activeId, selectable: model.selectable}">'+
                            '<div class="item" v-on:click.stop="selectNode(model.id, model.selectable)">'+
                                '<div @click="toggle" class="left">'+
                                    '<span v-if="isFolder" class="folder-icon">{{ model.open? "-" : "+" }}</span>'+
                                    '<i v-if="isFolder" class="icon-folder-open"></i>'+
                                    '<label v-if="model.checkbox">'+
                                        '<input type="checkbox" class="ace" :value="model.id" v-model="father.relation.selectedIds">'+
                                        '<span class="lbl">{{ model.name }}</span>'+
                                    '</label>'+
                                    '{{ model.checkbox ? "" : model.name }}'+
                                '</div>'+
                                '<div class="right" v-if="hasAction">'+
                                    '<a href="javascript:;" @click.stop="orderChange(model.id, index, index-1)">'+
                                        '<i class="icon-long-arrow-up"></i>'+
                                    '</a>'+
                                    '<a href="javascript:;" @click.stop="orderChange(model.id, index, index+1)">'+
                                        '<i class="icon-long-arrow-down"></i>'+
                                    '</a>'+
                                    '<a href="javascript:;" @click.stop="addItem(model.id)">'+
                                        '<i class="icon-plus"></i>'+
                                    '</a>'+
                                    '<a href="javascript:;" @click.stop="editItem(model.id)">'+
                                        '<i class="icon-pencil"></i>'+
                                    '</a>'+
                                    '<a href="javascript:;" @click.stop="deleteItem(model.id)">'+
                                        '<i class="icon-trash"></i>'+
                                    '</a>'+
                                '</div>'+
                                '<div class="right" v-else>'+
                                    '<span class="tip" v-if="model.tip">{{ model.tip }}</span>'+
                                '</div>'+
                            '</div>'+
                            '<ul v-show="model.open" v-if="isFolder" class="children">'+
                                '<tree-item v-for="(m, i) in model.children" :model="m" :index="i" :active-id="activeId" :has-action="hasAction" '+
                                '@delete="father.delContent" @add="father.addContent" @edit="father.editContent"></tree-item>'+
                            '</ul>'+
                        '</li>';

// 树形菜单组件
var treeItem = {
    name: 'tree-item',
    template: treeItemTemplate,
    props: {
        model: Object, //规定model的类型
        index: [String, Number],
        activeId: null,
        hasAction: null
    },
    data: function() {
        return {
            // open: this.model.open || false,
            father: spItem
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                // this.open = !this.open
                if (!this.model.hasOwnProperty("open")) this.father.$set(this.model, "open", false);
                this.model.open = !this.model.open;
            }
        },
        orderChange: function (id, index, tindex) {
            this.$emit("move", id);
            var node = getNode(this.father.details.treeData, id),
                arr = node.parentNode ? node.parentNode.children : this.father.details.treeData;
            if (tindex < 0 || tindex >= arr.length) return;
            var url = this.father.details.moveUrl;
            var data = {
                "from": index,
                "to": tindex
            }
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                data: data,
                success: function (res) {
                    if (res.state === "ok") {
                        arrOrderMove(arr, index, tindex);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error);
                }
            });
        },
        deleteItem: function (id) {
            this.$emit("delete", id);
        },
        addItem: function (nodeId) {
            this.$emit("add", nodeId);
        },
        editItem: function (nodeId) {
            this.$emit("edit", nodeId);
        },
        selectNode: function (nodeId, selectable) {
            if (this.activeId==-1) return;
            if(selectable) {
                var node = getNode(this.father.details.treeData, nodeId);
                this.father.details.activeId = node.node ? nodeId : 0;
                if (this.father.details.noAction) this.father.relation.nodeName = node.node.name;
                this.father.selectNode(nodeId);
            }
        }

    }
}

var spItem = new Vue({
    el: "#spContent",
    data: {
        "items": [],
        "details": {},
        "detailContent": { "isShow": false},
        "relation": {}
    },
    components: {
        "tree-item": treeItem
    },
    methods: {
        // 激活选项
        optionActive: function(id, item) {
            item.activeId = id;
            var active = [];
            this.items.forEach(function(v){
                active[v.name] = v.activeId;
            });
            this.$emit("optionActive", active);
        },
        // 删除选项
        optionRemove: function (index, editselected) {
            editselected.splice(index, 1);
        },
        // 保存选项
        editSave: function (item) {
            // 保存的数据
            var data = [];
            data['name'] = item.name;
            data['selectedIds'] = getIdsArr(item.editSelect.selected).concat(getIdsArr(item.editSelect.selecting, 0));
            // 保存选项 事件
            this.$emit('optionSave', data, function(){
                item.editSelect.selecting = [];
                item.isEdit = false;
                item.options.forEach(function(v, index){
                    v.isSelected = data.selectedIds.indexOf(v.id) !== -1;
                });
            });
        },
        // 编辑
        itemEdit: function(item) {
            var selected = [];
            item.options.forEach(function (v, index) {
                if (v.isSelected) {
                    selected.push({"id": v.id, "name": v.name});
                }
            });

            if (item.hasOwnProperty("editSelect")){
                item.editSelect.selected = selected;
            }else{
                this.$set(item, "editSelect", {
                    "selected": selected,
                    "selecting": []
                });
            }
            item.isEdit = true;
        },
        // 取消编辑
        editCancel: function (item) {
            item.editSelect.selecting = [];
            item.isEdit = false;
        },
        // 添加选择框
        addSelect: function (item) {
            item.editSelect.selecting.push({"id": 0});
        },
        // 设置选项
        selectOptions: function (curId, item) {
            var ops = [];
            var ids = getIdsArr(item.editSelect.selected).concat(getIdsArr(item.editSelect.selecting));
            item.options.forEach(function (v, index) {
                if (ids.indexOf(v.id) == -1 || v.id==curId ) {
                    ops.push(v);
                }
            });
            return ops;
        },
        // 删除
        delContent: function (id) {
            var _this = this, msg = "";
            _this.details.activeId = id || 0;
            if(id) {
                
                msg = "您确定要删除" + getPN(id) + "吗？";
            }else{
                msg = "您确定要删除" + _this.details.title + "目录吗？";
            }
            
            function getPN(id){
                var node = getNode(_this.details.treeData, id),
                    name = node.node.name,
                    p = node.parentNode;
                if(p) name = getPN(node.parentNode.id) + name;
                return name;
            }

            this.detailContent = {
                "isShow": true,
                "title": "删除",
                "action": "delete",
                "msg": msg
            }
            // 删除
            // if (id) {
            //     var node = getNode(spItem.details.treeData, id),
            //         parent = node.parentNode ? node.parentNode.children : spItem.details.treeData,
            //         index = parent.indexOf(node.node);
            //     parent.splice(index, 1);
            // } else {
            //     spItem.details.treeData = [];
            // }
        },
        // 添加
        addContent: function (nodeId) {
            // this.$emit("addContent");
            var node = getNode(this.details.treeData, nodeId);
            this.details.activeId = node.node ? nodeId : 0;

            var select = [], up = [];
            if (node.parentNode){
                up = node.parentNode.children;
            }else if(node.node){
                up = this.details.treeData;
            }
            if(up){
                up.forEach(function (v) {
                    select.push({ "name": v.name, "val": v.id });
                });
            }

            var input = [];
            input.push({ "title": "目录名称", "value": "", "name": "name"});
            if (select[0]) { //存在上级目录时
                input.push({
                    "title": "上级目录",
                    "value": node.node.id,
                    "select": select,
                    "name": "upperId"
                });
            }

            this.detailContent = {
                "isShow": true,
                "title": "添加",
                "action": "add",
                "input": input
            }

        },
        // 另存为
        saveAs: function() {
            // this.$emit("saveAs");
            this.details.activeId = 0;
            var input = [];
            this.items.forEach(function (v) {
                var select = [];
                v.options.forEach(function(i){
                    if (i.isSelected){
                        select.push({
                            "name": i.name,
                            "val": i.id
                        });
                    }
                });
                input.push({
                    "title": v.title,
                    "name": v.name,
                    "value": v.activeId,
                    "select": select
                });
            });
            this.detailContent = {
                "isShow": true,
                "title": "另存为",
                "action": "save_as",
                "input": input
            }
        },
        // 编辑
        editContent: function (nodeId) {
            // this.$emit("editContent");
            var node = getNode(this.details.treeData, nodeId);
            this.details.activeId = node.node ? nodeId : 0;

            var select = [], up = [];
            if (node.parentNode) {
                p = getNode(this.details.treeData, node.parentNode.id).parentNode;
                up = p ? p.children : this.details.treeData;
            }
            if (up) {
                up.forEach(function (v) {
                    select.push({ "name": v.name, "val": v.id });
                });
            }

            var input = [];
            input.push({ "title": "目录名称", "value": node.node.name, "name": "name" });
            if (select[0]) { //存在上级目录时
                input.push({
                    "title": "上级目录",
                    "name": "upperId",
                    "value": node.parentNode.id,
                    "select": select
                });
            }

            this.detailContent = {
                "isShow": true,
                "title": "修改",
                "action": "edit",
                "input": input
            }
        },
        // 选择节点
        selectNode: function (nodeId){
            this.$emit("selectNode", nodeId);
        },
        // 提交
        submitContent: function() {
            this.$emit("submitContent");
        },
        // 取消编辑内容
        cancelContent: function () {
            this.detailContent.isShow = false;
            this.details.activeId = 0;
        },
        // 保存关系
        saveRelation: function() {
            var data = {};
            data["nodeId"] = this.details.activeId;
            data["selectedIds"] = this.relation.selectedIds;
            this.$emit("saveRelation", data);
        }
        
    }
});

// 获取id的集合, 除了except之外
function getIdsArr(arr, except) {
    if(arguments.length==2){
        var ids = [];
        arr.forEach(function(v){
            if(v.id!==except) ids.push(v.id);
        });
        return ids;
    }else{
        return arr.map(function (v) {
            return v.id;
        });
    }
}

// 数组序号移动
function arrOrderMove(arr, index, tindex) {
    if (index > tindex) {
        arr.splice(tindex, 0, arr[index]);
        arr.splice(index + 1, 1)
    } else {
        arr.splice(tindex + 1, 0, arr[index]);
        arr.splice(index, 1)
    }
}

// 根据NodeID查找当前节点以及父节点
function getNode(json, nodeId) {
    var parentNode = null;
    var node = null;

    function nodes(json, nodeId){
        //1.第一层 root 深度遍历整个JSON
        for (var i = 0; i < json.length; i++) {
            if (node) {
                break;
            }
            var obj = json[i];
            //没有就下一个
            if (!obj || !obj.id) {
                continue;
            }
            //2.有节点就开始找，一直递归下去
            if (obj.id === nodeId) {
                node = obj; //找到了与nodeId匹配的节点，结束递归
                break;
            } else {
                //3.如果有子节点就开始找
                if (obj.children) {
                    // parentNode = obj; //4.递归前，记录当前节点，作为parent 父亲
                    nodes(obj.children, nodeId);  //递归往下找
                    if (node&&!parentNode){
                        parentNode = obj;
                        return false;
                    }
                } else {
                    continue; //跳出当前递归，返回上层递归
                }
            }
        }
        //5.如果木有找到父节点，置为null，因为没有父亲  
        if (!node) {  
            parentNode = null;
        }
    }
    nodes(json, nodeId);

    return {
        parentNode: parentNode,
        node: node
    };
}


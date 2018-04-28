
var treeItem = {
    name: 'tree-item',
    template: '#tree-item-template',
    props: {
        model: Object, //规定model的类型
        index: [String, Number],
        parent: Object,
        moveurl: String,
        treedata: Object
    },
    data: function() {
        return {
            open: false
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
                this.open = !this.open
            }
        },
        orderChange: function (arr, index, tindex) {
            if (tindex < 0 || tindex >= arr.length) return;
            var url = this.moveurl;
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
        deleteItem: function (parent, index) {
            this.$emit("delete", parent, index);
        },
        addItem: function (nodeId) {
            this.$emit("add", nodeId);
        },
        editItem: function () {
            this.$emit("edit");
        }

    }
}


var spItem = new Vue({
    el: "#spContent",
    data: {
        "items": [],
        "details": {},
        "detailContent": {}
    },
    components: {
        "tree-item": treeItem
    },
    computed:{
        
    },
    methods: {
        // 激活选项
        optionActive: function(id, item) {
            item.activeId = id;
            var active = [];
            this.items.forEach(function(v){
                active.push(v.activeId);
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
            data['selectedIds'] = getIdsArr(item.editSelect.selected).concat(getIdsArr(item.editSelect.selecting), 0);
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
                    selected.push({"id": v.id, "val": v.val});
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
        // 选择框 改变
        selectChange: function() {
            
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
        delContent: function (parent, index) {
            this.$emit("delContent", parent, index);
        },
        // 添加
        addContent: function (nodeId) {
            // this.$emit("addContent");
            var node = getNode(this.details.treeData, nodeId);
            console.log(node);
            var select = [];
            if(node.parentNode){
                node.parentNode.children.forEach(function(v){
                    select.push({
                        "name": v.name,
                        "val": v.id
                    });
                });
                this.detailContent = {
                    "isShow": true,
                    "title": "添加",
                    "input": [
                        {
                            "name": "目录名称",
                            "value": ""
                        },
                        {
                            "name": "上级目录",
                            "value": node.node.id,
                            "select": select
                        }
                    ]
                }
            }else{
                this.detailContent = {
                    "isShow": true,
                    "title": "添加",
                    "input": [
                        {
                            "name": "目录名称",
                            "value": ""
                        }
                    ]
                }
            }
            
        },
        // 另存为
        saveAs: function() {
            this.$emit("saveAs");
        },
        // 编辑
        editContent: function() {
            this.$emit("editContent");
        },
        // 提交
        submitContent: function() {
            this.$emit("submitContent");
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
            if (obj.id == nodeId) {
                node = obj; //找到了与nodeId匹配的节点，结束递归
                break;
            } else {
                //3.如果有子节点就开始找
                if (obj.children) {
                    parentNode = obj; //4.递归前，记录当前节点，作为parent 父亲
                    nodes(obj.children, nodeId);  //递归往下找
                } else {
                    continue; //跳出当前递归，返回上层递归
                }
            }
        }
    }
    nodes(json, nodeId);
    
    if (!node) {  //5.如果木有找到父节点，置为null，因为没有父亲  
        parentNode = null;
    }

    return {
        parentNode: parentNode,
        node: node
    };
}
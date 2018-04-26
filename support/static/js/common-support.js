
var spItem = new Vue({
    el: "#spContent",
    data: {
        "items": [],
        "details": []
    },
    components: {
       
    },
    computed:{
        
    },
    methods: {
        // 激活选项
        optionActive: function(id, item) {
            item.activeId = id;
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
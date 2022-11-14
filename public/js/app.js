import ajax from "./util.js";

//开始
let list = undefined;

var type = "all";

//box = container
var box = document.querySelector(".todoapp");
// box.innerHTML = template("tmp", {});
bindHtml();

const pillsTab = document.querySelector("#pills-tab");
const pills = pillsTab.querySelectorAll('button[data-bs-toggle="pill"]');

pills.forEach((pill) => {
  pill.addEventListener("shown.bs.tab", (event) => {
    const { target } = event;
    const { id: targetId } = target;
    savePillId(targetId);
  });
});

const savePillId = (selector) => {
  localStorage.setItem("activePillId", selector);
};
const getPillId = () => {
  console.log(pills);
  const activePillId = localStorage.getItem("activePillId");
  if (!activePillId) return; //activePillId="csm-100";
  const someTabTriggerEl = document.querySelector(`#${activePillId}`);
  const tab = new bootstrap.Tab(someTabTriggerEl);

  tab.show();
};

function getdata() {
  ajax({
    url: "/action",
    type: "post",
    data: { action: "fetch" },
    dataType: "json",
    async: false,
    success(res) {
      return (list = res.data);
    },
  });
}

// 2 Render function
function bindHtml() {
  getdata();
  var bindlist = list;

  switch (type) {
    case "all":
      bindlist = list;
      break;
    case "active":
      bindlist = list.filter(function (t) {
        return t.isFinish == false;
      }); //!t.isFinish
      break;
    case "completed":
      bindlist = list.filter(function (t) {
        return t.isFinish == true;
      });
  }

  // joblists for csm100 csm38 and engineering
  var aList = bindlist.filter(function (t) {
    return t.jobType == "A";
  });
  aList.sort((a, b) => a.jobNo - b.jobNo);
  aList.forEach(function (t, index) {
    return (t.jobNo = index + 1);
  });

  var bList = bindlist.filter(function (t) {
    return t.jobType == "B";
  });
  bList.sort((a, b) => a.jobNo - b.jobNo);
  bList.forEach(function (t, index) {
    return (t.jobNo = index + 1);
  });

  var eList = bindlist.filter(function (t) {
    return t.jobType == "E";
  });
  eList.sort((a, b) => a.jobNo - b.jobNo);
  eList.forEach(function (t, index) {
    return (t.jobNo = index + 1);
  });

  //计算所有未完成的数量
  var activeNum = list.filter(function (t) {
    return !t.isFinish;
  }).length;
  //number of csm100 job
  var activeANum = list.filter(function (t) {
    return !t.isFinish & (t.jobType == "A");
  }).length;
  var activeBNum = list.filter(function (t) {
    return !t.isFinish & (t.jobType == "B");
  }).length;
  var activeENum = list.filter(function (t) {
    return !t.isFinish & (t.jobType == "E");
  }).length;

  let aLength = aList.length;
  let bLength = bList.length;
  let eLength = eList.length;

  let pillId = localStorage.getItem("activePillId") || "pills-csm100-tab";
  box.innerHTML = template("tmp", {
    bindlist,
    pillId,
    activeNum,
    activeANum,
    activeBNum,
    activeENum,
    aList,
    aLength,
    bList,
    bLength,
    eList,
    eLength,
    length: list.length,
    type,
  });

  // console.log(bLength);
  // console.log(pillId);
  window.localStorage.setItem("activePillId", pillId);

  //window.localStorage.setItem("todos", JSON.stringify(list));
}
//根据地址栏哈希值改变显示
window.addEventListener("hashchange", function (e) {
  type = window.location.hash.slice(2) || "all";
  bindHtml();
});

//4 事件委托的形式添加
// box.addEventListener("keydown", function (e) {
//   e = e || window.event;
//   var target = e.target || e.srcElement;
//   var code = e.keyCode || e.which;

//   if (target.className === "new-todo" && code === 13) {
//     //拿到文本框里的内容 非空验证 组装一个对象 push到数组 表单置空（inerHtml 渲染时自动，操作节点时 需要手动置kong）

//     var text = target.value.trim();
//     if (!text) return;
//     var id = 0;

//     if (list.length) {
//       id = list[list.length - 1].id + 1;
//     } else {
//       id = 1;
//     }
//     list.push({ id: id, content: text, isFinish: false, isEdit: false });
//     bindHtml();
//   }
//   //10 在编辑的文本里回车  确认编辑  如果文本为空 删除  不为空 修改
//   if (target.className === "edit" && code === 13) {
//     var text = target.value.trim();
//     var id = target.dataset.id - 0;
//     if (!text) {
//       list = list.filter(function (item) {
//         return item.id !== id;
//       });
//     } else {
//       var todo = list.find(function (t) {
//         return t.id === id;
//       });
//       todo.content = text;
//       todo.isEdit = false;
//     }
//     bindHtml();
//   }

//   //取消编辑
//   if (target.className === "edit" && code === 27) {
//     var id = target.dataset.id - 0;
//     var todo = list.find(function (t) {
//       return t.id === id;
//     });
//     todo.isEdit = false;
//     bindHtml();
//   }
// });

//5 事件的委托形式出现点击

box.addEventListener("click", function (e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (target.dataset.key === "done") {
    let id = target.dataset.id - 0;
    let todo = list.find(function (t) {
      return t.id === id;
    });

    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id,
        field: "isFinish",
        value: todo.isFinish ? 0 : 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });
    // ajax({
    //   url: "/action",
    //   type: "post",
    //   data: { action: "queryOne", id },
    //   dataType: "json",
    //   async: false,
    //   success(res) {
    //     console.log(res.data);
    //   },
    // });
    bindHtml();
  }
  if (target.dataset.key === "mandrelOD") {
    let id = target.dataset.id - 0;
    let todo = list.find(function (t) {
      return t.id === id;
    });
    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id,
        field: "mandrelIsOrdered",
        value: todo.mandrelIsOrdered ? 0 : 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });
    bindHtml();
  }
  if (target.dataset.key === "mandrelRD") {
    let id = target.dataset.id - 0;
    let todo = list.find(function (t) {
      return t.id === id;
    });
    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id,
        field: "mandrelIsReady",
        value: todo.mandrelIsReady ? 0 : 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });
    bindHtml();
  }
  if (target.dataset.key === "materialRD") {
    let id = target.dataset.id - 0;
    let todo = list.find(function (t) {
      return t.id === id;
    });
    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id,
        field: "materialIsReady",
        value: todo.materialIsReady ? 0 : 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });
    bindHtml();
  }
  if (target.dataset.key === "materialOD") {
    let id = target.dataset.id - 0;
    let todo = list.find(function (t) {
      return t.id === id;
    });
    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id,
        field: "materialIsOrdered",
        value: todo.materialIsOrdered ? 0 : 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });
    bindHtml();
  }

  if (target.dataset.key === "up") {
    let id = target.dataset.id - 0;

    let todo = list.find(function (t) {
      return t.id === id;
    });

    if (todo.jobNo == 0) {
      return;
    }

    list.forEach(function (t) {
      if (t.jobType === todo.jobType && t.jobNo === todo.jobNo - 1) {
        ajax({
          url: "/action",
          type: "post",
          data: {
            action: "updateOne",
            id: t.id,
            field: "jobNo",
            value: t.jobNo + 1,
          },
          dataType: "json",
          async: false,
          success(res) {
            console.log("updated");
          },
        });
        return;
      }
    });

    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id: todo.id,
        field: "jobNo",
        value: todo.jobNo - 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });

    bindHtml();
  }
  if (target.dataset.key === "down") {
    let id = target.dataset.id - 0;
    let todo = list.find(function (t) {
      return t.id === id;
    });

    list.forEach(function (t) {
      if (t.jobType === todo.jobType && t.jobNo === todo.jobNo + 1) {
        ajax({
          url: "/action",
          type: "post",
          data: {
            action: "updateOne",
            id: t.id,
            field: "jobNo",
            value: t.jobNo - 1,
          },
          dataType: "json",
          async: false,
          success(res) {
            console.log("updated");
          },
        });
      }
    });
    // 此处有bug 最大值设限制
    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "updateOne",
        id: todo.id,
        field: "jobNo",
        value: todo.jobNo + 1,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("updated");
      },
    });
    bindHtml();
  }

  //此处有bug 数据库不应该删除
  if (target.dataset.key === "del") {
    let id = target.dataset.id - 0;

    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "deleteOne",
        id: id,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("delete");
      },
    });
    bindHtml();
  }

  //target.dataset.type 或许可以查询到 type list 的长度
  if (target.dataset.key === "clear-completed") {
    let delList = list.filter(
      (t) => {return (t.jobType == target.dataset.type && t.isFinish)}
    );

    // console.log(delList)
    delList.forEach((item) => {
      ajax({
        url: "/action",
        type: "post",
        data: {
          action: "deleteOne",
          id: item.id,
        },
        dataType: "json",
        async: false,
        success(res) {
          console.log("delete");
        },
      });
    });
    bindHtml();
  }

  //add
  if (target.dataset.key === "add") {
    let materialElement = null
    if (target.dataset.type=="E"){
       materialElement = target.parentElement.previousElementSibling
       
    }
    else {materialElement = target.parentElement.previousElementSibling.previousElementSibling}
    // console.log(target.parentElement.previousElementSibling)
    
    let processElement = materialElement.previousElementSibling
    let qtyElement = processElement.previousElementSibling
    let jobNameElement = qtyElement.previousElementSibling
    let customerElement = jobNameElement.previousElementSibling
console.log(customerElement.firstElementChild)
    let customer = customerElement.firstElementChild.value.trim();
    let jobName = jobNameElement.firstElementChild.value.trim();
    let qty = qtyElement.firstElementChild.value.trim();
    let process = processElement.firstElementChild.value.trim();
    let material = materialElement.firstElementChild.value.trim();
    // let test = target.parentElement.previousElementSibling.previousElementSibling
    // let test1= test.previousSibling.innerHTML
    console.log(target,materialElement.firstElementChild.value)
    console.log(customer,jobName,qty,process,material,target.dataset.type)
    let jobNo = list.filter(item=>{return item.jobType==target.dataset.type}).length

    if (!customer || !jobName || !qty || !process || !material) return;
    ajax({
      url: "/action",
      type: "post",
      data: {
        action: "addOne",
        jobType: target.dataset.type,
        jobNo,
      customer,
      jobName,
      qty,
      process,
      material,
      materialIsReady: false,
      materialIsOrdered: false,
      mandrelIsReady: false,
      mandrelIsOrdered: false,
      isFinish: false,
      isEdit: false,
      },
      dataType: "json",
      async: false,
      success(res) {
        console.log("added");
      },
    });
  
     bindHtml();
  }
});

//9 进入编辑状态 双击事件委托

box.addEventListener("dblclick", function (e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  let originalValue = target.innerHTML;
  let inputCount = document.getElementsByClassName("active-input");
  if (
    inputCount.length == 0 &&
    (target.dataset.key === "customer" ||
      target.dataset.key === "jobName" ||
      target.dataset.key === "qty" ||
      target.dataset.key === "process")
  ) {
    let field =target.dataset.key
    let input = document.createElement("input");
    target.innerHTML = "";
    target.appendChild(input);
    input.setAttribute("class", "active-input");
    let width = target.offsetWidth;
    // console.log(width);
    //此处宽度跟着变化  不好使 需要修正
    input.setAttribute("style", "width:" + width + "px");
    input.value = originalValue;
    input.focus();
    input.onblur = function () {
      target.innerHTML = input.value;
      let id = target.dataset.id - 0;
      // let todo = list.find(function (t) {
      //   return t.id === id;
      // });
      console.log(target.dataset.key,input.value)  
      ajax({
        url: "/action",
        type: "post",
        data: {
          action: "updateOne",
          id,
          field,
          value: input.value
        },
        dataType: "json",
        async: false,
        success(res) {
          console.log("updated");
        },
      });
      // todo[target.dataset.key] = input.value;
      bindHtml();
    };
  }
  if (inputCount.length == 0 && target.dataset.key === "material") {
    let input = document.createElement("input");
    target.innerHTML = "";
    target.appendChild(input);
    input.setAttribute("class", "active-input");
    let index = originalValue.indexOf("<button");
    input.value = originalValue.slice(0, index).trim();
    input.focus();
    input.onblur = function () {
      target.innerHTML = input.value;
      let id = target.dataset.id - 0;
      
      ajax({
        url: "/action",
        type: "post",
        data: {
          action: "updateOne",
          id,
          field:"material",
          value: input.value
        },
        dataType: "json",
        async: false,
        success(res) {
          console.log("updated");
        },
      });
      bindHtml();
    };
  }
});

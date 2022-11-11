const express = require("express");

var router = express.Router();

var db = require("../sql");
// router.get("database", (req, res) => {

//   res.send('database')
//   // var query = "SELECT * FROM Autobend_jobs";
//   // db.query(query, function (error, data) {
//   //   if (error) {
//   //     throw error;
//   //   } else {
//   //     console.log(data);
//   //     res.render("index", { sampledata: data });
//   //   }
//   // });
// });

// router.get("/", (req, res) => {
//   var query = "SELECT * FROM Autobend_jobs";
//   db.query(query, function (error, data) {
//     if (error) {
//       throw error;
//     } else {
//       console.log(data);
//       res.render("index", { sampledata: data });
//     }
//   });
// });

router.get("/", (req, res) => {
  res.render("home", {});
});

router.post("/action", function (req, res) {
  var action = req.body.action;
  var field = req.body.field;
  var id = req.body.id;
  var newValue = req.body.value;
  if (action == "fetch") {
    var query = "SELECT * FROM Autobend_jobs";
    db.query(query, function (error, data) {
      if (error) {
        throw error;
      } else {
        res.json({
          data: data,
        });
      }
    });
  }

  if (action == "queryOne") {
    console.log(id);
    var query = `SELECT * FROM Autobend_jobs WHERE id = ${id}`;
    console.log(query);
    db.query(query, function (error, data) {
      if (error) {
        throw error;
      } else {
              res.json({ data: data });
             }
    });
  }

  if (action == "addOne") {
    let{jobType,jobNo,customer, jobName,qty,process,material,materialIsReady,materialIsOrdered,mandrelIsReady,mandrelIsOrdered,isFinish,isEdit}=req.body

// console.log(jobType,jobNo,customer, jobName,qty,process,material,materialIsReady,materialIsOrdered,mandrelIsReady,mandrelIsOrdered,isFinish,isEdit) 

db.query(`INSERT INTO Autobend_jobs VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,? )`,[0,jobType,jobNo,customer, jobName,qty,process,material,materialIsReady,materialIsOrdered,mandrelIsReady,mandrelIsOrdered,isFinish,isEdit],(error,data)=>{
  if (error) {
        throw error;
      } else {
       res.json({});
      }

} )
   
 
  }

  if (action == "updateOne") {
    
    var query = `UPDATE Autobend_jobs SET ${field} = "${newValue}" WHERE id = ${id}`;
    console.log(query);

    db.query(query, function (error, data) {
      if (error) {
        throw error;
      } else {
       res.json({});
      }
    });
  }

  if (action == "deleteOne") {
    console.log("DELETE" + id);
    var query = `DELETE FROM Autobend_jobs WHERE id = ${id}`;
    console.log(query);
    db.query(query, function (error, data) {
      if (error) {
        throw error;
      } else {
       res.json({});
      }
    });
  }
});

router.post("/getdata", function (req, res) {
  console.log("getdata request");
});

router.put("/editjob", (req, res) => {
  console.log("put request");
});

router.delete("/deletejob", (req, res) => {
  console.log("delete a job");
});

module.exports = router;

const mysql = require('mysql')

const db = mysql.createPool({
  host:'13.211.232.130',
  port:3306,
  user:'root',
  password:'root',
  database:'Autobend'
})

db.getConnection((error)=>{
  if(error){
    throw error
  }
  else{
    console.log('db connected successfully')
  }

})

module.exports = db;

// const dbO={

//   queryAll(cb){
//     db.query('SELECT * FROM Autobend_jobs',(err,data)=>{
//       if (err) return console.log(err)
    
//       cb(data)
//     })
//   },
  
//   queryOne(id){
//     console.log(`SELECT * FROM Autobend_jobs WHERE id = ${id}`)
//     db.query(`SELECT * FROM Autobend_jobs WHERE id = ${id}`,(err,data)=>{
//       if (err) return console.log(err)
    
//       console.log(data) 
//     })
//   },

//    insertOne(jobType,jobNo,customer, jobName,qty,process,material,materialIsReady,materialIsOrdered,mandrelIsReady,mandrelIsOrdered,isFinish,isEdit)
//    {
//     db.query(`INSERT INTO Autobend_jobs VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,? )`,[0,jobType,jobNo,customer, jobName,qty,process,material,materialIsReady,materialIsOrdered,mandrelIsReady,mandrelIsOrdered,isFinish,isEdit],(err,data)=>{
//         if (err) return console.log(err)
        
//         console.log("One job added")
      
//       } )
//    },

//    updateOne(id,field,newValue){
//     db.query(`UPDATE Autobend_jobs SET ${field} = "${newValue}" WHERE id = ${id}`,(err,data)=>{
//       if (err) return console.log(err)
      
//       console.log("Updated one")
//       console.log(data)
    
//     } )
//    }
  
// }
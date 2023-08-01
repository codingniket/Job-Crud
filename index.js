const express = require("express");
const fs = require('fs')
const cors = require("cors")
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const jsonData = fs.readFileSync('./jobs.json', "utf-8");
const jobData = JSON.parse(jsonData);

app.get("/", (req, res) => {
  res.status(200).send("Job Board Api")
})

app.get("/job", (req, res) => {
  res.send(jobData)
})

app.get("/job/jobqueryparams" , (req,res) =>
  {
   const {id ,location} = req.body;
    const response = jobData.find( (myjob) =>
      
        myjob.id === id && myjob.location === location
      );
    if(response)
  {
    res.status(200).send(response);
  }
  else
  {
    res.status(404).send("Error Bro Job nahi ha itna");
  }
  })

app.post("/job/jobqueryparams" , (req,res) =>
  {
    const {id ,location} = req.body;
    const response = jobData.filter( (myjob) =>
      
         myjob.location === location
      );
    
    if(response)
  {
    res.status(200).send(response);
  }
  else
  {
    res.status(400).send("Error Bro Job nahi ha itna");
  }
  })

app.get("/job/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const response = jobData[id];
  if(response)
  {
    res.send(response);
  }
  else
  {
    res.status(404).send("Error Bro Job nahi ha itna")
  }
})

app.post("/job/addnew" , (req,res) =>
  {
    const { id , company , jobTitle , postedOn , location} = req.body;
    const newdata =  { id , company , jobTitle , postedOn , location};
    jobData.push(newdata);

    const isDuplicateId = jobData.some((myjob) => myjob.id === id)

    if(isDuplicateId)
    {
      res.status(400).send("Oops Id already exits") 
    }
    
    fs.writeFile("./jobs.json" , JSON.stringify(jobData) , (err) =>
      {
        if(err)
        {
          console.log(err);
          return;
        }
        else
        {
          res.status(200).send("Data Written");
        }
      });
  })

app.delete("/job/deletejob/", (req,res) =>
           {
             const idDel = parseInt(req.params.id);
  const index = jobData.findIndex((myjob) =>
    myjob.id === idDel);

             if(index === -1)
             {
               res.status(404).send("Not found");
               return;
             }

             jobData.splice(index,1)
              fs.writeFile("./jobs.json" , JSON.stringify(jobData) , (err) =>
      {
        if(err)
        {
          res.status(500).send("Error")
          return;
        }
             
             
           });
           })

app.listen(port, () => {
  console.log("Server Chalu Ha")
})
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");

connection  
    .authenticate()
    .then(() =>{
        console.log("connection have been sucessful!")
    })
    .catch((msgError) =>{
        console.log(msgError); 
    }) 

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/",(req,res) =>{
     Question.findAll({raw:true, order:[
        ['id','DESC']
     ]}).then(questions =>{
        res.render("index",{
            questions: questions
        });
     });
    

});

app.get("/questions",(req,res) => {
    res.render("questions");
});
    
app.post("/saveanswer", (req,res) =>{
    var title = req.body.title;
    var description = req.body.description;

    Question.create({
        title: title,
        description: description
    }).then(() =>{
            res.redirect("/");
    });
   /* res.send("Formulario recebido! title " + title + " " + " description " + description); */
});


app.get("/question/:id", (req,res) =>{
    var id = req.params.id;
    Question.findOne({
        where: {id: id}
    }).then(question =>{
        if(question != undefined){
            res.render("question",{
                question: question

            });
        }else{
            res.redirect("/");
        }
});
})

app.listen(8080,function(erro){
    if(erro){
        console.log("ocorreu um erro!");       
    }else{
        console.log("servidor iniciado com sucesso!");
    }
})
const express= require("express");
const app = express();
const bodyParser=  require("body-parser");
const cors= require("cors");

app.use(cors());

//setting bodyParser for capture forms
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var DB = {
        games:
    [
        {id:1,
        title: "Need for Speed",
        year:2005,
        price:98},

        {id:2,
        title: "Call of Duty MW ",
        year:2010,
        price:150
        },

        {id:3,
        title: "Spider man Remastered",
        year:2019,
        price:200}
    ],
    users:
    [
        {id:5 ,
        name: "bruce",
        email:"bruce@gmail.com",
        password: "reidelas"}
    ]

}

app.get("/games",(req,res)=>{
    res.statusCode= 200;
    res.json(DB.games);
});

app.get("/game/:id",(req,res)=>{
    if(isNaN(req.params.id)){
        res.statusCode=400;
        res.send("Id must be a number!")
    }else{
        var id = parseInt(req.params.id);

        var game = DB.games.find(game => game.id ==id);
        
        if(game !=undefined){
            res.statusCode= 200;
            res.send(game);
        } else {
            res.sendStatus(404);
        }
    }
    
    
    
}); 

app.post("/games",(req,res)=>{
    var {title, year , price} = req.body;

    DB.games.push({
        id: 2301,
        title,
        year,
        price
    });

    res.sendStatus(200);
});

app.delete("/game/:id", (req,res)=>{

    if(isNaN(req.params.id)){
        res.statusCode=400;
        res.send("Id must be a number!")
    }else{
        var id = parseInt(req.params.id);

        var index = DB.games.findIndex(game => game.id ==id);
        
        if(index<=-1){
            res.sendStatus(404)
        } else {
            DB.games.splice(index,1);
            res.sendStatus(200);
        }
    }
    

});

app.put("/game/:id",(req,res)=>{
    if(isNaN(req.params.id)){
        res.statusCode=400;
        res.send("Id must be a number!")
    }else{
        var id = parseInt(req.params.id);

        var game = DB.games.find(game => game.id ==id);
        
        if(game !=undefined){
            res.sendStatus(200);
            
            var {title,year,price} = req.body;

                if(title !=undefined){
                    game.title = title; 
                }
                if(year != undefined){
                    game.year= year
                }
                if(price !=undefined){
                    game.price= price
                } 

        } else {
            res.sendStatus(404);
        }
    }
}); 

app.post("/auth",(req,res)=>{
    var {id,name,email,password} = req.body;

    var emailCheck= DB.users.find(e =>e.email == email);
    
    
    if(emailCheck != undefined){
        if( password == emailCheck.password){
            res.statusCode=200;
            res.send("Token Falso");
        }else{
            res.statusCode=400;
            res.send("Senha inválida, tente novamente");
        }
    }else{
        res.statusCode=400;
        res.send("Email inválido");
    }
})




app.listen("5000", ()=>{
    console.log("Server running");
});
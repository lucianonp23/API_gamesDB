const express= require("express");
const app = express();
const bodyParser=  require("body-parser");
const cors= require("cors");
const jwt = require("jsonwebtoken");

var jwtSecret= "huaicanclkcamslcçm";

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
        password: "bigdog"}
    ]

}

app.get("/games",auth,(req,res)=>{
    res.statusCode= 200;
    res.json(DB.games);
    
});

app.get("/game/:id",auth,(req,res)=>{
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

app.delete("/game/:id",auth, (req,res)=>{

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

app.put("/game/:id",auth,(req,res)=>{
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
    var {email,password} = req.body;

    var emailCheck= DB.users.find(e =>e.email == email);
    
    
    if(emailCheck != undefined){
        if( password == emailCheck.password){
            
            jwt.sign({id: emailCheck.id, name: emailCheck.name},jwtSecret,{expiresIn:"48h"},(error,token)=>{
                if(error){
                    res.statusCode= 400;
                    res.json(error);
                }else{
                    res.statusCode= 200;
                    res.json(token);
                }
            });
            
            
        }else{
            res.statusCode=400;
            res.send("Senha inválida, tente novamente");
        }
    }else{
        res.statusCode=400;
        res.send("Email inválido");
    }
})

/*TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6ImJydWNlIiwiaWF0IjoxNjgzMTM3MzM1LCJleHAiOjE2ODMzMTAxMzV9.KMnN5qwNYuXx0OL_2q0CCGcCNzr_E_3Q40JzFxXayCM*/
function auth(req,res,next){
    
    const headerAuth = req.headers["authorization"];
    if (headerAuth != undefined){
      var bearer= headerAuth.split(" ")[1];
    
    jwt.verify(bearer,jwtSecret,(err,data)=>{
        if(err){
            res.statusCode= 400;
            res.json({err: err})
        }else{
            res.statusCode= 200;
            req.token= data.token ; 
            req.loggedUser= {id: data.id, name: data.name}
            console.log(req.loggedUser);
            
            next()
        }
    })
    
    
    ;   
    } else{
        res.statusCode= 400;
        res.json({err: "No token found"})
        }
    
}


app.listen("5000", ()=>{
    console.log("Server running");
});
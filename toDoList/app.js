const express=require('express')
const bodyParser=require('body-parser')
const  date=require(__dirname +"/date.js")
const mongoose=require("mongoose")
const _=require("lodash")

const app=express();

app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/toDoListDB")
.then(()=>console.log("connection to mongodb is successful"))
.catch(err=>console.log("couldnot connect to mongoDB",err))

const itemsSchema={
    name:String
};

const Item=mongoose.model("Item",itemsSchema);


const item1=new Item({
    name:"Welcome to your ToDoList!!"   
});

const item2=new Item({
    name:"Click + button add a New List"
});

const item3=new Item({
    name:"<-- Click To Delete an Item from List"
});

const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemsSchema]
}

const List=mongoose.model("List",listSchema)

app.get("/",function(req,res){
    
Item.find({}).then((foundItems)=>{
    if (foundItems.length===0) {
        Item.insertMany(defaultItems).then(function(){
            console.log("Data inserted")  // Success
        }).catch(function(error){
            console.log(error)      // Failure
        });
        res.redirect("/")
    } 
    
    else {
        res.render("list", { listTitle:"Today",  newListItems:foundItems}) 
    }
    
})
    
});

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;

    const item=new Item({
        name:itemName
    })
    
    if(listName==="Today"){
        item.save();
        res.redirect("/")
    }
    else{
        List.findOne({name:listName})
        .then((foundList)=>{
            foundList.items.push(item)
            foundList.save()
            res.redirect("/custom/"+listName)
            }
        )
        }
    }
)
app.post("/delete",async  function(req,res){
    const itemCheckedId=req.body.checkbox
    const listName=req.body.listName
   if(listName==="Today"){
         await Item.findByIdAndRemove(itemCheckedId)
        .then(function(){
            console.log("successfuly deleted")
            res.redirect("/")
        });       
   }
   
   else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemCheckedId}}})
        .then(()=>{
            res.redirect("/custom/"+ listName)
        })           
   }
 
})

app.get("/custom/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName)

      List.findOne({name:customListName})
      .then((foundList)=>{
        if(!foundList){
            const list=new List({
                name:customListName,
                items:defaultItems
            })
        
            list.save();
            res.redirect("/" + customListName)
        }
        else{
            res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
        }
          })

   


})


app.listen(3000,function(){
    console.log("server started in 3000")
})
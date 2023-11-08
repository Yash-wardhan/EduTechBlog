import express, { request } from 'express';
import { db, connectTodb } from './MongoDB/db.js'

const app = express(); // Create an instance of Express

app.use(express.json())

// app.get('/hello', (request, response) => {
//     console.log(request.body)
//     response.send(`hello ${request.body.name}`);
// });
// app.post('/post',(request,response)=>{
//     response.send('This is the Post method')
// })



//monogodb Connection
app.get('/api/articles/:name', async(request,response)=>{
    const { name } = request.params;
    
    //connect with local host MongoDb 
    const article = await db.collection('articles').findOne({ name });

    //if articles is not present
    if(article){
        response.json(article)
    }
    else{
        response.sendStatus(404)
    }
    console.log(article)
})

//upvotes
app.put('/api/articles/:name/upvote',async(request,response) =>{
    const { name } = request.params;
    // const article = articlesInfo.find(a => a.name === name)

    //again connect mongodb to database 



    //updates upvote +1
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes : 1 }
    })

    const article = await db.collection('articles').findOne({ name });
    if(article){
        response.send(`the ${name} article now has ${article.upvotes} upvotes!!!!!!!`);
    }
    else{
        response.send('That article doesnt exist');
    }
})

//comment 
app.post('/api/articles/:name/comment',async(request,response)=>{
    const { name } = request.params;
    const { byposted , text } = request.body

    //connect mongodb
    //user gives comments on articles comes from Mongodb/db.js
    await db.collection('articles').updateOne({ name },{
        $push: { comment:{byposted , text} }
    })

    //search articles with match aticles
    const article = await db.collection('articles').findOne({ name })
    if(article){
        response.send(article.comment)
        console.log(article.comment)
    }
    else{
        Response.send('this articles doesnt exist')
    }
})





// urlpattern 
// app.get('/hello/:name/goodbye/:othername',(request, response) =>{
//     console.log(request.params);
//     const { name } = request.params;  //resquest handle all url pattern
//     const { othername } = request.params;  //resquest handle all url pattern
//     response.send(`hello ${name}!!goodbye`)
// })


//connect mongodb

connectTodb(()=>{
    app.listen(8000, () => {
        console.log('Database connected Successfully')
        console.log('PORT No:8000 listen');
    });
})

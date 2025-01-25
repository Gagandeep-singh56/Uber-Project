const app=require('./app.js')
const http=require('http');
const port=process.env.PORT || 3000;  

const server=http.createServer(app);



server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
}) 

// modals ceratse krne hain toh phele flow understand kr leta hun git setup alse  
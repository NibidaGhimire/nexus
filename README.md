# Nexus
### A Research Paper Review Platform

Nexus is a platform designed to facilitate the review and discussion of research papers. It allows researchers to upload their papers, receive feedback from peers, and engage in meaningful discussions. The platform aims to improve the quality of research by providing a collaborative environment for researchers to share insights and critiques.


## How to run Locally:

On the project folder

> ``` npm install ```

#### Input PORT, MONGO_DB_URI, JWT_SECRET, NODE_ENV in ".env" file:
> PORT = 5000 

> MONGO_DB_URI =  your mongodb uri,

> JWT_SECRET = your jwt key

> NODE_ENV = development

#### Run server:
> ```npm run server```

### Backend Server will run at: [http://localhost:5000/](http://localhost:5000/)

#### Change the directory to projectFolder/Frontend:
> ```cd frontend```

#### Install npm packages:
> ```npm install```

#### Make a env file with URL:

eg: 
> VITE_API_URL=http://localhost:5000


#### Run the frontend:
> ```npm run dev```


### Frontend will run at: [http://localhost:3000/](http://localhost:3000/)
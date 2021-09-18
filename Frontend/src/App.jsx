import React, { Suspense } from "react";
import { Switch, Route, BrowserRouter, useParams } from "react-router-dom";

import  Home from "./components/Home.jsx";
import  Login  from "./components/Login.jsx";
import Catalogue  from "./components/Catalogue.jsx";
import  PostDetail  from "./components/PostDetail.jsx";
import Signup from "./components/Signup.jsx";
/*
    Components to make:
    - Search bar
    - Creat post
    - Post detail (put multiple post details components on the homepage then when you go on the redirect to a single post, show the one post detail component)
    - Header
    - Footer (optional)
    - Navigation menu 
    - Login form and buttons
    - Like, comment, share buttons
*/
export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/PostDetail/:id" component={PostDetail} />
        <Route path="/Catalogue/:pagenum" component={Catalogue} />
        {/* When user logs out, redirect to login */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  );
}

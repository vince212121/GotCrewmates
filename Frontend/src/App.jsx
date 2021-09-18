import React, { Suspense } from "react";
import { Switch, Route, BrowserRouter, useParams } from "react-router-dom";

import { Home } from "./Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Catalogue } from "./Catalogue";
import { PostDetail } from "./PostDetail";

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
        <Route path="/Login" component={Login} /> 
      </Switch>
    </BrowserRouter>
  );
}

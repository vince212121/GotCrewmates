import React, { Suspense } from "react";
import { Switch, Route, BrowserRouter, useParams } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Posting from "./components/Posting";
import Header from "./components/header";

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
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/posting/:id" component={Posting} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
    </BrowserRouter>
  );
}

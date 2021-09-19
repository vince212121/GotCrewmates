import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Posting from "./components/Posting";
import Header from "./components/header";
import User from "./components/User";
import NewPosting from "./components/NewPosting";
import Bar from "./components/searchBar"
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
      <div className="flex w-full justify-center">
        <Bar component = {Bar}></Bar>
        <div className="w-1/2 p-4">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/new-posting" component={NewPosting} />
            <Route path="/posting/:id" component={Posting} />
            <Route path="/user/:username" component={User} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

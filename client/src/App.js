import { useState } from "react";
import { Route, Switch } from "react-router";
import Home from "./Home"
import Login from "./Login";
import Navigation from "./Navigation";
import Register from "./Register";
import Tournament from "./Tournament";
import Me from "./Me";
import AddTournament from "./AddTournament";
import EditTournament from "./EditTournament";
import Scoreboard from "./Scoreboard";
import ActivateAccount from "./ActivateAccount";
import ResetPassword from "./ResetPassword";
import Footer from "./Footer";

export default function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Navigation user={user} setUser={setUser} />
      <Switch>
        <Route path='/register'>
          <Register />
        </Route>
        <Route path='/login'>
          <Login setUser={setUser} />
        </Route>
        <Route path='/activate/:link'>
          <ActivateAccount />
        </Route>
        <Route path='/resetPassword/:email/:restoration'>
          <ResetPassword />
        </Route>
        <Route path='/me'>
          <Me user={user} />
        </Route>
        <Route path='/match'>
          <Scoreboard />
        </Route>
        <Route path='/tournament/:id/edit'>
          <EditTournament user={user} />
        </Route>
        <Route path='/tournament/:id'>
          <Tournament user={user} />
        </Route>
        <Route path='/addTournament'>
          <AddTournament user={user} />
        </Route>
        <Route path='/notFound'>
          <p>Nie znaleziono strony</p>
        </Route>
        <Route path='/'>
          <Home user={user} />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

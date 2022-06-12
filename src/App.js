import {BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'
import Login from "./pages/Login";
import Layout from "@/pages/Layout"
import {AuthComponent} from "@/components/AuthComponent";
import './App.scss'
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Publish from "@/pages/Publish";
import {history} from "@/utils/history";

function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">

        <Routes>
          <Route path='/' element={<AuthComponent><Layout></Layout></AuthComponent>}>
            <Route index element={<Home></Home>}></Route>
            <Route path='/article' element={<Article></Article>}></Route>
            <Route path='publish' element={<Publish></Publish>}></Route>
          </Route>
          <Route path='/login' element={<Login></Login>}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  );
}

export default App;

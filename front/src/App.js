import loadable from '@loadable/component';
import { Routes, Route } from "react-router-dom";
import './App.css';


const Header = loadable(() => import('./components/header'));
const Footer = loadable(() => import('./components/footer'));
const Home = loadable(() => import('./containers/home'));
const Login = loadable(() => import('./containers/user/login'));
const Logout = loadable(() => import('./containers/user/logout'));
const Forgot = loadable(() => import('./containers/user/forgot'));
const InitPassword = loadable(() => import('./containers/user/initPassword'));
const Register = loadable(() => import('./containers/user/register'));
const Admin = loadable(() => import('./containers/admin/admin'));
const AddArticle = loadable(() => import('./containers/admin/article/addArticle'));
const EditArticle = loadable(() => import('./containers/admin/article/editArticle'));
const DetailArticle = loadable(() => import('./containers/detailArticle'));
const Contact = loadable(() => import('./containers/contact'));
const Galerie = loadable(() => import('./containers/galerie'));
const Academie = loadable(() => import('./containers/academie'));
const RequireAuth = loadable(() => import('./helpers/require-auth'));

function App() {
  return (
    <div className="App">
        <Header/>
        <Routes>
            <Route exact path="/" element={<RequireAuth child={Home} auth={false}/>}/>
            <Route exact path="/academie" element={<Academie />}/>
            <Route exact path="/login" element={<Login />}/>
            <Route exact path="/forgot" element={<Forgot />}/>
            <Route exact path="/initPassword" element={<InitPassword />}/>
            <Route exact path="/logout" element={<RequireAuth child={Logout} auth={true}/>}/>
            <Route exact path="/register" element={<RequireAuth child={Register} auth={true}/>}/>
            <Route exact path="/admin" element={<RequireAuth child={Admin} auth={true}/>}/>
            <Route exact path="/addArticle" element={<RequireAuth child={AddArticle} auth={true}/>}/>
            <Route exact path="/editArticle/:id" element={<RequireAuth child={EditArticle} auth={true}/>}/>
            <Route exact path="/detailArticle/:id" element={<DetailArticle />}/>
            <Route exact path="/galerie" element={<Galerie />}/>
            <Route exact path="/contact" element={<Contact />}/>
        </Routes>
        <Footer />
    </div> 
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// import pages
import Home from './Home'
import FoodsAdd from './FoodsAdd';
import Details from './Details';
import FoodsList from './FoodsList';
import AdminWaitFoodList from './AdminWaitFoodList';

// Router
const router = 
<Router>
  <Routes>
    <Route path='/' element={ <Home /> } />
    <Route path='/foodsAdd' element={ <FoodsAdd /> } />
    <Route path='/details/:url' element={ <Details/> } />
    <Route path='/foodsList' element={ <FoodsList/> } />
    <Route path='/waitFoodsList' element={ <AdminWaitFoodList/> } />
  </Routes>
</Router> 

ReactDOM.render( router,document.getElementById('root') );
reportWebVitals();
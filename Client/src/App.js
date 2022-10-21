import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Auth from './components/auth';
import Booking from './components/Booking';
import Events from './components/Events';
import MainNav from './components/Nav/MainNav';
import AuthContext from './context/auth-context';
import React, { Component } from 'react';
import Footer from './components/Nav/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

class App extends Component {

   state = {
    token:null,
    userID:null
  }
  login = (token, userID, tokenexpire) => {
    this.setState({token:token, userID:userID})
  }
  logout = () => {
    this.setState({token:null, userID:null})
  }
  render() { 
    return (
    <BrowserRouter>
    <AuthContext.Provider value={{
      token:this.state.token, 
      userID:this.state.userID, 
      login:this.login, 
      logout:this.logout
      }}>
    <MainNav/>
      <main className='main_region'>
      <Routes>
        {!this.state.token && <Route path='/' element = {<Navigate to='/auth'/>} />}

        {!this.state.token && <Route path='/bookings' element = {<Navigate to='/auth'/>} />}
        {this.state.token && <Route path='/' element = {<Navigate to='/events'/>} />}
        {this.state.token && <Route path='/auth' element = {<Navigate to='/events'/>} />}

        {!this.state.token && <Route path='/auth' element = {<Auth/>}/>}
        <Route path='/events' element = {<Events/>}/>
        {this.state.token &&  <Route path='/bookings' element = {<Booking/>}/>}
      </Routes>
      <ToastContainer/>
      </main>
      <Footer/>
      </AuthContext.Provider>
    </BrowserRouter>
  )}
}

export default App;

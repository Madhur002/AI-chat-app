import React from 'react'
import "./App.css";
import sideImg from "./images/hand-drawn-flat-groovy-psychedelic-background_23-2149074391.avif";
import { Link } from "react-router-dom";
import homeimg from "./images/arrow2.png";

const Home = () => {
    return (
        <div className='home-main'>
      <div className='side-image'>
      <p className='brand-name'>Taskly</p>
      <img className='side-img' src={sideImg} height="100%" width="30%"/>
      </div>
      <div className='main-area'>
        <p className='main-heading'>Taskly Ai</p>
        <p className='main-sub-heading'>An AI Powered todo generator</p>
        <div className='btn'>
      <img src={homeimg} className='arrow1' />
      <img src={homeimg} className='arrow2' />
      <Link  className="btn1" to="/protected" role="button">Sign In</Link>
        <Link  className="btn2" to="/sign-up" role="button">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default Home

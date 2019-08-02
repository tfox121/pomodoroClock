/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable quote-props */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {faArrowDown, faArrowUp, faPause, faPlay, faSyncAlt} from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class BreakLength extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        breakLength: 5
      }
      this.breakDecrement = this.breakDecrement.bind(this)
      this.breakIncrement = this.breakIncrement.bind(this)
  }

  componentDidMount() {
    this.props.breakCallbackFromParent(this.state.breakLength)
  }

  breakDecrement() {
    if (this.state.breakLength > 1) {
      this.setState({
        breakLength: this.state.breakLength - 1
      })
      this.props.breakCallbackFromParent(this.state.breakLength - 1)
    } else {
      this.setState({
        breakLength: this.state.breakLength
      })
    }
  }

  breakIncrement() {
    if (this.state.breakLength < 60) {
      this.setState({
        breakLength: this.state.breakLength + 1
      })
      this.props.breakCallbackFromParent(this.state.breakLength + 1)
    } else {
      this.setState({
        breakLength: this.state.breakLength
      })
    }
  }

  render() {
    return (
      <div id="break">
        <div id="break-label">Break Length</div>
        <br />
        <button id="break-decrement" onClick={this.breakDecrement}><FontAwesomeIcon icon={faArrowDown} /></button>
        <div id="break-length">{this.state.breakLength}</div>
        <button id="break-increment" onClick={this.breakIncrement}><FontAwesomeIcon icon={faArrowUp} /></button>
      </div>
    )
  }
}


class SessionLength extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        sessionLength: 25
      }
      this.sessionDecrement = this.sessionDecrement.bind(this)
      this.sessionIncrement = this.sessionIncrement.bind(this)
  }

  componentDidMount() {
    this.props.sessionCallbackFromParent(this.state.sessionLength)
  }

  sessionDecrement() {
    if (this.state.sessionLength > 1) {
      this.setState({
        sessionLength: this.state.sessionLength - 1
      })
      this.props.sessionCallbackFromParent(this.state.sessionLength - 1)
    } else {
      this.setState({
        sessionLength: this.state.sessionLength
      })
    }
  }

  sessionIncrement() {
    if (this.state.sessionLength < 60) {
      this.setState({
        sessionLength: this.state.sessionLength + 1
      })
      this.props.sessionCallbackFromParent(this.state.sessionLength + 1)
    } else {
      this.setState({
        sessionLength: this.state.sessionLength
      })
    }
  }

  render() {
    return (
      <div id="session">
        <div id="session-label">Session Length</div>
        <br />
        <button id="session-decrement" onClick={this.sessionDecrement}><FontAwesomeIcon icon={faArrowDown} /></button>
        <div id="session-length">{this.state.sessionLength}</div>
        <button id="session-increment" onClick={this.sessionIncrement}><FontAwesomeIcon icon={faArrowUp} /></button>
      </div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        timeLeft: 0,
        breakLength: 5,
        sessionLength: 25
      };
      this.passBreakState = this.passBreakState.bind(this)
      this.passSessionState = this.passSessionState.bind(this)
      this.finishTime = this.finishTime.bind(this)
      this.finishCheck = this.finishCheck.bind(this)
      this.timeLeft = this.timeLeft.bind(this)
      this.sessionStart = this.sessionStart.bind(this)
      this.breakStart = this.breakStart.bind(this)
      this.startStop = this.startStop.bind(this)
      this.reset = this.reset.bind(this)
  }

  passBreakState(data) {
    this.setState({ 
      breakLength: data
    })
  }

  passSessionState(data) {
    this.setState({ 
      sessionLength: data,
      timeLeft: data
    })
  }

  finishTime(mins) {
    let now = new Date()
    let finishTime = new Date()
    finishTime.setMinutes(now.getMinutes() + mins)
  
    return finishTime
  }
  
  timeLeft(finish) {
    let now = new Date()
    let secondsLeft = ((finish - now) / 1000).toFixed(0)
    let seconds = (secondsLeft % 60).toString().padStart(2, '0')
    let minutes = ((secondsLeft - seconds) / 60).toString().padStart(2, '0') 
    
    let timerStr = minutes + ":" + seconds
    console.log(timerStr)
    this.setState({
      timeLeft: timerStr
    })
  }
  
  finishCheck(finish) {
    let now = new Date()
  
    return finish > now
  }
  
  interval = null

  sessionStart(mins) {
    let sessionEnd = this.finishTime(mins)
    const sessionTimer = () => {
      if (this.finishCheck(sessionEnd)) {
        console.log("WORK!!!!!!")
        this.timeLeft(sessionEnd)
      } else {
        clearInterval(this.interval)
        this.breakStart()
      }
    }
    this.interval = window.setInterval(sessionTimer, 500)
  }
  
  breakStart(mins) {
    let breakEnd = this.finishTime(mins)
    const breakTimer = () => {
      if (this.finishCheck(breakEnd)) {
        console.log("BREAK TIME")
        this.timeLeft(breakEnd)
      } else {
        clearInterval(this.interval)
        this.sessionStart()
      }
    }
    this.interval = window.setInterval(breakTimer, 500)
  }

  startStop() {
    console.log(this.interval)
    if (this.interval === null) {
    this.sessionStart(this.state.sessionLength)
    } else {
      clearInterval(this.interval)
    }
  }

  reset() {
    clearInterval(this.interval)
    this.interval = null
    console.log(this.state.sessionLength)
    this.setState({
      timeLeft: this.state.sessionLength
    })
  }



  render() {
    return (
      <div className="row align-items-center justify-content-center bg-info">
        <div className="text-center">
            <div id="clock">
              <h1>Pomodoro Clock</h1>
                  <BreakLength breakCallbackFromParent={this.passBreakState} />
                  <SessionLength sessionCallbackFromParent={this.passSessionState} />
              
              <div id="timer">
                <div id="timer-label">Session</div>
                <div id="time-left">{this.state.timeLeft}</div>
              </div>
              <div id="controls">
                <button id="start_stop" onClick={this.startStop}><FontAwesomeIcon icon={faPlay} /><FontAwesomeIcon icon={faPause} /></button>
                <button id="reset" onClick={this.reset}><FontAwesomeIcon icon={faSyncAlt} /></button>
              </div>
            </div>
            <div id="post">Designed and coded by tom fox</div>
        </div>
      </div>
    );
  }
}

export default App;
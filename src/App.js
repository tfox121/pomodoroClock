/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable quote-props */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {faArrowDown, faArrowUp, faPause, faPlay, faSyncAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import React from 'react';

// Define React class that handles the rendering and setting of break length.
class BreakLength extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        breakLength: 5
      }
      this.breakDecrement = this.breakDecrement.bind(this)
      this.breakIncrement = this.breakIncrement.bind(this)
      this.reset = this.reset.bind(this)
  }

  // Runs passBreakState to set initial display & update parent state.
  componentDidMount() {
    this.props.breakCallbackFromParent(this.state.breakLength)
  }

  // Handles reset call from parent to ensure break length value resets to 5.
  reset() {
    this.setState({
      breakLength: 5
    }, () => {
      this.props.breakCallbackFromParent(this.state.breakLength)
    })
  }

  // Called by onClick handler to decrease break length.
  breakDecrement() {
    if (this.state.breakLength > 1 && this.props.timerEnd === null) {
      this.setState({
        breakLength: this.state.breakLength - 1
      }, () => {
        this.props.breakCallbackFromParent(this.state.breakLength)
      })
    }
  }

  // Called by onClick handler to increase break length.
  breakIncrement() {
    if (this.state.breakLength < 60 && this.props.timerEnd === null) {
      this.setState({
        breakLength: this.state.breakLength + 1
      }, () => {
        this.props.breakCallbackFromParent(this.state.breakLength)
      })
    }
  }

  render() {
    return (
      <div id="break">
        <div id="break-label">Break Length</div>
        <br />
        <button id="break-decrement" onClick={this.breakDecrement}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
        <div id="break-length">{this.state.breakLength}</div>
        <button id="break-increment" onClick={this.breakIncrement}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    )
  }
}

BreakLength.propTypes = {
  breakCallbackFromParent: PropTypes.func,
  timerEnd: PropTypes.instanceOf(Date)
}

// Define React class that handles the rendering and setting of session length.
class SessionLength extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        sessionLength: 25
      }
      this.sessionDecrement = this.sessionDecrement.bind(this)
      this.sessionIncrement = this.sessionIncrement.bind(this)
  }

  // Runs passSessionState to set initial display & update parent state.
  componentDidMount() {
    this.props.sessionCallbackFromParent(this.state.sessionLength)
  }

  // Handles reset call from parent to ensure break length value resets to 5.
  reset() {
    this.setState({
      sessionLength: 25
    }, () => {
      this.props.sessionCallbackFromParent(this.state.sessionLength)
    })
  }

  // Called by onClick handler to decrease session length.
  sessionDecrement() {
    if (this.state.sessionLength > 1 && this.props.timerEnd === null) {
      this.setState({
        sessionLength: this.state.sessionLength - 1
      }, () => {
        this.props.sessionCallbackFromParent(this.state.sessionLength)
      })
    } else {
      this.setState({
        sessionLength: this.state.sessionLength
      })
    }
  }

  // Called by onClick handler to increase session length.
  sessionIncrement() {
    if (this.state.sessionLength < 60 && this.props.timerEnd === null) {
      this.setState({
        sessionLength: this.state.sessionLength + 1
      }, () => {
        this.props.sessionCallbackFromParent(this.state.sessionLength)
      })
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
        <button id="session-decrement" onClick={this.sessionDecrement}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
        <div id="session-length">{this.state.sessionLength}</div>
        <button id="session-increment" onClick={this.sessionIncrement}>
          <FontAwesomeIcon icon={faArrowUp} />
          </button>
      </div>
    )
  }
}

SessionLength.propTypes = {
  sessionCallbackFromParent: PropTypes.func,
  timerEnd: PropTypes.instanceOf(Date)
}

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        timeLeft: 1500,
        timerLabel: "Session"
      };
      this.passBreakState = this.passBreakState.bind(this)
      this.passSessionState = this.passSessionState.bind(this)
      this.finishTime = this.finishTime.bind(this)
      this.timeLeft = this.timeLeft.bind(this)
      this.timerDisplay = this.timerDisplay.bind(this)
      this.sessionStart = this.sessionStart.bind(this)
      this.breakStart = this.breakStart.bind(this)
      this.startStop = this.startStop.bind(this)
      this.reset = this.reset.bind(this)
      this.alarmSound = this.alarmSound.bind(this)
      this.sessionElement = React.createRef()
      this.breakElement = React.createRef()
      this.beepRef = React.createRef()
      
  }

  sessionLength = 25

  breakLength = 5

  timerEnd = null
  
  pauseTime = null
  
  interval = null

  // Callback to take break length from child and set parent state.
  passBreakState(data) {
    this.breakLength = data
  }

  // Callback to take session length from child and set parent state.
  passSessionState(data) {
    this.timerEnd = null
    this.pauseTime = null
    this.sessionLength = data
    this.setState({
      timeLeft: this.timeLeft(this.finishTime(data * 60000))
    })
  }

  // Outputs finish time as datetime taking duration in milliseconds as input.
  finishTime(millisecs) {
    let now = new Date()
    let finishTime = new Date()
    finishTime.setMilliseconds(now.getMilliseconds() + millisecs)
  
    return finishTime
  }
  
  // Returns time left as mm:ss taking finish datetime as input
  timeLeft(finishTime) {
    let now = new Date()
    let secondsLeft = Number(((finishTime - now) / 1000).toFixed(0))

    return secondsLeft
  }

  timerDisplay() {
    let seconds = (this.state.timeLeft % 60).toString().padStart(2, '0')
    let minutes = ((this.state.timeLeft - seconds) / 60).toString().padStart(2, '0') 
    let timerStr = minutes + ":" + seconds

    return timerStr
  }

  // Initiates a Session timer taking duration in milliseconds as input.
  sessionStart(millisecs) { 
    this.setState({ 
      timerLabel: "Session"
    })
    this.timerEnd = this.finishTime(millisecs)
    // Defines setInterval callback. 
    const sessionTimer = () => {
      this.setState({
        timeLeft: this.timeLeft(this.timerEnd)
      }, () => {
        if (this.state.timeLeft === 0) {
          // Once timer has ended.
          this.alarmSound()
          clearInterval(this.interval)
          this.interval = null
          setTimeout(() => {
            this.breakStart(this.breakLength * 60000)
          }, 500);
        }
      })
    }
    // Initiates setInterval - Session timer begins.
    this.interval = window.setInterval(sessionTimer, 50)
  }
  
  // Initiates a Break timer taking duration in milliseconds as input.
  breakStart(millisecs) {
    this.setState({
      timerLabel: "Break"
    })
    this.timerEnd = this.finishTime(millisecs)
    // Defines setInterval callback. 
    const breakTimer = () => {
      this.setState({
        timeLeft: this.timeLeft(this.timerEnd)
      }, () => {
        if (this.state.timeLeft === 0) {
          // Once timer has ended.
          this.alarmSound()
          clearInterval(this.interval)
          this.interval = null
          setTimeout(() => {
            this.sessionStart(this.sessionLength * 60000)
          }, 500);
        }
      })
    }
    // Initiates setInterval - Session timer begins.
    this.interval = window.setInterval(breakTimer, 50)
  }

  // Called by onClick handler to selectively start/pause/unpause timer.
  startStop() {
    let now = new Date()
    if (this.timerEnd === null && this.pauseTime === null) {
      // Starts timer.
      this.sessionStart(this.sessionLength * 60000)
    } else if (this.pauseTime === null) {
      // Pauses timer.
      clearInterval(this.interval)
      this.pauseTime = (this.timerEnd - now)
      this.interval = null
      this.timerEnd = null 
      this.forceUpdate()
    } else {
      // Unpauses timer. Ensures correct timer is re-initialised.
        if (this.state.timerLabel === "Session") {
          this.sessionStart(this.pauseTime)
        } else {
          this.breakStart(this.pauseTime)
        }
      this.pauseTime = null
    }
  }

  // Called by onClick handler to reset all states to initial values.
  reset() {
    this.beepRef.current.pause()
    this.beepRef.current.currentTime = 0;
    clearInterval(this.interval)
    this.breakElement.current.reset()
    this.sessionElement.current.reset()
    this.interval = null
    this.setState({
      timerLabel: "Session",
    })
  }

  // Activates audio element when called.
  alarmSound() {
    this.beepRef.current.play()
  }

  render() {
    return (
      <div className="row align-items-center justify-content-center bg-info">
        <div className="text-center">
            <div id="clock">
              <h1>Pomodoro Clock</h1>
                  <BreakLength ref={this.breakElement} breakCallbackFromParent={this.passBreakState} timerEnd={this.timerEnd}/>
                  <SessionLength ref={this.sessionElement} sessionCallbackFromParent={this.passSessionState} timerEnd={this.timerEnd}/>
              <div id="timer">
                <div id="timer-label">{this.state.timerLabel}</div>
                <div id="time-left">{this.timerDisplay()}</div>
              </div>
              <div id="controls">
                <button id="start_stop" onClick={this.startStop}>
                  <FontAwesomeIcon icon={faPlay} />
                  <FontAwesomeIcon icon={faPause} />
                </button>
                <button id="reset" onClick={this.reset}>
                  <FontAwesomeIcon icon={faSyncAlt} />
                </button>
                <audio id="beep" preload="auto" ref={this.beepRef} src="https://www.freesfx.co.uk/sound/16901_1461333025.mp3" />
              </div>
            </div>
            <div id="post">Designed and coded by tom fox</div>
        </div>
      </div>
    );
  }
}

export default App;
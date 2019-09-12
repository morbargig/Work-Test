import axios from 'axios';
import React, { Component } from 'react';
import route from './config/route';

const code = " isHaveBraceEqualLetters = function (x) {    let name = x   let HaveBraceEqualLetters = false    for (let i = 0; i < name.length; i++) {      if (name[i] === name[i - 1]) {        name = name.replace(`${name[i]}`, \" \")       name = name.replace(`${name[i - 1]}`,  \"  \")       HaveBraceEqualLetters = true      }    }    return [HaveBraceEqualLetters, name]  },  SimpleBackendOperation = function () {\\    let result = sequelize.query(\"SELECT * FROM `test`.`users`\").spread(function (data, metadata) {      console.log(data)      for (let i of data) {       let answer = isHaveBraceEqualLetters(i.name)        if (answer[0]) {          sequelize.query(`UPDATE users SET name = '${answer[1]}' WHERE name = '${i.name}'`).spread(function (results, metadata) {          })        }      }      return data    })    return Promise.resolve(result)  }"


class AppName extends Component {
  constructor() {
    super()
    this.state = {
      answer21Code: code
    }
  }

  answer1 = async (e) => {
    let name = e.target.id
    // console.log(name)
    let x = this.state[name]
    const res = await axios.get(`${route}${name}`)
    // console.log(res, name + "result")

    // console.log(res.data[0])
    this.setState({ [name]: !x, [name + "result"]: res.data[0] }
      , function () { console.log(this.state) }
    )
  }

  exposeCode = () => {
    // console.log("gdskjb")
    let x = this.state.exposeCode
    this.setState({ exposeCode: !x }
      , function () { console.log(this.state.exposeCode) }
    )
  }

  answer32 = () => {
    let x = this.state.answer32
    this.setState({ answer32: !x })
  }

  mlShit = (a) => {
    // console.log(a)
    let numUser = a.ages.length
    // console.log(numUser)
    let user = []
    for (let i = 0; i < numUser; i++) {
      user.push(<div> <span>age : {a.ages[i]} </span> <span> name : {a.name[i]} </span></div>)
    }
    // console.log(user)
    return <div> {user.map(u => u)}  </div>
  }

  render() {
    return <div>
      <h1> mor bargig answers </h1>
      <h3> Basic Database handling </h3>
      <li>1 Make a query to get the oldest user in every country</li> <br></br>
      <button id="answer11" onClick={this.answer1}>answer </button><br></br>
      {this.state.answer11 ? <div>Answer 1 {this.state.answer11result.map(a => <div>Country : {a.country} , Max age  : {a['MAX(age)']} </div>)} </div> : null}
      <br></br> <li>2 Make a query to recalculate the results only for those who registered between dates 3.7.19 –
        29.7.19</li><br></br>
      <button id="answer12" onClick={this.answer1}>answer </button>
      {this.state.answer12 ? <div>Answer 2 {this.state.answer12result.map(a => <div>name :  {a.name} , Created Date : {a.created_date} </div>)} </div> : null}
      <br></br>
      <h3> Simple backend operation </h3>
      <li>1 Build a program that checks for duplicate letters inside the “name” field in users table and
        replace them with space</li>
      <br></br>
      <button id="answer21" onClick={this.answer1}> answer</button>
      {this.state.answer21 ? <div> <h5>Answer 1 : the only changes once so i can't realy sow you the answer but you can look and see wired spaces on the first 1000 for example </h5>
        <button onClick={this.exposeCode}> or Click on me to see the code </button> <br></br> {this.state.exposeCode ? <div>{this.state.answer21Code}</div> : null}<br></br> {this.state.answer21result.slice(0, 1000).map(a => <div>name {a.name}  </div>)} </div> : null}
      <h3> Algorithm handling </h3>
      <li>1 Develop an algorithm that will create 5 groups of users dynamiclly using cluster algorithm
            based on users age</li>
      <br></br>
      <button id="answer31" onClick={this.answer1}>answer</button>
      <br></br><br></br>
      {this.state.answer31 ? this.state.answer31result.map(a => this.state.answer31result.indexOf(a) % 2 === 0 ? <h3> {a} Group</h3> : <div> <h5>average : {a.avg} </h5> {this.mlShit(a)} </div>) : null}
      <li>2 Create a small gui display that shows the users in every group</li>

      <br></br>
      <button id="answer32" onClick={this.answer32}>answer</button>
      {this.state.answer32 ? <h3>Is it Counted ? :)</h3> : null}
    </div>
  }

}

export default AppName;


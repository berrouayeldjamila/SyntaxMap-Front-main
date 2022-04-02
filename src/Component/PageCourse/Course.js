import React from "react";
import Button from '../Button.js';
import { Link } from "react-router-dom"

class Course extends React.Component {
  constructor(props){
        super(props);
        this.state={
            exemples: [],
            course: this.props.course.split('\n')
        };
  }

  apply() {
    return (
      <Button
        isDisable={false}
        value={this.props.button}
        onClick={() => this.props.onClick()}
        name="Exam"
      />
    );
  }

  componentDidMount(){
  console.log("test course Component");
  console.log(this.props.course.split('\n'));
        this.getMyExemple();
  }

  componentDidUpdate() {
      if (this.props.reload === true)
         this.getMyExemple()
}

  getMyExemple() {
  console.log(this.props.title);
  let tmp = [];
    if (localStorage.getItem('jstoken') !== "") {
      fetch(process.env.REACT_APP_API_URL + "/userupload/user/" + this.props.course_id,
      {
      headers:
        {"Authorization" : localStorage.getItem('jstoken')}
      })
      .then(res =>res.json())
      .then((res) => {
      if (res) {
        console.log(res);
          for (var i = 0; i < res.userUploads.length; i++) {
              tmp.push(res.userUploads[i].sentence);
          }
          this.setState({exemples: tmp});
      }
      });
    }
    else {
        var jsonExemple = JSON.parse(localStorage.getItem("upload"))
        for (var i = 0; i < jsonExemple.upload.length; i++) {
            if (jsonExemple.upload[i].course_id === this.props.course_id)
                tmp.push(jsonExemple.upload[i].sentence)
        }
        this.setState({exemples: tmp});
    }
  }

  render() {
    return (
    <div className="Left">
    <h2>{this.props.title}</h2>
    <hr/>
      <h3>Your Exemple</h3>
      {
        this.state.exemples.map((exempl, index) => {
            return <p key={index}>{exempl}</p>;
        })
      }
    <hr/>
      {
      this.state.course.map((part, index) => {
        return <p key={index}> {part} </p>
      })
      }
      <Link to={{pathname:"/quiz/"+this.props.title, state:{course_id:this.props.course_id}}}>Go to Exam</Link>
     </div>
    );
  }
}

export default Course;
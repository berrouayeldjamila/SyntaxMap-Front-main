import React from "react";
import Course from './Course.js';
import FormUpload from "./FormUpload.js";

class PageCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          Course_id: 0,
          Title:"No Course Found",
          TextCourse: "Something went Wrong",
          ButtonValue: "Start Exam",
          ButtonTextSpeech: "Speak it",
          Reload: false,
          pathname:props.location.pathname
        };
      }
      
  componentDidUpdate(){
        if (this.state.Reload)
            this.setState({Reload: false})
  }

  componentDidMount() {
    console.log("componentDidMount");
    console.log(localStorage.getItem("test"));
    
    fetch(process.env.REACT_APP_API_URL + this.state.pathname)
        .then(res =>res.json())
            .then((res) => {
                this.setState({Title:res.courses[0].course_title, TextCourse:res.courses[0].course_data, Course_id:res.courses[0].course_id})
    });
  }
  handleClickLeft() {
    this.setState({ButtonValue: "Exam for Course n" + this.state.CourseNumber + " started" });
    console.log(this.state.ButtonValue);
  }
  handleClickRight(test) {
    this.setState({ButtonTextSpeech: "Spoke it"});
    console.log(this.state.ButtonTextSpeech);
    console.log(test);
  }

  relaod() {
        this.setState({Reload: true})
  }

  render() {
  const course = (this.state.Title !== "No Course Found") ? <Course course_id={this.state.Course_id} reload={this.state.Reload} title={this.state.Title} course={this.state.TextCourse} button={this.state.ButtonValue} onClick={i => this.handleClickLeft()}/> : null;
    return (
      <div>
        <div className="Course">
          { course }
        </div>
        <FormUpload reload={() => {this.relaod()}} course_id={this.state.Course_id}/>
      </div>
    );
  }
}

export default PageCourse;
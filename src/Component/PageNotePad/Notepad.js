import React from "react";
import { Link } from "react-router-dom"

class Notepad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    componentDidMount(){
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

  render() {
    return (
      <div>
        <h1>Notepad</h1>

      </div>
    );
  }
}

export default Notepad;
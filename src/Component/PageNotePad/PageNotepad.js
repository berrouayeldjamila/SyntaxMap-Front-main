import React from "react";
import { Fragment } from "react";

class PageNotepad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            words:[],
            wrongQuestionId:[],
            wrongQuestionText:[],
            notes:[]
        };
      }
      
  componentDidUpdate(){
  }

  componentDidMount() {
    console.log("componentDidMount");
    //get result batch
    fetch(process.env.REACT_APP_API_URL + "/dashboard/user/",
      {
      headers:
        {"Authorization" : localStorage.getItem('jstoken')}
      })
      .then(res =>res.json())
      .then((res) => {
      if (res) {
        console.log(res);
        let tmp = [];
          for (var i = 0; i < res.dashboard.length; i++) {
              tmp.push(res.dashboard[i]);
          }
          this.setState({reports: tmp});
      }
    });
    //get words
    fetch(process.env.REACT_APP_API_URL + "/dictionnary/user/",
      {
      headers:
        {"Authorization" : localStorage.getItem('jstoken')}
      })
      .then(res =>res.json())
      .then((res) => {
      if (res) {
        console.log(res);
        let tmp = [];
          for (var i = 0; i < res.dictionnary.length; i++) {
              tmp.push(res.dictionnary[i]);
          }
          this.setState({words: tmp});
      }
    });
    //get notes
    fetch(process.env.REACT_APP_API_URL + "/notepad/user/",
      {
      headers:
        {"Authorization" : localStorage.getItem('jstoken')}
      })
      .then(res =>res.json())
      .then((res) => {
      if (res) {
        console.log(res);
        let tmp = [];
          for (var i = 0; i < res.notepads.length; i++) {
              tmp.push(res.notepads[i]);
          }
          this.setState({notes: tmp});
      }
    });
    //get wrong question id
    fetch(process.env.REACT_APP_API_URL + "/mistakeQuestion/user",
      {
      headers:
        {"Authorization" : localStorage.getItem('jstoken')}
      })
      .then(res =>res.json())
      .then((res) => {
      if (res) {
        console.log(res);
        let tmp = [];
        let question_ids = "";
        console.log(question_ids);
          for (var i = 0; i < res.mistakeQuestions.length; i++) {
              tmp.push(res.mistakeQuestions[i]);
              question_ids = question_ids + res.mistakeQuestions[i].questions_wrong_id.join();
              if (i !== res.mistakeQuestions.length - 1 && res.mistakeQuestions[i].questions_wrong_id.length > 0)
                question_ids = question_ids + ",";
          }
          if (question_ids[question_ids.length - 1] === ",")
            question_ids = question_ids.slice(0, -1);
          console.log(question_ids);
          this.setState({wrongQuestionId: tmp});
          //get wrong question by their id
          fetch(process.env.REACT_APP_API_URL + "/questions/notepad",{
          method: "POST",
          body: JSON.stringify({
              question_ids: question_ids
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization" : localStorage.getItem('jstoken')
          }
          })
          .then(res =>res.json())
          .then((res) => {console.log(res);
          let tmp = [];
          for (var i = 0; i < res.questions.length; i++) {
              tmp.push(res.questions[i]);
          }
          this.setState({wrongQuestionText: tmp});})
          .catch((err) => {console.log(err)});
      }
    });
  }

  handleNote = e => {
    console.log(e.target.value);
  }

  updateNote = e => {
    e.preventDefault();
    console.log(e);
    console.log(e.target[0].value);
    console.log(e.target[1].value);
    console.log(e.target[2].value);
    console.log(e.target[3].value);
    fetch(process.env.REACT_APP_API_URL + "/notepad/" + e.target[0].value,{
    method:'PUT',
    body: JSON.stringify({
                note_id: e.target[0].value,
                session_name: e.target[1].value,
                note: e.target[2].value
    }),
    headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization" : localStorage.getItem('jstoken')
    }
    })
    .then(res =>res.json())
    .then((res) => {console.log(res);})
    .catch((err) => {console.log(err)});
  }

  render() {
    return (
      <div>
        <h2>Notepad</h2>
        <table style={{}}>
        <thead>
            <tr>
                <th>Session</th>
                <th>Note</th>
                <th>Words</th>
                <th>Mistakes Question</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
        {
            this.state.reports.map((report,index) => {
                return <tr key={index}>
                    <td>
                        {report.session_name}
                    </td>
                    <td>
                        {
                            this.state.notes.map((note,i) => {
                                if (note.session_name === report.session_name)
                                    return <form key={i} onSubmit={this.updateNote}>
                                        <input type="hidden" value={note.note_id}/>
                                        <input type="hidden" value={note.session_name}/>
                                        <textarea defaultValue={note.note} onInput={this.handleNote}/><br/>
                                        <input type="submit"/>
                                    </form>
                                return null;
                            })
                        }
                    </td>
                    <td>
                        {
                            this.state.words.map((word,i) => {
                                if (word.session_name === report.session_name)
                                    return <p key={i}>{word.word}</p>
                                return null;
                            })
                        }
                    </td>
                    <td>
                        {
                            this.state.wrongQuestionId.map((mistake,i) => {
                                if (mistake.session_name === report.session_name) {
                                     return this.state.wrongQuestionText.map((question, ind) => {
                                         if (mistake.questions_wrong_id.indexOf(question.question_id) >= 0){
                                            return (<Fragment key={ind}>
                                                    <p>{question.question_title}</p>
                                                    <p>a: {question.answer_title_a} b: {question.answer_title_b} c: {question.answer_title_c} d: {question.answer_title_d}</p>
                                                   </Fragment>)
                                            }
                                            return null;
                                     })
                                }
                                return null;
                            })
                        }
                    </td>
                    <td>
                        score: {report.nb_good / report.total_question * 100}% time used: {100 - report.time_remaining / (report.time_per_question * report.total_question) * 100}%
                    </td>
                    </tr>
            })
        }
        </tbody>
        </table>
      </div>
    );
  }
}

export default PageNotepad;
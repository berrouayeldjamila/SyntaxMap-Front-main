import React from "react";

class FormUpload extends React.Component {

    constructor(props){
        super(props);
        this.state={
            sentence: "",
            img: {}
        }
    }

  handleTextInput = e => {
    this.setState({sentence: e.target.value});
  }

  drawImageToCanvas(image) {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
      return canvas;
  }

  imgByteArray(image) {
    const canvas = this.drawImageToCanvas(image);
    const ctx = canvas.getContext('2d');
  
    let result = [];
    for (let y = 0; y < canvas.height; y++) {
      result.push([]);
      for (let x = 0; x < canvas.width; x++) {
        let data = ctx.getImageData(x, y, 1, 1).data;
        result[y].push(data[0]);
        result[y].push(data[1]);
        result[y].push(data[2]);
      }
    }
    this.setState({img: result});
  }

  handleImg = e => {
    console.log(e.target.files[0]);
    if (!e.target.files[0]){
        this.setState({img: []})
        return;
        }
    const imageFile = URL.createObjectURL(e.target.files[0]);
    this.setState({img: e.target.files[0]})
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(e);
    
    if (localStorage.getItem('jstoken') !== "") {
        var tmp = new FormData();
        tmp.append('file', this.state.img)
        tmp.append('course_id',this.props.course_id)
        tmp.append('sentence',this.state.sentence)

        fetch(process.env.REACT_APP_API_URL + "/userupload",{
        method: "POST",
        body: tmp,
        headers: {
            "Content-type": "multipart/form-data; boundary=something",
            "Authorization" : localStorage.getItem('jstoken')
        }
        })
        .then(res => console.log(res))
    }
    else {
        var jsonExemple = JSON.parse(localStorage.getItem("upload"))
        if (jsonExemple.upload.length < 3) {
            var data = {
                user_name: "foo",
                sentence: this.state.sentence,
                img: null,
                course_id: this.props.course_id
            };
            jsonExemple.upload.push(data);
            localStorage.setItem("upload", JSON.stringify(jsonExemple))
        }
    }
    this.props.reload()
  }

  render() {
    return (
     <div className="Upload">
        <h2>Upload your Exemples</h2>
        <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleTextInput}/><br/>
            <input type="file" onChange={this.handleImg} accept="image/png, image/jpeg, image/gif"/><br/>
            <input type="submit"/><br/>
        </form>
     </div>
    );
  }
}

export default FormUpload;
import React from 'react';
import axios from 'axios';
import './Styles.css';
import Header from './header';
export default function Upload() {
    const [fileName, setfileName] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [file, setFile] = React.useState('');

    const fileUpload = (event) => {
        const afile = event.target.files[0]
        setFile(afile)
        setfileName(file.name)
        console.log(file)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('file', file);
        data.append('date', date);
        data.append('time', time);

        axios.post('http://localhost:3000/users/upload', data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        })
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div>
            <div> <Header /> </div>
            <h2>Upload New Assignments</h2>
            <p>Upload The Assignment: </p>
            <input type="file" onChange={fileUpload} />
            <br />
            <p>Select a Deadline: </p>
            <p>
                Date: <input type='date' value={date} onChange={e => setDate(e.target.value)} />
            </p>
            <p>
                Time: <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </p>
            <p>Assignment Name: {fileName || 'No File Uploaded'}</p>
            <input type="submit" onClick={handleSubmit} />
        </div>
    )
}
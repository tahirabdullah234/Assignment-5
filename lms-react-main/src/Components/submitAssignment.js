import React from 'react';
import axios from 'axios';
import './Styles.css';
import Header from './header';

export default function Submit() {
    const [assignments, setAssignment] = React.useState(null);
    const [fileName, setFilename] = React.useState('');
    const [studentName, setStudentname] = React.useState('');
    const [file, setFile] = React.useState(null);
    React.useEffect(() => getList(), [])

    const getList = () => {
        axios.get('http://localhost:3000/users/getassignments', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        }).then((res) => {
            if (res.data.success) {
                setAssignment(res.data.rec);
            }
            else {
                setAssignment(
                    [{
                        name: 'No Record Found',
                        enddate: 'N/A',
                        endtime: 'N/A',
                        _id: null
                    }]
                )
            }
        })
    }

    const fileUpload = (e) => {
        const afile = e.target.files[0]
        setFile(afile);
        setFilename(afile.name)
    }

    const handleSubmit = (e, id) => {
        e.preventDefault();
        if (!id) {
            alert('Cannot Submit')
        }
        else {
            const data = new FormData();
            data.append('file', file);
            data.append('studentname', studentName);
            data.append('assignment_id', String(id));
            data.append('submitted_at', new Date(Date.now()).toDateString());
            data.append('filename', fileName);
            axios.post('http://localhost:3000/users/submitassignment', data, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                }
            })
                .then(res => console.log(res))
        }
    }

    return (
        <div>
            <div><Header /></div>
            <h2>Submit Assignments</h2>
            <table>
                <tr>
                    <td>No.</td>
                    <td>Name</td>
                    <td>End Date</td>
                    <td>End Time</td>
                    <td>Option</td>
                </tr>
                {
                    assignments ?
                        assignments.map((assignment, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{assignment.name}</td>
                                    <td>{assignment.enddate}</td>
                                    <td>{assignment.endtime}</td>
                                    <td>
                                        <input type="text" value={studentName} onChange={(e) => setStudentname(e.target.value)} placeholder="Enter Your Name" />
                                        <br />
                                        <input type="file" onChange={(e) => fileUpload(e)} />
                                        <br />
                                        <button onClick={(event) => handleSubmit(event, assignment._id)}>Upload</button>
                                    </td>
                                </tr>

                            )
                        })
                        :
                        <tr>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                        </tr>
                }
            </table>
        </div>
    )
}
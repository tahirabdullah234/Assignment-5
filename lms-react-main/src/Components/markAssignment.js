import React from 'react';
import axios from 'axios';
import './Styles.css';
import Header from './header';

export default function Mark() {
    const [assignments, setAssignment] = React.useState(null);
    const [submissions, setSubmission] = React.useState(null);

    React.useEffect(() => getList(), []);

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
                setAssignment([{
                    name: 'No Record Found',
                    enddate: 'N/A',
                    endtime: 'N/A',
                    _id: null
                }])
            }
        })
    }

    const getSubmissions = (id) => {
        axios.get('http://localhost:3000/users/getsubmission/' + String(id), {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        }).then((res) => {
            console.log(res)
            if (res.data.success) {
                setSubmission(res.data.rec);
            }
            else {
                setSubmission([{
                    studentname: 'No Submission',
                    filename: 'N/A',
                    submitted_at: 'N/A',
                    marks: 'N/A'
                }])
            }
        })
    }

    const updateMarks = (marks, id) => {
        const data = {
            marks: marks,
            id: String(id)
        }
        axios.patch('http://localhost:3000/users/updatemarks', data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        })
            .then(res => {
                console.log(res)
                if (res.data.success) {
                    getSubmissions(res.data.data.assignment_id)
                }
            })
    }

    return (
        <div>
            <div><Header /></div>
            <h2>Select Assignment you want to mark</h2>
            <table>
                <tr>
                    <td>No.</td>
                    <td>Name</td>
                </tr>
                {
                    assignments ?
                        assignments.map((assignment, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td onClick={() => getSubmissions(assignment._id)}>{assignment.name}</td>
                                </tr>
                            )
                        })
                        :
                        <tr>
                            <td>N/A</td>
                            <td>N/A</td>
                        </tr>
                }
            </table>
            <table>
                <tr>
                    <td>No.</td>
                    <td>Student Name</td>
                    <td>File Name</td>
                    <td>Submitted At</td>
                    <td>Add Marks</td>
                </tr>
                {
                    submissions ?
                        submissions.map((submission, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{submission.studentname}</td>
                                    <td>{submission.filename}</td>
                                    <td>{submission.submitted_at}</td>
                                    <td>
                                        <input type='text' value={submission.marks} onChange={(e) => submission.marks = e.target.value} />
                                        <br />
                                        <button onClick={() => updateMarks(submission.marks, submission._id)}>Update marks</button>
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
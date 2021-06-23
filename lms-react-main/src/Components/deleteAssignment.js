import axios from 'axios';
import React, { useState } from 'react';
import './Styles.css'
import Header from './header';

export default function Delete() {
    const [assignments, setAssignment] = useState(null);
    React.useEffect(() => {
        getList()
    }, [])

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

    const clickDelete = (id) => {
        if (!id) {
            alert('Cannot Delete')
        }
        else {
            axios.delete('http://localhost:3000/users/deleteassignment/' + String(id))
                .then(res => {
                    if (res.data.success) {
                        getList();
                    }
                })
        }
    }
    return (
        <div>
            <div><Header /></div>
            <h2>Delete Assignment!</h2>
            <table>
                <tr>
                    <td>No.</td>
                    <td>Assignment Name</td>
                    <td>End Date</td>
                    <td>End Time</td>
                    <td>Delete?</td>
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
                                    <td><button onClick={() => clickDelete(assignment._id)}>Delete</button></td>
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

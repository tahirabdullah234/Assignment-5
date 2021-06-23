import React from 'react';
import './Styles.css';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div>
            <ul>
                <Link to="/">
                    <li>Upload</li>
                </Link>
                <Link to="/delete">
                    <li>Delete</li>
                </Link>
                <Link to="/submit">
                    <li>Submit</li>
                </Link>
                <Link to="/mark">
                    <li>Mark</li>
                </Link>
            </ul>
        </div>
    )
}
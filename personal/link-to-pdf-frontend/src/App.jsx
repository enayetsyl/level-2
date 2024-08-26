import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <nav className="mb-4">
                <ul className="flex justify-center space-x-4">
                    <li>
                        <Link to="/" className="text-blue-500">Link to PDF</Link>
                    </li>
                    <li>
                        <Link to="/video-to-pdf" className="text-blue-500">Video to PDF</Link>
                    </li>
                    <li>
                        <Link to="/pdf-merge" className="text-blue-500">PDF Merge</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import LinkToPdf from './components/LinkToPdf';
import VideoToPdf from './components/VideoToPdf';
import PdfMerge from './components/PdfMerge';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <LinkToPdf />,
            },
            {
                path: 'video-to-pdf',
                element: <VideoToPdf />,
            },
            {
                path: 'pdf-merge',
                element: <PdfMerge />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

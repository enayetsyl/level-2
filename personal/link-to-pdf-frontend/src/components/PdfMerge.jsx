import React, { useState } from 'react';
import axios from 'axios';

function PdfMerge() {
    const [pdfFiles, setPdfFiles] = useState([]);
    const [pdfStatus, setPdfStatus] = useState('');

    const handlePdfUpload = (event) => {
        setPdfFiles(event.target.files);
    };

    const mergePdfFiles = async () => {
        try {
            setPdfStatus('Merging PDFs...');
            const formData = new FormData();
            Array.from(pdfFiles).forEach(file => {
                formData.append('pdfs', file);
            });
            const response = await axios.post('http://localhost:3000/merge-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob'
            });

            setPdfStatus('PDFs merged successfully!');

            // Create a URL for the merged PDF and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'merged.pdf');
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.remove();
        } catch (error) {
            setPdfStatus('Error merging PDFs.');
            console.error('Error merging PDFs:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Merge PDF Files</h1>
                <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                    onClick={mergePdfFiles}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Merge PDFs
                </button>
                {pdfStatus && <p className="mt-4 text-center">{pdfStatus}</p>}
            </div>
        </div>
    );
}

export default PdfMerge;

import React, { useState } from 'react';
import axios from 'axios';

function LinkToPdf() {
    const [url, setUrl] = useState('');
    const [links, setLinks] = useState([]);
    const [pdfStatus, setPdfStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const fetchLinks = async () => {
      setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/generate-link', { url });
            setLinks(response.data.links);
            
        } catch (error) {
            console.error('Error fetching links:', error);
        }finally{
          setIsLoading(false)
        }
    };

    const generatePdf = async () => {
      setIsLoading(true)
        try {
            setPdfStatus('Generating PDFs...');
            const response = await axios.post('http://localhost:3000/generate-pdf', { urls: links }, { responseType: 'blob' });
            setPdfStatus('PDFs generated successfully!');

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
            setPdfStatus('Error generating PDFs.');
            console.error('Error generating PDFs:', error);
        } finally{
          setIsLoading(false)
        }
    };

    const deleteLink = (link) => {
        setLinks(links.filter((item) => item !== link));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Sub-Route Link Generator</h1>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
               <button
  onClick={fetchLinks}
  className={`w-full p-2 rounded ${
    isLoading ? "bg-yellow-500 text-black" : "bg-blue-500 text-white"
  }`}
  disabled={isLoading}
>
  {isLoading ? "Generating Links" : "Generate Links"}
</button>

            </div>
            <div className="max-w-md mx-auto mt-4 bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold mb-2">Sub-Route Links</h2>
                <h3 className="text-lg font-bold mb-2">Total links: {links.length}</h3>
                <ul>
                    {links.map((link, index) => (
                        <li key={index} className="flex justify-between items-center mb-2">
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                {link}
                            </a>
                            <button
                                onClick={() => deleteLink(link)}
                                className="ml-2 bg-red-500 text-white p-1 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
                {links.length > 0 && (
                    <button
                        onClick={generatePdf}
                        className={`w-full p-2 rounded ${
                          isLoading ? "bg-yellow-500 text-black" : "bg-blue-500 text-white"
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Generating PDF" :"Generate PDF"}
                    </button>
                )}
                {pdfStatus && <p className="mt-4 text-center ">{pdfStatus}</p>}
            </div>
        </div>
    );
}

export default LinkToPdf;

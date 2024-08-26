import React, { useState } from 'react';

const App = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleRecordClick = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        console.log('Recording started');

        recorder.ondataavailable = event => {
          setAudioChunks(prev => [...prev, event.data]);
        };

        recorder.onstop = () => {
          console.log('Recording stopped');
          const blob = new Blob(audioChunks, { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setAudioChunks([]);
          console.log('Audio recorded and available for playback');
        };

        setAudioChunks([]);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleStopClick = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Audio Recorder</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleRecordClick}
          disabled={mediaRecorder !== null && mediaRecorder.state === 'recording'}
        >
          Record
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleStopClick}
          disabled={mediaRecorder === null || mediaRecorder.state !== 'recording'}
        >
          Stop
        </button>
        {audioUrl && (
          <div className="mt-4">
            <audio controls src={audioUrl} className="w-full"></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

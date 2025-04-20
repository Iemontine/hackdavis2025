import { useState, useRef } from 'react';

function WorkoutPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioToServer(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://localhost:8000/transcribe/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.transcription) {
        setTranscription(data.transcription);
      } else if (data.error) {
        console.error("Transcription error:", data.error);
        setTranscription("Error: Could not transcribe audio");
      }
    } catch (error) {
      console.error("Error sending audio:", error);
      setTranscription("Error: Could not send audio to server");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">Voice Workout Assistant</h1>

        <div className="flex flex-col items-center">
          <button
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording
                ? 'bg-red-500 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            onClick={handleMicrophoneClick}
            disabled={isProcessing}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <p className="mt-4 font-medium">
            {isRecording ? "Release to stop recording" : "Push to talk"}
          </p>

          {isProcessing && (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-700"></div>
              <span className="ml-2">Processing...</span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Transcription:</h2>
          <div className="bg-gray-50 p-4 rounded-lg min-h-24 border border-gray-200">
            {transcription ? (
              <p>{transcription}</p>
            ) : (
              <p className="text-gray-500 italic">Your transcribed speech will appear here...</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Speak clearly into your microphone. Push the button, speak, then release.</p>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPage;
import { useState, useRef, useEffect } from 'react';

function WorkoutPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentMessages, setAgentMessages] = useState<string[]>([]);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start workout conversation when component mounts
  useEffect(() => {
    startWorkoutConversation();
  }, []);

  const startWorkoutConversation = async () => {
    setIsLoadingAgent(true);
    try {
      // Assuming you have the auth0_id available - you may need to get this from your auth context
      const auth0Id = "user123"; // Replace with actual user ID from authentication

      const response = await fetch('http://localhost:8000/workouts/start_workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth0_id: auth0Id }),
      });

      const data = await response.json();
      if (data.message) {
        setAgentMessages([data.message]);
      }
    } catch (error) {
      console.error("Error starting workout conversation:", error);
      setAgentMessages(["Sorry, I couldn't connect to the workout assistant."]);
    } finally {
      setIsLoadingAgent(false);
    }
  };

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
        // Send the transcription to the workout conversation endpoint
        await sendTranscriptionToWorkoutAssistant(data.transcription);
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

  const sendTranscriptionToWorkoutAssistant = async (transcription: string) => {
    setIsLoadingAgent(true);
    try {
      const auth0Id = "user123"; // Replace with actual user ID from authentication

      const response = await fetch('http://localhost:8000/workouts/add_to_workout_conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0_id: auth0Id,
          message: transcription
        }),
      });

      const data = await response.json();
      if (data.message) {
        // Add the assistant's response to the message list
        setAgentMessages(prevMessages => [...prevMessages, data.message]);
      }
    } catch (error) {
      console.error("Error sending transcription to workout assistant:", error);
      setAgentMessages(prevMessages => [
        ...prevMessages,
        "Sorry, I couldn't process your message."
      ]);
    } finally {
      setIsLoadingAgent(false);
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 flex flex-col items-center pt-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold text-center">Voice Workout Assistant</h1>
        </div>

        <div className="p-6">
          {/* Assistant Messages Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 1012 0c0-.352-.035-.696-.1-1.028A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              Assistant
            </h2>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 min-h-24 shadow-sm">
              {isLoadingAgent ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-indigo-600 font-medium">Connecting to assistant...</span>
                </div>
              ) : agentMessages.length > 0 ? (
                <div className="text-gray-800">
                  <p>{agentMessages[agentMessages.length - 1]}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-6">No messages from the assistant yet...</p>
              )}
            </div>
          </div>

          {/* Microphone Button Section */}
          <div className="flex flex-col items-center mb-8">
            <button
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isRecording
                  ? 'bg-red-500 animate-pulse scale-110'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:scale-105'
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

            <p className="mt-4 font-medium text-gray-700">
              {isRecording ? "Release to stop recording" : "Push to talk"}
            </p>

            {isProcessing && (
              <div className="mt-4 flex items-center bg-indigo-100 px-4 py-2 rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-indigo-600 font-medium">Processing...</span>
              </div>
            )}
          </div>

          {/* Transcription Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
              </svg>
              Transcription
            </h2>
            <div className="bg-gray-50 p-4 rounded-2xl min-h-24 border border-gray-200 shadow-sm">
              {transcription ? (
                <p className="text-gray-700">{transcription}</p>
              ) : (
                <p className="text-gray-400 italic text-center py-6">Your transcribed speech will appear here...</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Speak clearly into your microphone. Push the button, speak, then release.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPage;
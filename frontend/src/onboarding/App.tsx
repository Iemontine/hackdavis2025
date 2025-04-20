import { useState, useRef, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

function WorkoutPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentMessages, setAgentMessages] = useState<string[]>([]);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  // Start workout conversation when authenticated user is available
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      startWorkoutConversation();
    }
  }, [isAuthenticated, user, isLoading]);

  const startWorkoutConversation = async () => {
    setIsLoadingAgent(true);
    try {
      const auth0Id = user?.sub;

      if (!auth0Id) {
        console.error("No Auth0 ID available");
        setAgentMessages(["Please log in to use the workout assistant."]);
        setIsLoadingAgent(false);
        return;
      }

      const response = await fetch('http://localhost:8000/onboarding/start_onboarding', {
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
      console.log(user);
      const auth0Id = user?.sub;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-15 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Sleek header bar with user profile */}
      <header className="w-full bg-black/30 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight ml-4">Voice Workout Assistant</h1>
          </div>
          
          {/* Elegant user profile display */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {user.picture && (
                  <div className="relative">
                    <img 
                      src={user.picture} 
                      alt={user.name || "User"} 
                      className="w-10 h-10 rounded-full border-2 border-blue-400"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
                  </div>
                )}
                <button 
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="ml-3 text-sm text-blue-300 hover:text-white transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content in a responsive grid layout */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Assistant panel - larger on desktop */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="h-full backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-3"></div>
                <h2 className="text-lg font-medium text-white/90">Workout Assistant</h2>
              </div>
              <div className="p-6 h-[calc(100%-62px)] overflow-y-auto">
                {isLoadingAgent ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-400"></div>
                    <span className="ml-3 text-blue-200 font-medium">Connecting...</span>
                  </div>
                ) : agentMessages.length > 0 ? (
                  <div className="space-y-6">
                    {agentMessages.length > 0 && (
                      <div className="animate-fadeIn transition-all duration-500 opacity-100">
                        <p className="text-white/90 leading-relaxed text-lg">
                          {agentMessages[agentMessages.length - 1]}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/50 italic text-center">Getting ready to assist with your workout...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls and transcription panel */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Interactive microphone control */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl p-6 flex flex-col items-center">
              <button
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-lg shadow-red-500/20'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20'
                  }`}
                onClick={handleMicrophoneClick}
                disabled={isProcessing}
              >
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full animate-ping-slow bg-red-500/20"></div>
                    <div className="absolute inset-0 rounded-full animate-ping-slower bg-red-500/10"></div>
                  </>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 text-white transition-all duration-300 ${isRecording ? 'scale-90' : 'scale-100'}`}
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

              <p className="mt-5 font-medium text-white/80 text-lg">
                {isRecording ? "Recording..." : "Tap to Speak"}
              </p>

              {isProcessing && (
                <div className="mt-4 flex items-center bg-black/30 px-4 py-2 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-blue-400"></div>
                  <span className="ml-3 text-blue-200 font-medium">Processing...</span>
                </div>
              )}
            </div>

            {/* Transcription display */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <h2 className="text-base font-medium text-white/90">Your Voice Input</h2>
              </div>

              <div className="p-6 min-h-[120px]">
                {transcription ? (
                  <p className="text-white/80 leading-relaxed animate-fadeIn">{transcription}</p>
                ) : (
                  <p className="text-white/40 italic text-center">Your voice will be transcribed here...</p>
                )}
              </div>
            </div>

            {/* Instruction panel */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl p-4">
              <div className="flex items-center text-left">
                <div className="flex-shrink-0 bg-blue-500/20 rounded-lg p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white/90 font-medium mb-1">How to use</h3>
                  <p className="text-white/60 text-sm">Tap the microphone button, speak clearly about your workout, then release to get assistance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-blob {
          animation: blob 30s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-slower {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}

export default WorkoutPage;
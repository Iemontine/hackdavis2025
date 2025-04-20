

import { useState, useRef, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function WorkoutPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentMessages, setAgentMessages] = useState<string[]>([]);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentMessages]);

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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

      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/onboarding/start_onboarding`, {
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

      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/transcribe/`, {
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

      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/workouts/add_to_workout_conversation`, {
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

  // const handleMicrophoneClick = () => {
  //   if (isRecording) {
  //     stopRecording();
  //   } else {
  //     startRecording();
  //   }
  // };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 2
      }
    }
  };

  const waveVariants = {
    initial: { pathLength: 0, pathOffset: 0 },
    animate: {
      pathLength: 1,
      pathOffset: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          {...{ className: "absolute top-0 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-20" }}
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut"
          }}
        />
        <motion.div
          {...{ className: "absolute bottom-0 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-15" }}
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          {...{ className: "absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-10" }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header bar with user profile */}
      <header className="glass-dark sticky top-0 border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-montserrat text-2xl font-bold flex items-center">
              <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }} {...{ className: "mr-2" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                <span className="text-indigo-400 mr-1">Fit</span>AI
              </h1>
            </Link>
          </div>

          {/* User profile */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {user.picture && (
                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      {...{
                        src: user.picture,
                        alt: user.name || "User",
                        className: "w-10 h-10 rounded-full border-2 border-indigo-400 object-cover"
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
                  </div>
                )}
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="ml-3 text-sm text-blue-300 hover:text-white transition-colors font-medium"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content area with improved responsive layout */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 relative z-10">
        <motion.div
          {...{ className: "grid grid-cols-1 lg:grid-cols-12 gap-6" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Assistant panel - larger on desktop, now also first on mobile */}
          <motion.div
            {...{ className:"lg:col-span-7 xl:col-span-8 order-1 lg:order-1" }}
            variants={itemVariants}
          >
            <div className="h-[300px] md:h-[600px] glass rounded-2xl border border-white/20 overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center bg-white/5">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse mr-3"></div>
                <h2 className="text-lg font-semibold text-white/90 font-montserrat">FitAI Assistant</h2>
              </div>
              <div className="p-6 h-[calc(100%-62px)] overflow-y-auto">
                {isLoadingAgent ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="loader w-12 h-12 border-t-2 border-blue-500 border-r-2 rounded-full animate-spin"></div>
                    <span className="mt-4 text-blue-200 font-medium animate-pulse">Connecting to AI...</span>
                  </div>
                ) : agentMessages.length > 0 ? (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      {...{ className:"bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10" }}
                  >
                    <p className="text-white/90 leading-relaxed text-lg">
                      {agentMessages[agentMessages.length - 1]}
                    </p>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <motion.p
                          variants={pulseVariants}
                          initial="initial"
                          animate="pulse"
                          {...{ className:"text-white/50 italic text-center" }}
                    >
                      Getting ready to assist with your workout...
                    </motion.p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Controls panel - right side on desktop, below assistant on mobile */}
          <motion.div
            {...{ className:"lg:col-span-5 xl:col-span-4 order-2 lg:order-2 flex flex-col h-[500px] md:h-[600px]", variants: itemVariants }}
          >
            {/* Microphone control with integrated instructions */}
            <div className="glass rounded-2xl border border-white/20 overflow-hidden shadow-xl p-6 flex flex-col items-center mb-6 h-[240px] md:h-[290px]">
              <div className="relative w-full flex flex-col items-center">
                <AnimatePresence>
                  {showTooltip && !isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: -10 }}
                      exit={{ opacity: 0, y: -20 }}
                      {...{ className:"absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-slate-800 px-4 py-2 rounded-lg shadow-lg w-48 text-center z-10" }}
                    >
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
                      Tap to start speaking
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  {...{
                    className: `relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all ${isRecording
                      ? 'bg-gradient-to-r from-red-600 to-pink-600'
                      : isProcessing
                        ? 'bg-gradient-to-r from-blue-600/50 to-indigo-600/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                      }`,
                    onClick: () => {
                      if (!isProcessing) {
                        if (isRecording) {
                          stopRecording();
                        } else {
                          startRecording();
                        }
                      }
                    }
                  }}
                  whileHover={!isRecording && !isProcessing ? { scale: 1.05, boxShadow: '0 0 15px rgba(79, 70, 229, 0.6)' } : {}}
                  whileTap={!isProcessing ? { scale: 0.95 } : {}}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: isProcessing ? 0.7 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {isRecording && (
                    <>
                      <motion.div
                        {...{ className: "absolute inset-0 rounded-full bg-red-500/20" }}
                        initial={{ scale: 0.8, opacity: 0.2 }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.2, 0.1, 0.2]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        {...{ className:"absolute inset-0 rounded-full bg-red-500/10" }}
                        initial={{ scale: 0.8, opacity: 0.1 }}
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [0.1, 0.05, 0.1]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut"
                        }}
                      />
                    </>
                  )}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    viewBox="0 0 24 24"
                    animate={isRecording ? { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] } : {}}
                    transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      fill="none"
                      stroke="currentColor"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </motion.svg>
                </motion.button>
              </div>

              <motion.p
                {...{ className:"mt-4 font-medium text-white/90 text-lg" }}
                variants={pulseVariants}
                initial="initial"
                animate={isRecording ? "pulse" : "initial"}
              >
                {isRecording ? "Recording... Press to stop" : "Tap to Speak"}
              </motion.p>
              
              {/* Tutorial text */}
              <div className="mt-2 text-center px-2">
                <p className="text-white/70 text-sm">
                  Tap the microphone, speak clearly about your workout goals, then release to get AI guidance.
                </p>
              </div>

              {/* Recording animation and processing indicator */}
              <div className="mt-auto">
                {isRecording && (
                  <div className="mt-2 mb-2">
                    <svg width="60" height="30" viewBox="0 0 60 30">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
                        <motion.path
                          key={i}
                          d={`M${i * 4 + 2},15 Q${i * 4 + 3},${Math.random() * 10 + 10} ${i * 4 + 4},15`}
                          stroke="#38bdf8"
                          strokeWidth="2"
                          fill="none"
                          initial="initial"
                          animate="animate"
                          variants={waveVariants}
                          custom={i}
                        />
                      ))}
                    </svg>
                  </div>
                )}

                {isProcessing && (
                  <motion.div
                    {...{ className:"mt-2 flex items-center glass-dark rounded-full px-4 py-2" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <svg className="animate-spin h-4 w-4 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-200 font-medium">Processing...</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Transcription display - sized to fill remaining space */}
            <motion.div
              {...{ className: "glass rounded-2xl border border-white/20 overflow-hidden shadow-xl flex-grow" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <h2 className="text-base font-medium text-white/90">Your Voice Input</h2>
              </div>

              <div className="p-6 h-[calc(100%-62px)] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {transcription ? (
                    <motion.p
                      key="transcription"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      {...{ className: "text-white/90 leading-relaxed" }}
                    >
                      {transcription}
                    </motion.p>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      {...{ className: "text-white/40 italic text-center flex items-center justify-center h-full" }}
                    >
                      <p>Your voice will be transcribed here...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default WorkoutPage;
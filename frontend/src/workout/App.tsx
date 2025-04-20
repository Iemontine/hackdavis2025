import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

interface Exercise {
  name: string;
  description: string;
  duration?: string;
  reps?: number;
}

interface Workout {
  type: "time-based" | "rep-based";
  name: string;
  duration?: string;
  description: string;
  exercises: Exercise[];
}

interface WorkoutResponse {
  workout_id: string;
  workout: Workout;
  share_url: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// New component for circular timer
function CircularTimer({ timeRemaining, totalTime }: { timeRemaining: number; totalTime: number }) {
  // Calculate the percentage of time remaining
  const percentage = (timeRemaining / totalTime) * 100;
  
  // Calculate the angle for the SVG arc
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - percentage / 100);
  
  // Generate tick marks
  const ticks = [];
  const tickCount = 12; // Number of tick marks
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * 360;
    const tickLength = i % 3 === 0 ? 10 : 5; // Longer ticks at quarters
    ticks.push(
      <line
        key={i}
        x1={80 + (radius + 5) * Math.cos((angle - 90) * (Math.PI / 180))}
        y1={80 + (radius + 5) * Math.sin((angle - 90) * (Math.PI / 180))}
        x2={80 + (radius + 5 + tickLength) * Math.cos((angle - 90) * (Math.PI / 180))}
        y2={80 + (radius + 5 + tickLength) * Math.sin((angle - 90) * (Math.PI / 180))}
        stroke="#ffffff"
        strokeWidth={i % 3 === 0 ? 2 : 1}
        strokeOpacity={0.8}
      />
    );
  }
  
  return (
    <div className="relative flex justify-center items-center mb-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Outer stopwatch circle */}
        <circle cx="80" cy="80" r={radius + 15} fill="#1e293b" strokeWidth="4" stroke="#4f46e5" />
        
        {/* Tick marks */}
        {ticks}
        
        {/* Background circle */}
        <circle 
          cx="80" 
          cy="80" 
          r={radius} 
          fill="transparent" 
          stroke="#475569" 
          strokeWidth="8"
        />
        
        {/* Progress circle - pie animation */}
        <circle 
          cx="80" 
          cy="80" 
          r={radius} 
          fill="transparent" 
          stroke="#4f46e5" 
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          className="transition-all duration-1000"
        />
        
        {/* Stopwatch top button */}
        <circle cx="80" cy="35" r="5" fill="#4f46e5" />
        
        {/* Glass reflection effect */}
        <path 
          d="M50,65 A40,40 0 0,1 110,65" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="15" 
          fill="transparent" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function WorkoutSession() {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { user } = useAuth0();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutUrl, setWorkoutUrl] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showShareFeedback, setShowShareFeedback] = useState(false);

  // const repBasedWorkout: Workout = {
  //   type: "rep-based",
  //   name: "Strength Training Circuit",
  //   description:
  //     "A strength-focused workout targeting major muscle groups. Perform the specified number of repetitions for each exercise.",
  //   exercises: [
  //     {
  //       name: "Push-Ups",
  //       reps: 15,
  //       description:
  //         "Perform push-ups to strengthen your chest, shoulders, and triceps.",
  //     },
  //     {
  //       name: "Squats",
  //       reps: 20,
  //       description: "Perform squats to strengthen your legs and glutes.",
  //     },
  //     {
  //       name: "Bicep Curls",
  //       reps: 12,
  //       description:
  //         "Perform bicep curls with dumbbells to strengthen your arms.",
  //     },
  //     {
  //       name: "Lunges",
  //       reps: 10,
  //       description:
  //         "Perform 10 lunges on each leg to target your quads and glutes.",
  //     },
  //     {
  //       name: "Sit-Ups",
  //       reps: 20,
  //       description: "Perform sit-ups to strengthen your core.",
  //     },
  //   ],
  // };

  const timeBasedWorkout: Workout = {
    type: "time-based",
    name: "Full-Body Circuit",
    duration: "20 minutes",
    description:
      "A full-body workout focusing on endurance and strength. Perform each exercise for the specified time, with minimal rest in between.",
    exercises: [
      {
        name: "Jumping Jacks",
        duration: "2 minutes",
        description:
          "Perform jumping jacks to warm up and increase your heart rate.",
      },
      {
        name: "Plank Hold",
        duration: "1 minute",
        description: "Hold a plank position to strengthen your core.",
      },
      {
        name: "High Knees",
        duration: "1 minute",
        description: "Run in place, bringing your knees up to your chest.",
      },
      {
        name: "Mountain Climbers",
        duration: "1 minute",
        description:
          "Perform mountain climbers to work on your core and cardio.",
      },
      {
        name: "Rest",
        duration: "1 minute",
        description: "Take a short break to recover.",
      },
    ],
  };

  useEffect(() => {
    async function fetchWorkout() {
      setIsLoading(true);
      try {
        if (workoutId) {
          const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/workout/${workoutId}`);
          if (!response.ok) {
            throw new Error('Workout not found');
          }
          const data = await response.json();
          setWorkout(data.workout);
          setWorkoutUrl(`${window.location.origin}/workout/${data.workout_id}`);
        } else {
          console.log(import.meta.env.VITE_APP_BACKEND_URL);
          const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/workout/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              auth0_id: user?.sub || null,
              preferences: {
                type: 'cardio',
              }
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate workout');
          }

          const data: WorkoutResponse = await response.json();
          setWorkout(data.workout);
          setWorkoutUrl(data.share_url);
          window.history.pushState({}, '', `/workout/${data.workout_id}`);
        }
      } catch (err) {
        console.error('Error fetching workout:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setWorkout(timeBasedWorkout);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkout();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workoutId, user]);

  useEffect(() => {
    if (!workout) return;

    if (workout.type === "time-based") {
      const currentExercise = workout.exercises[currentExerciseIndex];
      const durationMatch = currentExercise.duration?.match(/(\d+)\s*minutes?/);

      if (durationMatch) {
        const minutes = parseInt(durationMatch[1]);
        const seconds = minutes * 60;
        setTimeRemaining(seconds);
        setTotalTime(seconds);

        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              if (currentExerciseIndex < workout.exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
              } else {
                clearInterval(timerRef.current!);
                return 0;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workout, currentExerciseIndex]);

  useEffect(() => {
    if (isResting) {
      timerRef.current = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            clearInterval(timerRef.current!);

            if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
              setCurrentExerciseIndex((prev) => prev + 1);
            }

            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isResting, currentExerciseIndex, workout]);

  const handleExerciseComplete = () => {
    if (workout?.type === "rep-based") {
      setIsResting(true);
      setRestTimeRemaining(60);
    }
  };

  const shareWorkout = () => {
    if (workoutUrl) {
      navigator.clipboard.writeText(workoutUrl)
        .then(() => {
          setShowShareFeedback(true);
          setTimeout(() => setShowShareFeedback(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          alert('Failed to copy link');
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-l-2 border-indigo-400"></div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Error Loading Workout</h2>
        <p className="text-red-400 mb-6">{error || "Workout not available"}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  const calculateProgress = () => {
    const completedExercisesProgress =
      (currentExerciseIndex / workout.exercises.length) * 100;

    let currentExerciseProgress = 0;
    if (workout.type === "time-based" && !isResting && totalTime > 0) {
      currentExerciseProgress =
        ((totalTime - timeRemaining) / totalTime) *
        (100 / workout.exercises.length);
    } else if (isResting) {
      currentExerciseProgress = 100 / workout.exercises.length;
    }

    return Math.min(
      Math.round(completedExercisesProgress + currentExerciseProgress),
      100
    );
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex flex-col text-white">
      <header className="glass-dark sticky top-0 border-b border-white/10 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-montserrat text-2xl font-bold flex items-baseline">
              <motion.span
                {...{ className: "text-indigo-400 mr-1" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Fit
              </motion.span>
              <span className="text-white">AI</span>
            </Link>
            <h1 className="text-xl font-bold text-white border-l border-white/20 pl-6">{workout.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={shareWorkout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
              </motion.div>
              <AnimatePresence>
                {showShareFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 10 }}
                    exit={{ opacity: 0, y: -10 }}
                    {...{
                      className: "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-indigo-900 border border-indigo-500 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap"
                    }}
                  >
                    <div className="text-sm font-medium">Link copied!</div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-transparent border-b-indigo-900"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Exit Workout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-xl p-6 mb-8">
            <p className="text-white/90">{workout.description}</p>
          </div>

          {isResting ? (
            <div className="glass bg-indigo-900/30 backdrop-blur-md rounded-xl p-8 mb-8 text-center border border-indigo-500/30">
              <h2 className="text-2xl font-bold text-indigo-300 mb-2 font-montserrat">
                Rest Time
              </h2>
              <div className="text-5xl font-bold text-white mb-4 font-montserrat">
                {formatTime(restTimeRemaining)}
              </div>
              <p className="text-indigo-300">
                Take a breather before the next exercise
              </p>
            </div>
          ) : (
            <div className="glass backdrop-blur-md rounded-xl p-8 mb-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-1 font-montserrat">
                {currentExercise.name}
              </h2>

              {workout.type === "time-based" && currentExercise.duration && (
                <div className="text-indigo-400 font-medium mb-4">
                  Duration: {currentExercise.duration}
                </div>
              )}

              {workout.type === "rep-based" && currentExercise.reps && (
                <div className="text-indigo-400 font-medium mb-4">
                  Reps: {currentExercise.reps}
                </div>
              )}

              <p className="text-white/80 mb-6">
                {currentExercise.description}
              </p>

              {workout.type === "time-based" && (
                <div className="text-center">
                  <CircularTimer timeRemaining={timeRemaining} totalTime={totalTime} />
                  <div className="text-5xl font-bold text-white mb-4 font-montserrat">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-white/70">Time Remaining</p>
                </div>
              )}

              {workout.type === "rep-based" && (
                <button
                  onClick={handleExerciseComplete}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
                >
                  Finished Exercise
                </button>
              )}
            </div>
          )}

          {currentExerciseIndex < workout.exercises.length - 1 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white/90 mb-4 font-montserrat">
                Up Next:
              </h3>
              <div className="space-y-3">
                {workout.exercises
                  .slice(currentExerciseIndex + 1, currentExerciseIndex + 3)
                  .map((exercise, idx) => (
                    <div
                      key={idx}
                      className="glass-dark rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">
                          {exercise.name}
                        </span>
                        {workout.type === "time-based" && exercise.duration && (
                          <span className="text-sm text-white/70">
                            {exercise.duration}
                          </span>
                        )}
                        {workout.type === "rep-based" && exercise.reps && (
                          <span className="text-sm text-white/70">
                            {exercise.reps} reps
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="glass-dark border-t border-white/10 py-4 px-6 sticky bottom-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </span>
            <span className="text-sm font-medium text-white/80">
              {progress}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutSession;

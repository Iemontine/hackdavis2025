import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function WorkoutSession() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(60); // 1 minute rest
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sample workouts for testing

  const repBasedWorkout: Workout = {
    type: "rep-based",
    name: "Strength Training Circuit",
    description:
      "A strength-focused workout targeting major muscle groups. Perform the specified number of repetitions for each exercise.",
    exercises: [
      {
        name: "Push-Ups",
        reps: 15,
        description:
          "Perform push-ups to strengthen your chest, shoulders, and triceps.",
      },
      {
        name: "Squats",
        reps: 20,
        description: "Perform squats to strengthen your legs and glutes.",
      },
      {
        name: "Bicep Curls",
        reps: 12,
        description:
          "Perform bicep curls with dumbbells to strengthen your arms.",
      },
      {
        name: "Lunges",
        reps: 10,
        description:
          "Perform 10 lunges on each leg to target your quads and glutes.",
      },
      {
        name: "Sit-Ups",
        reps: 20,
        description: "Perform sit-ups to strengthen your core.",
      },
    ],
  };

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

  // For demo purposes, choose a workout type
  useEffect(() => {
    // You can replace this with a prop or state from your parent component
    const workoutType = "rep-based"; // Changed from "time-based" to "rep-based"
    setWorkout(
      workoutType === "time-based" ? timeBasedWorkout : repBasedWorkout
    );
  }, []);

  useEffect(() => {
    if (!workout) return;

    // Initialize timer for time-based workouts
    if (workout.type === "time-based") {
      // Calculate total seconds from the current exercise duration
      const currentExercise = workout.exercises[currentExerciseIndex];
      const durationMatch = currentExercise.duration?.match(/(\d+)\s*minutes?/);

      if (durationMatch) {
        const minutes = parseInt(durationMatch[1]);
        const seconds = minutes * 60;
        setTimeRemaining(seconds);
        setTotalTime(seconds);

        // Start the timer
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              // Time's up for this exercise
              if (currentExerciseIndex < workout.exercises.length - 1) {
                // Move to next exercise
                setCurrentExerciseIndex(currentExerciseIndex + 1);
              } else {
                // Workout complete
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
            // Rest time complete
            setIsResting(false);
            clearInterval(timerRef.current!);

            // If we're on the last exercise, end the workout
            if (currentExerciseIndex >= (workout?.exercises.length || 0) - 1) {
              // Workout complete
            } else {
              // Move to the next exercise
              setCurrentExerciseIndex((prev) => prev + 1);
            }

            return 60; // Reset rest timer
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

  if (!workout) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  // Calculate progress more accurately
  const calculateProgress = () => {
    // Calculate completed exercises progress
    const completedExercisesProgress =
      (currentExerciseIndex / workout.exercises.length) * 100;

    // Calculate current exercise progress
    let currentExerciseProgress = 0;
    if (workout.type === "time-based" && !isResting && totalTime > 0) {
      currentExerciseProgress =
        ((totalTime - timeRemaining) / totalTime) *
        (100 / workout.exercises.length);
    } else if (isResting) {
      // If resting, count the current exercise as completed
      currentExerciseProgress = 100 / workout.exercises.length;
    }

    return Math.min(
      Math.round(completedExercisesProgress + currentExerciseProgress),
      100
    );
  };

  const progress = calculateProgress();

  // Keep this for the time-based exercise's own progress indicator
  const timeProgress =
    workout.type === "time-based"
      ? ((totalTime - timeRemaining) / totalTime) * 100
      : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Exit Workout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Workout description */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
            <p className="text-gray-700">{workout.description}</p>
          </div>

          {isResting ? (
            // Rest timer display
            <div className="bg-indigo-50 rounded-xl p-8 mb-8 text-center shadow-sm border border-indigo-100">
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">
                Rest Time
              </h2>
              <div className="text-5xl font-bold text-indigo-800 mb-4">
                {formatTime(restTimeRemaining)}
              </div>
              <p className="text-indigo-600">
                Take a breather before the next exercise
              </p>
            </div>
          ) : (
            // Current exercise
            <div className="bg-white rounded-xl p-8 mb-8 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {currentExercise.name}
              </h2>

              {workout.type === "time-based" && currentExercise.duration && (
                <div className="text-indigo-600 font-medium mb-4">
                  Duration: {currentExercise.duration}
                </div>
              )}

              {workout.type === "rep-based" && currentExercise.reps && (
                <div className="text-indigo-600 font-medium mb-4">
                  Reps: {currentExercise.reps}
                </div>
              )}

              <p className="text-gray-600 mb-6">
                {currentExercise.description}
              </p>

              {workout.type === "time-based" && (
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-800 mb-4">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-gray-600">Time Remaining</p>
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

          {/* Upcoming exercises */}
          {currentExerciseIndex < workout.exercises.length - 1 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Up Next:
              </h3>
              <div className="space-y-3">
                {workout.exercises
                  .slice(currentExerciseIndex + 1, currentExerciseIndex + 3)
                  .map((exercise, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {exercise.name}
                        </span>
                        {workout.type === "time-based" && exercise.duration && (
                          <span className="text-sm text-gray-600">
                            {exercise.duration}
                          </span>
                        )}
                        {workout.type === "rep-based" && exercise.reps && (
                          <span className="text-sm text-gray-600">
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

      {/* Bottom progress bar */}
      <div className="bg-white border-t border-gray-200 py-4 px-6 sticky bottom-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progress}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
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

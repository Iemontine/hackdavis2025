import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  user: {
    name: string;
    email: string;
    auth0_id: string;
    height: string | null;
    weight: string | null;
    age: number;
    fitness_level: string | null;
    workout_time: string | null;
    goal: string | null;
    picture?: string; // Add picture property for profile image URL
  };
  isLoading: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="glass rounded-xl border border-white/20 p-6 transform transition duration-300 hover:border-indigo-500/30">
      <h2 className="text-xl font-semibold text-white mb-4 font-montserrat">Your Profile</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-71">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-l-2 border-indigo-400"></div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            {user.picture ? (
              <div className="relative">
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-500/30 flex items-center justify-center text-white text-2xl font-bold">
                {user.name ? user.name.charAt(0) : "?"}
              </div>
            )}
            <div className="ml-4">
              <h3 className="font-semibold text-lg text-white">{user.name}</h3>
              <p className="text-white/90">
                {user.fitness_level || "Fitness level not set"} • {user.goal || "Goal not set"}
              </p>
              <p className="text-sm text-white/70">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-white/10">
              <p className="text-sm text-white/70">Height</p>
              <p className="font-medium text-white">{user.height || "Not specified"}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-white/10">
              <p className="text-sm text-white/70">Weight</p>
              <p className="font-medium text-white">{user.weight || "Not specified"}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-white/10">
              <p className="text-sm text-white/70">Age</p>
              <p className="font-medium text-white">{user.age || "Not specified"}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-white/10">
              <p className="text-sm text-white/70">Workout Time</p>
              <p className="font-medium text-white">{user.workout_time || "Not specified"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => navigate('/workout')}
        >
          {!user.height && !user.weight && !user.fitness_level
            ? "Complete Your Profile"
            : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
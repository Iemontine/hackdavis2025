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
  };
  isLoading: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user.name ? user.name.charAt(0) : "?"}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-gray-500">
                {user.fitness_level || "Fitness level not set"} • {user.goal || "Goal not set"}
              </p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium">{user.height || "Not specified"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">{user.weight || "Not specified"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{user.age || "Not specified"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Workout Time</p>
              <p className="font-medium">{user.workout_time || "Not specified"}</p>
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
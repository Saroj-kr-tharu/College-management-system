import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlineIdcard,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineUser,
} from "react-icons/ai";
import { useNavigate } from "react-router";
import { logout } from "../api/auth.api";
import ConfirmationModal from "../components/modal/confirmation.modal";
import { useAuth } from "../context/auth.context";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  // Mutation for logout
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      setUser(null);
      navigate("/login", { replace: true });
      toast.success(data.message || "Logged Out");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 px-4 text-center">
        No user data found. Please log in.
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 pt-12 pb-20 relative">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
                Profile
              </h1>
              <p className="text-indigo-100 text-center text-sm md:text-base">
                Manage your account information
              </p>
            </div>
          </div>

          {/* Avatar - Overlapping the header */}
          <div className="flex justify-center -mt-16 mb-6 relative z-20">
            <div className="relative">
              <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold shadow-2xl ring-8 ring-white">
                {getInitials(user.fullName)}
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="px-8 pb-8">
            <div className="space-y-4">
              {/* User ID */}
              <div className="group hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 hover:border-indigo-200 bg-gradient-to-r from-gray-50 to-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <AiOutlineIdcard className="text-indigo-600 text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                        User ID
                      </p>
                      <p className="text-gray-700 text-sm md:text-base font-medium break-all">
                        {user._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="group hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 hover:border-purple-200 bg-gradient-to-r from-gray-50 to-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <AiOutlineUser className="text-purple-600 text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                        Full Name
                      </p>
                      <p className="text-gray-900 text-base md:text-lg font-semibold">
                        {user.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="group hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 hover:border-pink-200 bg-gradient-to-r from-gray-50 to-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                      <AiOutlineUser className="text-pink-600 text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                        Role
                      </p>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 text-base md:text-lg font-bold uppercase tracking-wide">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 hover:border-blue-200 bg-gradient-to-r from-gray-50 to-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <AiOutlineMail className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                        Email Address
                      </p>
                      <p className="text-gray-900 text-sm md:text-base font-medium break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {/* Change Password Button */}
              <button
                className="cursor-pointer group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={() => navigate("/change-password")}
                disabled={isPending}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <AiOutlineLogout className="text-xl md:text-2xl transform group-hover:rotate-12 transition-transform" />
                <span className="text-base md:text-lg">
                  {isPending ? "Processing..." : "Change Password"}
                </span>
              </button>

              {/* Logout Button */}
              <button
                className="cursor-pointer group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={() => setShow(true)}
                disabled={isPending}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <AiOutlineLogout className="text-xl md:text-2xl transform group-hover:rotate-12 transition-transform" />
                <span className="text-base md:text-lg">
                  {isPending ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          Your account information is secure and private
        </p>
      </div>

      {/* Confirmation Modal for Logout */}
      {show && (
        <ConfirmationModal
          title="Logout Confirmation"
          message="Are you sure you want to log out? You will need to sign in again to access your account."
          confirmText="Logout"
          confirmColor="blue"
          onCancel={() => setShow(false)}
          onConfirm={() => {
            mutate(); // Actual logout
            setShow(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;

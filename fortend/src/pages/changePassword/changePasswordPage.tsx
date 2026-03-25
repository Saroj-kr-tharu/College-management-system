import { AiOutlineLock } from "react-icons/ai";
import ChangePasswordForm from "../../components/forms/change.form";

const ChangePasswordPage = () => {
  return (
    <main className="min-h-screen w-full p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Header with Icon */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AiOutlineLock className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Change Password
            </h2>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Keep your account secure with a strong password
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Gradient Decorative Bar */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="p-8 sm:p-10">
            {/* Title Section */}
            <div className="mb-8 pb-6 border-b border-gray-100">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Update Your Password
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Enter your current password and choose a new strong password to
                enhance your account security
              </p>
            </div>

            {/* Security Tips Banner */}
            <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-indigo-600 shadow-sm">
              <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Password Security Tips
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                  <span>
                    Use at least 8 characters with a mix of letters, numbers,
                    and symbols
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                  <span>Avoid using personal information or common words</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                  <span>Don't reuse passwords from other accounts</span>
                </li>
              </ul>
            </div>

            {/* Form Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <ChangePasswordForm />
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-8 sm:px-10 py-4 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
              <span className="text-lg"></span>
              Your password is encrypted and secure - never shared with anyone
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            All password changes are logged for security purposes
          </p>
        </div>
      </div>
    </main>
  );
};

export default ChangePasswordPage;

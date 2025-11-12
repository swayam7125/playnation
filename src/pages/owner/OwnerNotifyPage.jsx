import React, { useState, useEffect } from "react"; // Import useEffect
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import { FaPaperPlane, FaUsers, FaRunning, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import SegmentedControl from "../../components/common/SegmentedControl";

function OwnerNotifyPage() {
  const { user } = useAuth();

  // --- ⬇⬇⬇ UI/UX FIX: Load state from session storage ---
  const [subject, setSubject] = useState(
    () => sessionStorage.getItem("ownerNotifySubject") || ""
  );
  const [message, setMessage] = useState(
    () => sessionStorage.getItem("ownerNotifyMessage") || ""
  );
  // --- ⬆⬆⬆ END OF FIX ---

  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState("all_players");
  const { showModal } = useModal();

  // --- ⬇⬇⬇ UI/UX FIX: Save state to session storage on change ---
  useEffect(() => {
    sessionStorage.setItem("ownerNotifySubject", subject);
  }, [subject]);

  useEffect(() => {
    sessionStorage.setItem("ownerNotifyMessage", message);
  }, [message]);
  // --- ⬆⬆⬆ END OF FIX ---

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showModal({
        title: "Error",
        message: "Subject and message cannot be empty.",
        showCancel: false,
        confirmText: "OK",
      });
      return;
    }

    let targetDescription =
      targetType === "all_players"
        ? "all players on the platform"
        : "players who have visited your venues";

    showModal({
      title: "Confirm Notification",
      message: `Are you sure you want to send this message to ${targetDescription}?`,
      confirmText: "Yes, Send",
      confirmStyle: "primary",
      showCancel: true,
      onConfirm: async () => {
        setLoading(true);
        const loadingToast = toast.loading("Sending notification...");

        const payload = {
          title: subject,
          body: message,
          sender_type: "owner",
          recipient_type: targetType,
          recipient_ids: null,
          owner_id: targetType === "visitors" ? user.id : null,
        };

        try {
          const { error } = await supabase.rpc("create_notification", payload);
          if (error) throw error;

          toast.success("Notification sent successfully!", {
            id: loadingToast,
          });

          // --- ⬇⬇⬇ UI/UX FIX: Clear state and storage on success ---
          setSubject("");
          setMessage("");
          sessionStorage.removeItem("ownerNotifySubject");
          sessionStorage.removeItem("ownerNotifyMessage");
          // --- ⬆⬆⬆ END OF FIX ---
        } catch (err) {
          console.error("Full notification error:", err);
          let errorMessage = "An unknown error occurred.";
          if (typeof err.details === "string") {
            errorMessage = err.details;
          } else if (typeof err.message === "string") {
            errorMessage = err.message;
          }
          toast.error(`Failed to send: ${errorMessage}`, {
            id: loadingToast,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const targetOptions = [
    { label: "All Players", value: "all_players", icon: <FaUsers /> },
    { label: "My Visitors", value: "visitors", icon: <FaRunning /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-text mb-3">
            Notify Players
          </h1>
          <p className="text-lg text-medium-text">
            Engage with your player community.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-card-bg p-8 rounded-2xl shadow-lg border border-border-color-light">
          <form onSubmit={handleSendNotification} className="space-y-8">
            {/* Step 1: Audience */}
            <fieldset>
              <legend className="text-xl font-semibold text-dark-text mb-4">
                Step 1: Choose Your Audience
              </legend>
              <div className="space-y-4">
                <SegmentedControl
                  options={targetOptions}
                  value={targetType}
                  onChange={setTargetType}
                />
                {targetType === "all_players" && (
                  <p className="text-sm text-medium-text p-3 bg-hover-bg rounded-lg border border-border-color-light">
                    This will send a notification to **all players** on the
                    platform.
                  </p>
                )}
                {targetType === "visitors" && (
                  <p className="text-sm text-medium-text p-3 bg-hover-bg rounded-lg border border-border-color-light">
                    This will only send to players who have previously booked at
                    one of **your venues**.
                  </p>
                )}
              </div>
            </fieldset>

            {/* Step 2: Message */}
            <fieldset>
              <legend className="text-xl font-semibold text-dark-text mb-4">
                Step 2: Compose Your Message
              </legend>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-medium-text mb-2"
                    S
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., 20% Off This Weekend!"
                    className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-medium-text mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="8"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your announcement or offer details here..."
                    className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                    required
                  ></textarea>
                </div>
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white bg-primary-green hover:bg-primary-green-dark transition-all duration-300 shadow-sm hover:shadow-lg disabled:bg-gray-400 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
              <span>{loading ? "Sending..." : "Send Notification"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OwnerNotifyPage;

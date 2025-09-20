import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useModal } from "../../ModalContext";
import { FaPaperPlane } from "react-icons/fa";

function AdminNotifyPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showModal({
        title: "Error",
        message: "Subject and message cannot be empty.",
      });
      return;
    }

    const isConfirmed = await showModal({
      title: "Confirm Broadcast",
      message: "Are you sure you want to send this message to all players?",
      confirmText: "Yes, Send Broadcast",
      confirmStyle: "success",
    });

    if (isConfirmed) {
      setLoading(true);
      try {
        // We will create this Edge Function in the next step
        const { error } = await supabase.functions.invoke("broadcast-message", {
          body: { subject, message },
        });

        if (error) throw error;

        await showModal({
          title: "Success",
          message: "Your message has been sent to all players successfully!",
        });
        setSubject("");
        setMessage("");
      } catch (err) {
        await showModal({
          title: "Error",
          message: `Failed to send broadcast: ${err.message}`,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-dark-text mb-8">
        Broadcast Notifications
      </h1>
      <div className="max-w-3xl mx-auto bg-card-bg p-8 rounded-2xl shadow-lg border border-border-color-light">
        <form onSubmit={handleSendBroadcast}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-medium-text mb-2"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., New Weekend Offer!"
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
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white bg-primary-green hover:bg-primary-green-dark transition-all duration-300 shadow-sm hover:shadow-lg disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <FaPaperPlane />
            {loading ? "Sending..." : "Send Broadcast to All Players"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminNotifyPage;

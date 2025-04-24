const notifications = {
  today: [
    {
      title: "Video Call Appointment",
      message: "We’ll send you a link to join the call at the booking details.",
      time: "5m ago",
    },
    {
      title: "Appointment with Dr. Robert",
      message: "Your appointment is confirmed.",
      time: "21m ago",
    },
    {
      title: "Schedule Changed",
      message:
        "You have successfully changes your appointment with Dr. Joshua Doe.",
      time: "8h ago",
    },
    {
      title: "Appointment with Dr. Lector",
      message: "Your appointment is 30min from now.",
      time: "1w ago",
    },
  ],
  past: [
    {
      title: "Appointment Cancelled",
      message:
        "You cancelled your appointment with Dr. Floyd Miles. No funds will be returned to your account.",
      time: "1d ago",
    },
    {
      title: "New Paypal Added",
      message: "Your Paypal has been successfully linked with your account.",
      time: "23w ago",
    },
  ],
};

export default function NotificationScreen() {
  return (
    <div className="max-w-90rem mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-[#1D1D1F]">Notification</h1>

      <div>
        <h2 className="text-sm font-semibold text-[#6B7280] mb-2">
          Today ({notifications.today.length})
        </h2>
        <div className="space-y-3">
          {notifications.today.map((note, idx) => (
            <div
              key={idx}
              className="bg-[#F3F4F6] text-sm p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-black mb-1">{note.title}</p>
                <p className="text-gray-600">{note.message}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{note.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[#6B7280] mb-2">
          Past ({notifications.past.length})
        </h2>
        <div className="space-y-3">
          {notifications.past.map((note, idx) => (
            <div
              key={idx}
              className="bg-[#F3F4F6] text-sm p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-black mb-1">{note.title}</p>
                <p className="text-gray-600">{note.message}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{note.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

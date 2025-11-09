import dayjs from 'dayjs';
import { useDemoData } from '../contexts/DemoDataContext';

const NotificationsPage = () => {
  const { notifications } = useDemoData();

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-3xl border border-darkBlue/10 bg-white/80 p-6 shadow ${notification.isRead ? 'opacity-70' : ''}`}
        >
          <div className="flex items-center justify-between text-xs text-darkBlue/50">
            <span className="font-semibold text-darkBlue">{notification.title}</span>
            <span>{dayjs(notification.createdAt).fromNow()}</span>
          </div>
          <p className="mt-2 text-sm text-darkBlue/70">{notification.message}</p>
          {notification.link && (
            <a href={notification.link} className="mt-3 inline-flex text-sm font-medium text-mistBlueDark">
              View details →
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;

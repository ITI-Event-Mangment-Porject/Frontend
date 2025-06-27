// Mock data for notifications
export const generateMockNotifications = () => {
  const statuses = ['Success', 'Failed', 'Pending'];
  const titles = [
    'System Update Notification #1',
    'System Update Notification #2',
    'System Update Notification #3',
    'System Update Notification #4',
    'System Update Notification #5',
    'System Update Notification #6',
  ];

  const recipients = [
    'Jane Smith, Bob Williams, Jane Smith',
    'All System Users',
    'Editors',
    'Users, Admins',
    'Support, Support',
    'Jane Smith, Bob Williams, Bob Williams',
  ];

  const dates = [
    'May 17, 2025',
    'Jun 25, 2025',
    'Jun 15, 2025',
    'Jun 17, 2025',
    'Jun 22, 2025',
    'Jun 22, 2025',
  ];

  const times = [
    '20:25:31:09',
    '21:25:36:56',
    '22:28:22:16',
    '20:28:16:27',
    '16:25:14:08',
    '20:28:19:01',
  ];

  const failureReasons = [
    'Email delivery failed: User inbox full',
    'Invalid recipient email address',
    'SMTP server connection timeout',
    'Message rejected by recipient server',
  ];

  const messages = [
    'This is an important system update notification regarding scheduled maintenance.',
    'Please be aware of upcoming changes to the platform that will affect all users.',
    'Security patch has been applied to all systems. No user action required.',
    'Your account requires verification. Please follow the instructions provided.',
    "New feature announcement: We've added exciting capabilities to the platform.",
  ];

  return Array.from({ length: 25 }, (_, i) => {
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];

    return {
      id: i + 1,
      title: titles[i % titles.length],
      recipients: recipients[i % recipients.length],
      sentDate: dates[i % dates.length],
      sentTime: times[i % times.length],
      status,
      message: messages[i % messages.length],
      deliveryDetails:
        status === 'Success' ? 'Delivered to all recipients' : null,
      failureReason:
        status === 'Failed'
          ? failureReasons[Math.floor(Math.random() * failureReasons.length)]
          : null,
    };
  });
};

export default {
  generateMockNotifications,
};

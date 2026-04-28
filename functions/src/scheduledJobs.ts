import { onSchedule } from 'firebase-functions/v2/scheduler';

export const nightlyEditorialJob = onSchedule(
  {
    schedule: 'every day 03:00',
    timeZone: 'UTC',
    secrets: ['INTERNAL_CRON_SECRET'],
  },
  async () => {
    // Placeholder para sincronização futura de analytics e geração de insights.
    return;
  },
);

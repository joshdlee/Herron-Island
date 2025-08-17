export const config = {
  featureFlags: {
    // Set to false to disable prototype schedule and use regular summer/winter schedules
    usePrototypeSchedule: true,
    // Prototype schedule will only be active between these dates when flag is true
    prototypeScheduleStartDate: new Date('2025-08-11'),
    prototypeScheduleEndDate: new Date('2025-10-05'),
  }
};
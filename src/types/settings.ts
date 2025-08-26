export interface NotificationSettings {
  doseReminder: {
    enabled: boolean;
    time: string; // HH:MM format
  };
  scoreNudges: boolean;
  raffleAlerts: boolean;
  milestones: boolean;
}

export interface PrivacySettings {
  showInRankings: boolean;
  shareTestimonies: boolean;
}

export interface GeneralSettings {
  language: 'pt' | 'en';
  timezone: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  general: GeneralSettings;
}
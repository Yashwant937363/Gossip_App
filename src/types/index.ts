export interface UserSettings {
  translation: {
    language: string;
    alwaysTranslate: boolean;
  };
  summarization: {
    format: "paragraph" | "bullet" | "structured" | string;
  };
}

export interface UserProfile {
  _id?: string;
  uid: string;
  username: string;
  email: string;
  profile?: string;
  fullname?: { firstname: string; lastname: string } | null;
  dob?: string | null;
  settings: UserSettings;
}

export interface Friend {
  uid: string;
  username: string;
  profile: string;
  online?: boolean;
}

export interface TranslatedTextItem {
  language: string;
  translatedText: string;
}

export interface ChatMessage {
  _id: string;
  Sender_ID: string;
  Receiver_ID: string;
  text: string;
  type: "text" | "image";
  seen: boolean;
  translatedText: TranslatedTextItem[];
  createdAt: string;
}

export interface SearchUserItem {
  uid: string;
  Username?: string;
  username?: string;
  ProfilePicture?: string;
  profile?: string;
}

export interface ImageAnalysisResult {
  title: string;
  description: string;
  details: string[];
  mood?: string;
}

export interface SummarizeStructured {
  topic: string;
  keyPoints: string[];
  conclusion: string;
}

export interface AIChatMessage {
  text: string;
  ai: boolean;
  type: "text";
  time: number;
}

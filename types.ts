
// FIX: Defined and exported the Theme interface to resolve circular dependency issues.
export interface Theme {
  title: string;
  prompt: string;
  isSpecial?: boolean;
  category?: string;
  badge?: string;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  caption: string;
  storyText?: string;
  themeCategory?: string;
}

export interface GenerativePart {
    inlineData: {
      data: string;
      mimeType: string;
    };
}

export interface ThemeSubcategory {
    title: string;
    themes: Theme[];
}

export interface ThemeCategory {
    id?: string;
    title: string;
    description: string;
    subcategories: ThemeSubcategory[];
}

export interface AIDogConcept {
  breed: string;
  name: string;
  personality: string;
  handle: string;
  imagePrompt: string;
}

// FIX: Added PrintOrderDetails interface for use in the PrintAgentModal.
export interface PrintOrderDetails {
  coverImageNumber: number;
  bookTitle: string;
  shippingAddress: string;
}

// FIX: Added ChatMessage interface for use in the PrintAgentModal.
export interface ChatMessage {
  id: number;
  sender: 'user' | 'agent';
  text?: string;
  type?: 'loading' | 'confirmation' | 'success';
  orderDetails?: PrintOrderDetails;
}

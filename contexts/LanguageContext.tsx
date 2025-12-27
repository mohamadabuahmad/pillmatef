import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Menu
    menu: 'Menu',
    home: 'Home',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    
    // Settings
    general: 'General',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    about: 'About',
    
    // Theme
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    
    // Profile
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    name: 'Name',
    email: 'Email',
    save: 'Save',
    cancel: 'Cancel',
    
    // Password
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    
    // Common
    close: 'Close',
  },
  ar: {
    menu: 'القائمة',
    home: 'الرئيسية',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    general: 'عام',
    theme: 'المظهر',
    language: 'اللغة',
    notifications: 'الإشعارات',
    privacy: 'الخصوصية',
    about: 'حول',
    light: 'فاتح',
    dark: 'داكن',
    auto: 'تلقائي',
    editProfile: 'تعديل الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    save: 'حفظ',
    cancel: 'إلغاء',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    close: 'إغلاق',
  },
  he: {
    menu: 'תפריט',
    home: 'בית',
    settings: 'הגדרות',
    profile: 'פרופיל',
    logout: 'התנתק',
    general: 'כללי',
    theme: 'ערכת נושא',
    language: 'שפה',
    notifications: 'התראות',
    privacy: 'פרטיות',
    about: 'אודות',
    light: 'בהיר',
    dark: 'כהה',
    auto: 'אוטומטי',
    editProfile: 'ערוך פרופיל',
    changePassword: 'שנה סיסמה',
    name: 'שם',
    email: 'אימייל',
    save: 'שמור',
    cancel: 'ביטול',
    currentPassword: 'סיסמה נוכחית',
    newPassword: 'סיסמה חדשה',
    confirmPassword: 'אשר סיסמה',
    close: 'סגור',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}


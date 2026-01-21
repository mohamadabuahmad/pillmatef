// Jest setup file for React Native testing
// This runs AFTER jest-expo has set up React Native

// Import jest-native AFTER jest-expo has set up React Native
try {
  require("@testing-library/jest-native/extend-expect");
} catch (e) {
  // Ignore if not available
}

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

// Mock Expo modules
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  usePathname: () => "/",
  Link: ({ children, href, ...props }: any) => {
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Mock DesignSystem
jest.mock("./constants/DesignSystem", () => ({
  DesignSystem: {
    colors: {
      background: "#ffffff",
      surface: "#f5f5f5",
      textPrimary: "#000000",
      textSecondary: "#666666",
      textTertiary: "#999999",
      primary: "#007AFF",
      error: "#FF3B30",
      success: "#34C759",
      border: "#E0E0E0",
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      base: 16,
      lg: 24,
      xl: 32,
      "2xl": 40,
      "3xl": 48,
      "4xl": 64,
    },
    typography: {
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      lineHeight: {
        normal: 1.5,
        relaxed: 1.75,
      },
      letterSpacing: {
        tight: -0.5,
      },
    },
    borderRadius: {
      base: 8,
      lg: 16,
      full: 9999,
    },
    shadows: {
      sm: {},
      md: {},
      base: {},
    },
    layout: {
      containerPadding: 20,
      inputPadding: 12,
      buttonPadding: 14,
      cardPadding: 16,
    },
  },
  getThemeColors: jest.fn(() => ({
    background: "#ffffff",
    surface: "#f5f5f5",
    textPrimary: "#000000",
    textSecondary: "#666666",
    textTertiary: "#999999",
    primary: "#007AFF",
    error: "#FF3B30",
    success: "#34C759",
    border: "#E0E0E0",
  })),
}));

// Mock contexts
jest.mock("./contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    language: "en",
    setLanguage: jest.fn(),
  }),
}));

jest.mock("./contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
    isDark: false,
  }),
}));

// Mock Firebase
jest.mock("firebase/app", () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  signOut: jest.fn(),
  getIdToken: jest.fn(),
  getReactNativePersistence: jest.fn(() => ({
    type: "ReactNative",
    async: true,
  })),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    // Return an unsubscribe function
    return jest.fn();
  }),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  onValue: jest.fn(() => jest.fn()),
  off: jest.fn(),
}));

jest.mock("firebase/functions", () => ({
  getFunctions: jest.fn(() => ({})),
  httpsCallable: jest.fn(),
}));

// Mock hooks
jest.mock("./hooks/useMedicationSafety", () => ({
  useMedicationSafety: jest.fn(() => ({
    checkAllergy: jest.fn().mockResolvedValue({
      hasAllergy: false,
      severity: "none",
      message: "",
      shouldBlock: false,
    }),
    checkInteraction: jest.fn().mockResolvedValue({
      canTakeTogether: true,
      interactionLevel: "none",
      timeGapRequired: 0,
      message: "",
      recommendation: "take_together",
    }),
    getUserAllergies: jest.fn().mockResolvedValue([]),
    checking: false,
  })),
}));

jest.mock("./hooks/useMedicationSuggestions", () => ({
  useMedicationSuggestions: jest.fn(() => ({
    suggestions: [],
    loading: false,
  })),
}));

jest.mock("./hooks/notifications", () => ({
  ensureNotificationPermissions: jest.fn().mockResolvedValue(true),
  scheduleDoseNotification: jest.fn(),
  cancelAllDoseNotifications: jest.fn(),
  parseHHMM: jest.fn((time) => {
    const [hh, mm] = time.split(':').map(Number);
    return { hh, mm };
  }),
}));

// Mock SafeAreaView
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, ...props }: any) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, props, children);
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Alert.alert - use a more robust approach
const mockAlertFn = jest.fn();
Object.defineProperty(require("react-native"), 'Alert', {
  get: () => ({
    alert: mockAlertFn,
  }),
  configurable: true,
});

// Mock src/firebase module
jest.mock("./src/firebase", () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  rtdb: {},
  functions: {},
  getFunctionsInstance: jest.fn(() => ({})),
}));

// Suppress console errors in tests (but keep them for debugging)
const originalError = console.error;
const originalWarn = console.warn;

global.console = {
  ...console,
  error: (...args: any[]) => {
    // Only suppress specific errors
    if (args[0]?.toString().includes("Warning:")) {
      return;
    }
    originalError(...args);
  },
  warn: (...args: any[]) => {
    // Suppress warnings in tests
    return;
  },
};

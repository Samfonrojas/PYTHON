import React, { createContext, useState, useContext, useCallback } from 'react';

const TRANSLATIONS = {
  es: {
    'nav.myHome': 'Mi Inicio',
    'nav.syllabus': 'Programa',
    'nav.aiAssistant': 'Asistente de IA',
    'nav.tools': 'Herramientas',
    'lesson.enterTopic': 'O introduce un tema personalizado',
    'lesson.topicPlaceholder': 'p. ej., "Clases y Objetos"',
    'lesson.suggestedTopics': 'Empieza con un tema sugerido:',
    'lesson.selectDifficulty': 'Selecciona la dificultad',
    'lesson.newLesson': 'Generar Lección',
    'lesson.generating': 'Generando...',
    'lesson.welcomeTitle': '¡Bienvenido a la Academia de Python!',
    'lesson.welcomeMessage': 'Elige un tema y una dificultad para empezar a aprender.',
    'lesson.generatingMessage': 'Generando tu lección...',
    'editor.title': 'Editor de Código',
    'editor.description': 'Escribe tu código de Python abajo y ejecútalo para comprobar tu solución.',
    'editor.run': 'Ejecutar',
    'editor.running': 'Ejecutando...',
    'editor.reset': 'Reiniciar',
    'editor.nextLesson': 'Siguiente Lección',
    'console.initial': 'Haz clic en "Ejecutar" para ver la salida aquí.',
    'console.running': 'Ejecutando código...',
    'console.success': '¡Correcto!',
    'console.fail': 'Necesita Mejorar',
    'console.feedback': 'Comentarios:',
    'console.output': 'Salida:',
    'console.noOutput': '(Sin salida)',
    'chatbot.title': 'Asistente de IA',
    'chatbot.greeting': '¡Pregúntame cualquier cosa sobre Python!',
    'chatbot.placeholder': 'Escribe tu pregunta...',
    'congrats.message': '¡Felicidades por completar la lección! Por favor, selecciona un nuevo tema o dificultad para continuar.',
    'topics.VariableDefinition': 'Definición de Variables',
    'topics.Lists': 'Listas y Arreglos',
    'topics.Loops': 'Bucles (for/while)',
    'topics.Functions': 'Funciones',
    'topics.Dictionaries': 'Diccionarios',
    'topics.RandomModule': 'Módulo Random',
    'topics.Comprehensions': 'List Comprehensions',
    'difficulty.Beginner': 'Principiante',
    'difficulty.Intermediate': 'Intermedio',
    'difficulty.Advanced': 'Avanzado',
  },
  en: {
    'nav.myHome': 'My Home',
    'nav.syllabus': 'Syllabus',
    'nav.aiAssistant': 'AI Assistant',
    'nav.tools': 'Tools',
    'lesson.enterTopic': 'Or enter a custom topic',
    'lesson.topicPlaceholder': 'e.g., "Classes and Objects"',
    'lesson.suggestedTopics': 'Start with a suggested topic:',
    'lesson.selectDifficulty': 'Select difficulty',
    'lesson.newLesson': 'Generate Lesson',
    'lesson.generating': 'Generating...',
    'lesson.welcomeTitle': 'Welcome to Python Coder Academy!',
    'lesson.welcomeMessage': 'Select a topic and difficulty level to start learning.',
    'lesson.generatingMessage': 'Generating your lesson...',
    'editor.title': 'Code Editor',
    'editor.description': 'Type your Python code below and run it to check your solution.',
    'editor.run': 'Run',
    'editor.running': 'Running...',
    'editor.reset': 'Reset',
    'editor.nextLesson': 'Next Lesson',
    'console.initial': 'Click "Run" to see the output here.',
    'console.running': 'Running code...',
    'console.success': 'Success!',
    'console.fail': 'Needs Improvement',
    'console.feedback': 'Feedback:',
    'console.output': 'Output:',
    'console.noOutput': '(No output)',
    'chatbot.title': 'AI Assistant',
    'chatbot.greeting': 'Ask me anything about Python!',
    'chatbot.placeholder': 'Type your question...',
    'congrats.message': 'Congratulations on completing the lesson! Please select a new topic or difficulty to continue.',
    'topics.VariableDefinition': 'Variable Definition',
    'topics.Lists': 'Lists & Arrays',
    'topics.Loops': 'Loops (for/while)',
    'topics.Functions': 'Functions',
    'topics.Dictionaries': 'Dictionaries',
    'topics.RandomModule': 'Random Module',
    'topics.Comprehensions': 'List Comprehensions',
    'difficulty.Beginner': 'Beginner',
    'difficulty.Intermediate': 'Intermediate',
    'difficulty.Advanced': 'Advanced',
  },
};

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = useCallback((key: keyof typeof TRANSLATIONS['en']): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key];
  }, [language]);

  // FIX: Replaced JSX with React.createElement to resolve parsing errors in .ts file.
  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
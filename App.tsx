
import React, { useState, useCallback } from 'react';
import TopNav from './components/TopNav';
import LessonPanel from './components/LessonPanel';
import CodeEditorPanel from './components/CodeEditorPanel';
import Chatbot from './components/Chatbot';
import { Lesson, Difficulty, CodeEvaluation } from './types';
import { generateLesson, evaluateCode } from './services/geminiService';
import { useTranslation } from './i18n';
import { BookOpenIcon } from './components/Icons';

const App: React.FC = () => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState<boolean>(false);
  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { language, t } = useTranslation();

  const handleGenerateLesson = useCallback(async (topic: string, difficulty: Difficulty) => {
    setIsLessonLoading(true);
    setLesson(null);
    setEvaluation(null);
    setIsCorrect(false);
    
    const newLesson = await generateLesson(topic, difficulty, language);
    setLesson(newLesson);
    setIsLessonLoading(false);
  }, [language]);
  
  const handleRunCode = useCallback(async (code: string) => {
    if (!lesson) return;
    
    setIsCodeRunning(true);
    setEvaluation(null);
    
    const result = await evaluateCode(lesson.objective, code, language);
    setEvaluation(result);
    setIsCorrect(result?.is_correct || false);
    setIsCodeRunning(false);
  }, [lesson, language]);

  const handleNextLesson = useCallback(() => {
    alert(t('congrats.message'));
    setLesson(null);
    setEvaluation(null);
    setIsCorrect(false);
  }, [t]);

  return (
    <div className="flex flex-col h-screen font-sans bg-bunker-950 text-bunker-200 antialiased">
      <TopNav onToggleChat={() => setIsChatOpen(!isChatOpen)} />
      <div className="flex-grow flex overflow-hidden">
        <aside className="w-16 bg-bunker-900/50 border-r border-bunker-800 flex flex-col items-center py-4">
            <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
                <BookOpenIcon className="w-6 h-6" />
            </div>
        </aside>
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            <LessonPanel 
              lesson={lesson} 
              isLoading={isLessonLoading} 
              onGenerateLesson={handleGenerateLesson}
            />
            <CodeEditorPanel
              starterCode={lesson?.starter_code || `# ${t('lesson.welcomeMessage')}`}
              evaluation={evaluation}
              onRunCode={handleRunCode}
              isLoading={isCodeRunning}
              isCorrect={isCorrect}
              onNextLesson={handleNextLesson}
            />
        </main>
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;

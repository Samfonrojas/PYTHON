import React, { useState } from 'react';
import { Lesson, Difficulty } from '../types';
import { useTranslation } from '../i18n';
import { SparklesIcon } from './Icons';

interface LessonPanelProps {
  lesson: Lesson | null;
  isLoading: boolean;
  onGenerateLesson: (topic: string, difficulty: Difficulty) => void;
}

const parseMarkdown = (text: string) => {
    return text
        .replace(/```python\n([\s\S]*?)```/g, '<pre class="bg-bunker-900 text-sm text-cyan-300 p-4 rounded-md overflow-x-auto my-4"><code class="language-python">$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-bunker-700 text-cyan-400 rounded px-1 py-0.5 text-sm">$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-3 text-white">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-2 text-white">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2 text-bunker-100">$1</h3>')
        .replace(/- (.*$)/gim, '<li class="ml-6">$1</li>')
        .replace(/\n/g, '<br />');
};

const suggestedTopics = [
    { key: 'topics.VariableDefinition', value: 'Variable Definition' },
    { key: 'topics.Lists', value: 'Lists & Arrays' },
    { key: 'topics.Loops', value: 'Loops (for/while)' },
    { key: 'topics.Functions', value: 'Functions' },
    { key: 'topics.Dictionaries', value: 'Dictionaries' },
    { key: 'topics.RandomModule', value: 'Random Module' },
    { key: 'topics.Comprehensions', value: 'List Comprehensions' },
];

const LessonGenerator: React.FC<{onGenerate: (topic: string, difficulty: Difficulty) => void, isLoading: boolean}> = ({ onGenerate, isLoading }) => {
    const { t } = useTranslation();
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState(Difficulty.Beginner);

    const handleGenerate = () => onGenerate(topic, difficulty);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t('lesson.welcomeTitle')}</h2>
            <p className="text-bunker-300 mb-8 max-w-md">{t('lesson.welcomeMessage')}</p>
            <div className="bg-bunker-900 p-6 rounded-lg border border-bunker-800 shadow-lg flex flex-col gap-4 w-full max-w-md">
                <div className="flex flex-col items-start">
                    <label htmlFor="topic-input" className="text-sm font-medium text-bunker-300 mb-1.5">{t('lesson.enterTopic')}</label>
                    <input
                        id="topic-input"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={isLoading}
                        placeholder={t('lesson.topicPlaceholder')}
                        className="w-full bg-bunker-800 border border-bunker-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    />
                </div>

                <div className="w-full">
                    <p className="text-sm text-bunker-400 mb-2 text-left">{t('lesson.suggestedTopics')}</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map(({ key, value }) => (
                            <button
                                key={key}
                                onClick={() => setTopic(value)}
                                disabled={isLoading}
                                className="bg-bunker-700 hover:bg-bunker-600 text-bunker-200 text-xs font-medium px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
                            >
                                {t(key as any)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-start mt-2">
                    <label className="text-sm font-medium text-bunker-300 mb-1.5">{t('lesson.selectDifficulty')}</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        disabled={isLoading}
                        className="w-full bg-bunker-800 border border-bunker-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    >
                        {Object.values(Difficulty).map(d => <option key={d} value={d}>{t(`difficulty.${d}` as any)}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic.trim()}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 disabled:text-bunker-400 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-md transition duration-200"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? t('lesson.generating') : t('lesson.newLesson')}
                </button>
            </div>
        </div>
    );
};

const LessonPanel: React.FC<LessonPanelProps> = ({ lesson, isLoading, onGenerateLesson }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center bg-bunker-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <p className="mt-4 text-bunker-400">{t('lesson.generatingMessage')}</p>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="p-8 bg-bunker-950">
        <LessonGenerator onGenerate={onGenerateLesson} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-bunker-950 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-white border-b-2 border-cyan-500/50 pb-3 mb-6">{lesson.title}</h2>
        <div 
          className="prose prose-invert max-w-none text-bunker-300 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(lesson.explanation) }}
        />
      </div>
    </div>
  );
};

export default LessonPanel;
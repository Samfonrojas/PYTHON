
import React from 'react';
import { CodeEvaluation } from '../types';
import { PlayIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from './Icons';
import { useTranslation } from '../i18n';

interface CodeEditorPanelProps {
  starterCode: string;
  evaluation: CodeEvaluation | null;
  onRunCode: (code: string) => void;
  isLoading: boolean;
  isCorrect: boolean;
  onNextLesson: () => void;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  starterCode,
  evaluation,
  onRunCode,
  isLoading,
  isCorrect,
  onNextLesson
}) => {
  const [code, setCode] = React.useState(starterCode);
  const { t } = useTranslation();

  React.useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  const handleRun = () => onRunCode(code);
  const handleReset = () => setCode(starterCode);

  const ConsoleOutput: React.FC = () => {
    if (isLoading && !evaluation) {
      return <div className="p-4 text-yellow-400">{t('console.running')}</div>;
    }
    if (!evaluation) {
      return <div className="p-4 text-bunker-500">{t('console.initial')}</div>;
    }
    return (
      <div className="p-4">
        <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${evaluation.is_correct ? 'border-green-500/30' : 'border-red-500/30'}`}>
          {evaluation.is_correct ? (
            <CheckIcon className="w-6 h-6 text-green-400" />
          ) : (
            <XMarkIcon className="w-6 h-6 text-red-400" />
          )}
          <h3 className={`text-lg font-bold ${evaluation.is_correct ? 'text-green-400' : 'text-red-400'}`}>
            {evaluation.is_correct ? t('console.success') : t('console.fail')}
          </h3>
        </div>
        <div className="mb-3">
          <h4 className="font-semibold text-bunker-300 mb-1">{t('console.feedback')}</h4>
          <p className="text-bunker-400 text-sm">{evaluation.feedback}</p>
        </div>
        <div>
          <h4 className="font-semibold text-bunker-300 mb-1">{t('console.output')}</h4>
          <pre className="text-sm bg-bunker-950 p-2 rounded-md whitespace-pre-wrap">{evaluation.output || t('console.noOutput')}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-bunker-900">
      <div className="flex-none bg-bunker-800 border-b border-bunker-700 px-4 py-2">
        <span className="text-sm text-bunker-200 bg-bunker-900 px-3 py-1.5 rounded-t-md">main.py</span>
      </div>
      <div className="flex-grow relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-bunker-900 text-cyan-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
          spellCheck="false"
        />
      </div>
      <div className="flex-none bg-bunker-800/50 min-h-[200px] max-h-[40%] flex flex-col border-t border-bunker-700">
        <div className="flex-grow overflow-y-auto">
           <ConsoleOutput />
        </div>
      </div>
      <div className="flex-none p-3 bg-bunker-900 border-t border-bunker-800 flex items-center justify-between">
         <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm text-bunker-300 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            {t('editor.reset')}
          </button>
        <div className="flex items-center gap-3">
            <button
                onClick={handleRun}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md transition duration-200"
            >
                <PlayIcon className="w-5 h-5" />
                {isLoading ? t('editor.running') : t('editor.run')}
            </button>
            <button
                onClick={onNextLesson}
                disabled={!isCorrect || isLoading}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:text-bunker-400 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md transition duration-200"
            >
                {t('editor.nextLesson')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;

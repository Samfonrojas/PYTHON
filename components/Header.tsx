
import React from 'react';
import { Difficulty } from '../types';
import { SparklesIcon } from './Icons';

interface HeaderProps {
  onGenerateLesson: (topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

const topics = ["Variables", "Data Types", "Lists", "Loops", "Functions", "Dictionaries", "Classes"];

const Header: React.FC<HeaderProps> = ({ onGenerateLesson, isLoading }) => {
  const [topic, setTopic] = React.useState(topics[0]);
  const [difficulty, setDifficulty] = React.useState(Difficulty.Beginner);

  const handleGenerate = () => {
    onGenerateLesson(topic, difficulty);
  };

  return (
    <header className="bg-bunker-900/50 backdrop-blur-sm p-4 border-b border-bunker-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src="https://www.python.org/static/favicon.ico" alt="Python logo" className="w-8 h-8"/>
        <h1 className="text-xl font-bold text-white">Python Coder Academy</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
          className="bg-bunker-800 border border-bunker-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        >
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          disabled={isLoading}
          className="bg-bunker-800 border border-bunker-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        >
          {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md transition duration-200"
        >
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'New Lesson'}
        </button>
      </div>
    </header>
  );
};

export default Header;

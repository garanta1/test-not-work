import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import FileUpload from './components/FileUpload';
import ResumeList from './components/ResumeList';
import { ResumeItem } from './api';

function App() {
  const [newResume, setNewResume] = useState<ResumeItem | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          📄 Анализатор резюме
        </h1>
        <ThemeToggle />
      </header>
      <main className="max-w-5xl mx-auto p-4 space-y-8">
        <FileUpload onSuccess={setNewResume} />
        {newResume && (
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded">
            <p className="text-green-800 dark:text-green-200">
              Успешно обработано: <strong>{newResume.full_name}</strong> (оценка: {newResume.score}/100)
            </p>
          </div>
        )}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Все резюме
          </h2>
          <ResumeList />
        </section>
      </main>
    </div>
  );
}

export default App;
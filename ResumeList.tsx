import { useEffect, useState } from 'react';
import { fetchResumes, ResumeItem } from '../api';
import ResumeCard from './ResumeCard';

export default function ResumeList() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = async (search = '') => {
    try {
      const data = await fetchResumes(search);
      setResumes(data);
    } catch {
      alert('Ошибка загрузки списка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по ФИО, навыкам, опыту"
          className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={() => load(query)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Найти
        </button>
      </div>
      {resumes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Пока нет обработанных резюме.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.map(r => (
            <ResumeCard key={r.id} resume={r} />
          ))}
        </div>
      )}
    </div>
  );
}
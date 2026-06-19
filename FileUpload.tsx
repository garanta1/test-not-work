import { useState } from 'react';
import { uploadResume, parseUrl, ResumeItem } from '../api';

interface Props {
  onSuccess: (resume: ResumeItem) => void;
}

export default function FileUpload({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setLoading(true);
    try {
      const resume = await uploadResume(e.target.files[0]);
      onSuccess(resume);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Ошибка загрузки файла';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUrl = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const resume = await parseUrl(url);
      onSuccess(resume);
      setUrl('');
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Ошибка обработки ссылки';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Загрузить файл (PDF или DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFile}
          disabled={loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-600 file:text-blue-700 dark:file:text-gray-200 hover:file:bg-blue-100"
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ссылка на резюме hh.ru"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleUrl}
          disabled={loading || !url}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Анализировать
        </button>
      </div>
      {loading && <p className="text-blue-600 dark:text-blue-400">Обработка...</p>}
    </div>
  );
}
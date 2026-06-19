import { ResumeItem } from '../api';

export default function ResumeCard({ resume }: { resume: ResumeItem }) {
  const scoreColor =
    resume.score >= 75 ? 'text-emerald-600' : resume.score >= 50 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{resume.full_name}</h3>
        <span className={`font-bold ${scoreColor}`}>{resume.score}/100</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {resume.email || 'email не указан'} {resume.phone && `| ${resume.phone}`}
      </p>
      <div className="mt-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Навыки:</span>{' '}
        <span className="text-gray-800 dark:text-gray-200">{resume.skills || 'не указаны'}</span>
      </div>
      {resume.experience && (
        <div className="mt-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Опыт:</span>{' '}
          <span className="text-gray-800 dark:text-gray-200">{resume.experience}</span>
        </div>
      )}
      {resume.education && (
        <div className="mt-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Образование:</span>{' '}
          <span className="text-gray-800 dark:text-gray-200">{resume.education}</span>
        </div>
      )}
      {resume.analysis && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{resume.analysis}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Источник: {resume.source}</p>
    </div>
  );
}
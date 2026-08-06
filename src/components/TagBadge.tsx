import Link from 'next/link';

export default function TagBadge({ name, active = false }: { name: string; active?: boolean }) {
  return (
    <Link
      href={`/tag/${name}`}
      className={`inline-block px-3 py-1 text-xs rounded-full transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
      }`}
    >
      {name}
    </Link>
  );
}

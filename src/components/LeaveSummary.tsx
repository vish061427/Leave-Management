import React from "react";

interface LeaveSummaryProps {
  allocation: Record<string, number>;
  used: Record<string, number>;
}

export default function LeaveSummary({ allocation, used }: LeaveSummaryProps) {
  const remaining: Record<string, number> = Object.keys(allocation).reduce((acc, type) => {
    acc[type] = allocation[type] - (used[type] || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="bg-white p-4 rounded shadow mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(allocation) as Array<keyof typeof allocation>).map((type) => (
        <div key={type} className="text-center">
          <h3 className="font-medium">{type.split(" Leave")[0]}</h3>
          <p className="text-sm text-gray-600">
            Used: <strong>{used[type] || 0}</strong> / {allocation[type]}
          </p>
          <p className="text-sm text-green-600">
            Remaining: <strong>{remaining[type] >= 0 ? remaining[type] : 0}</strong>
          </p>
        </div>
      ))}
    </section>
  );
}

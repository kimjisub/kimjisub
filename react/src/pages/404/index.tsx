import React, { useState } from 'react';

export default function NotFoundPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="h-screen">
      <p>페이지를 찾을 수 없습니다.</p>
    </div>
  );
}

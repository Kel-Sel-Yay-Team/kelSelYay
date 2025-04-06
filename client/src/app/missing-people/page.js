'use client';

import { Suspense } from 'react';
import MissingPeoplePage from '@/app/component/MissingPeoplePage';

export default function MissingPeopleWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading missing people...</div>}>
      <MissingPeoplePage />
    </Suspense>
  );
}
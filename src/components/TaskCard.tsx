'use client';

import React from 'react';

export const TaskCard = ({ task }: { task: any }) => {
  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  );
};

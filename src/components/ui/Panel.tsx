import React from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

export default function Panel({ title, children }: PanelProps) {
  return (
    <div className={styles.panel}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

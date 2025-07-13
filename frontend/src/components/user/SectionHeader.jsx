// components/SectionHeader/SectionHeader.jsx
import React from 'react';
import './SectionHeader.scss';

const SectionHeader = ({ title, subtitle, showAll = false, onShowAll }) => {
  return (
    <div className="section-header">
      <div className="section-title-container">
        <h2>{title}</h2>
      </div>

      <span className="section-subtitle">
        <span className="section-subtitle-text">
          {subtitle ? subtitle : ' '}
        </span>
        {showAll && (
          <button className="show-all" onClick={onShowAll}>
            Show all
          </button>
        )}
      </span>
    </div>
  );
};

export default SectionHeader;
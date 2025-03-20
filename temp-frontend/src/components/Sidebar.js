import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ notes, onSelectNote, onNewNote, onSearch }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">Second Brain</div>
        <button className="primary-btn" onClick={onNewNote}>+ New</button>
      </div>
      
      <div className="sidebar-search">
        <input 
          type="text" 
          placeholder="Search notes..." 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <div className="notes-list">
        {notes.map(note => (
          <div 
            key={note.id} 
            className="note-item" 
            onClick={() => onSelectNote(note)}
          >
            <h3>{note.title || 'Untitled'}</h3>
            <p>
              {note.content.length > 50 
                ? note.content.substring(0, 50).replace(/<[^>]*>?/gm, '') + '...' 
                : note.content.replace(/<[^>]*>?/gm, '')}
            </p>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <Link to="/">
          <button className="secondary-btn">Logout</button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
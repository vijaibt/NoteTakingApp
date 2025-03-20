import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import SimpleNoteEditor from './SimpleNoteEditor';
import MindMap from './MindMap';

// Define the API URL
const API_URL = 'http://localhost:8000/api/notes/';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes based on search query
  useEffect(() => {
    fetchNotes(searchQuery);
  }, [searchQuery]);

  const fetchNotes = async (search = '') => {
    try {
      const url = search ? `${API_URL}?search=${search}` : API_URL;
      const response = await axios.get(url);
      setNotes(response.data);
      
      // Select first note if none is selected
      if (response.data.length > 0 && !selectedNote) {
        setSelectedNote(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      // For demo purposes, add some dummy notes if API fails
      if (notes.length === 0) {
        const dummyNotes = [
          { 
            id: 1, 
            title: 'Welcome to Second Brain!', 
            content: 'This is a demo of the Second Brain note-taking app. Try creating a new note or editing this one!',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setNotes(dummyNotes);
        setSelectedNote(dummyNotes[0]);
      }
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleNewNote = async () => {
    const newNote = {
      title: 'Untitled Note',
      content: ''
    };

    try {
      const response = await axios.post(API_URL, newNote);
      setNotes([response.data, ...notes]);
      setSelectedNote(response.data);
    } catch (error) {
      console.error('Error creating note:', error);
      // For demo, create a client-side note if API fails
      const clientNote = {
        id: Date.now(), // Use timestamp as temporary ID
        ...newNote,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setNotes([clientNote, ...notes]);
      setSelectedNote(clientNote);
    }
  };

  const handleSaveNote = async (updatedNote) => {
    // Find the note index to update
    const noteIndex = notes.findIndex(note => note.id === updatedNote.id);
    
    if (noteIndex !== -1) {
      try {
        // Send update to API
        const response = await axios.put(`${API_URL}${updatedNote.id}/`, updatedNote);
        
        // Update local state
        const updatedNotes = [...notes];
        updatedNotes[noteIndex] = response.data;
        setNotes(updatedNotes);
        setSelectedNote(response.data);
      } catch (error) {
        console.error('Error updating note:', error);
        // For demo, update client-side if API fails
        const clientUpdatedNote = {
          ...updatedNote,
          updated_at: new Date().toISOString()
        };
        const updatedNotes = [...notes];
        updatedNotes[noteIndex] = clientUpdatedNote;
        setNotes(updatedNotes);
        setSelectedNote(clientUpdatedNote);
      }
    }
  };

  return (
    <div className="dashboard">
      <Sidebar 
        notes={notes} 
        onSelectNote={handleSelectNote} 
        onNewNote={handleNewNote}
        onSearch={setSearchQuery}
      />
      <div className="content-container">
        <SimpleNoteEditor 
          note={selectedNote} 
          onSave={handleSaveNote} 
        />
        {selectedNote && (
          <MindMap currentNoteId={selectedNote.id} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
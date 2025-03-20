import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MindMap = ({ currentNoteId }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (currentNoteId) {
      loadConnections(currentNoteId);
    }
  }, [currentNoteId]);

  const loadConnections = async (noteId) => {
    // For demo purposes, we'll use dummy data
    // In a real app, you would fetch this from the backend API
    setLoading(true);
    
    try {
      // Simulating API call
      // In a real app, replace this with:
      // const response = await axios.get(`http://localhost:8000/api/notes/${noteId}/connections/`);
      // setConnections(response.data.connections);
      
      // Demo data
      setTimeout(() => {
        const dummyConnections = [
          { id: 1, title: "Related idea about focus", similarity: 0.85 },
          { id: 2, title: "Project planning notes", similarity: 0.72 },
          { id: 3, title: "Similar concept from last week", similarity: 0.68 },
          { id: 4, title: "Connection to previous research", similarity: 0.54 },
          { id: 5, title: "Tangential thought", similarity: 0.42 }
        ];
        setConnections(dummyConnections);
        setLoading(false);
      }, 700); // Simulate loading delay
    } catch (error) {
      console.error("Error fetching connections:", error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="mind-map-container">
        <h3>Discovering Connections...</h3>
        <div className="loading-indicator">AI analyzing your notes</div>
      </div>
    );
  }
  
  return (
    <div className="mind-map-container">
      <h3>Connected Thoughts</h3>
      <p className="mind-map-description">
        AI has discovered these related ideas in your notes:
      </p>
      <div className="connections-list">
        {connections.map(connection => (
          <div 
            key={connection.id}
            className="connection-item"
            style={{
              opacity: Math.max(0.5, connection.similarity),
              fontSize: `${14 + (connection.similarity * 6)}px`
            }}
          >
            {connection.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindMap;
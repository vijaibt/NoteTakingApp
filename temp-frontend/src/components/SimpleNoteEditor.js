import React, { useState, useEffect } from 'react';

const SimpleNoteEditor = ({ note, onSave }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasSpellingErrors, setHasSpellingErrors] = useState(false);

  useEffect(() => {
    if (note) {
      setContent(note.content || '');
    } else {
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    if (!note) return;
    
    // Auto-generate title from first line or use "Untitled"
    const firstLine = content.split('\n')[0];
    const title = firstLine ? firstLine.substring(0, 50) : 'Untitled Note';
    
    const updatedNote = {
      ...note,
      title,
      content
    };
    
    onSave(updatedNote);
    setStatus('Note saved!');
    
    setTimeout(() => {
      setStatus('');
    }, 3000);
  };

  const toggleListening = () => {
    if (!isListening) {
      // Start speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');
          
          setContent(prevContent => prevContent + ' ' + transcript);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognition.start();
        setIsListening(true);
      } else {
        setStatus('Speech recognition not supported in this browser');
        setTimeout(() => {
          setStatus('');
        }, 3000);
      }
    } else {
      // Stop speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.stop();
        setIsListening(false);
      }
    }
  };

  // Simple auto-correction function
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    
    // Very basic spell check - just for demo purposes
    // In a real app, you would use a proper spell checker library
    const commonMisspellings = {
      'teh': 'the',
      'recieve': 'receive',
      'wierd': 'weird',
      'beleive': 'believe',
      'seperate': 'separate',
      'occured': 'occurred',
      'tommorrow': 'tomorrow',
      'alot': 'a lot',
      'definately': 'definitely',
      'untill': 'until',
      'accross': 'across',
      'occassion': 'occasion',
      'accomodate': 'accommodate',
      'embarass': 'embarrass',
      'neccessary': 'necessary',
      'truely': 'truly'
    };
    
    // Auto-correct on space or punctuation
    if (newText.endsWith(' ') || newText.endsWith('.') || newText.endsWith(',')) {
      const words = newText.split(/\s+/);
      let lastWord = words[words.length - 2]; // Get the word before the space
      
      if (lastWord) {
        // Strip punctuation for checking
        lastWord = lastWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        if (commonMisspellings[lastWord.toLowerCase()]) {
          // Replace the misspelled word with the correction
          words[words.length - 2] = commonMisspellings[lastWord.toLowerCase()];
          const correctedText = words.join(' ');
          setContent(correctedText);
          
          // Show correction status
          setStatus(`Corrected: "${lastWord}" to "${commonMisspellings[lastWord.toLowerCase()]}"`);
          setTimeout(() => {
            setStatus('');
          }, 2000);
        }
      }
    }
  };

  if (!note) {
    return <div className="main-content">Select a note or create a new one</div>;
  }

  return (
    <div className="main-content">
      <div className="editor-controls">
        <button className="primary-btn" onClick={handleSave}>Save</button>
        <button 
          className={`voice-btn ${isListening ? 'active-voice' : ''}`} 
          onClick={toggleListening}
        >
          {isListening ? '🔴 Stop Dictation' : '🎤 Start Dictation'}
        </button>
      </div>
      
      <div className="editor-container">
        <textarea
          value={content}
          onChange={handleTextChange}
          placeholder="Start writing... (Type here or use voice dictation)"
          style={{ 
            width: '100%', 
            height: 'calc(100vh - 160px)', 
            padding: '20px',
            border: 'none',
            resize: 'none',
            outline: 'none',
            fontSize: '16px',
            lineHeight: '1.5',
            backgroundColor: '#fff'
          }}
        />
      </div>
      
      {status && <div className="status-message">{status}</div>}
    </div>
  );
};

export default SimpleNoteEditor;
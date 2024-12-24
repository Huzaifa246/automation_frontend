import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (fileData: React.SetStateAction<null>) => {
    setSelectedFile(fileData); // Set the selected file data
  };
 
  return (
    <div className="App">
    <Header className="Header"  />
    <div className="MainContainer">
    <Sidebar className="sidebar" onFileSelect={handleFileSelect}  />
      {
        selectedFile && (
          <ChatArea fileData={selectedFile} className="ChatArea" />
        )
      }

    </div>
  </div>
  );
}

export default App;

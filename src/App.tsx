import './App.css';
import PhotosContextProvider from './context/PhotosContext';
import HeaderComponent from './components/HeaderComponent';
import GalleryGrid from './GalleryModule/GalleryGrid';

const App: React.FC = () => {
  return (
    <div className="App">
      <PhotosContextProvider>
        <HeaderComponent fixed="top" />
        <GalleryGrid />
      </PhotosContextProvider>
    </div>
  );
};

export default App;
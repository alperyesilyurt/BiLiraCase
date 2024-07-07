import AssetTable from './components/AssetTable';
import ErrorBoundary from './components/ErrorBoundary';
import biliraLogo from './assets/bilira.png'; 
import './App.css'; 

function App() {
  return (
    <div className="App">
      <header className="bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 text-white fixed top-0 w-full z-10">
        <div className="flex justify-center items-center py-4">
          <img src={biliraLogo} alt="Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">BiLira</h1>
        </div>
      </header>
      <main className="pt-16 ">  
        <ErrorBoundary>
          <AssetTable />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;

import biliraLogo from '../assets/bilira.png';


const Loading = () => (
  <div className="flex justify-center items-center h-screen" data-testid="loading">
    <img alt="Loading" className="animate-spin h-12 w-12" src={biliraLogo}  />
  </div>
);


export default Loading;

import biliraLogo from '../assets/bilira.png';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src={biliraLogo} alt="Loading" className="animate-spin h-12 w-12" />
    </div>
  );
};

export default Loading;

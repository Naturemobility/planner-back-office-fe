import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <div className='p-[20px]'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

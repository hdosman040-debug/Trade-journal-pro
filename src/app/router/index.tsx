import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-slate-500">{title}</div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Placeholder title="Dashboard" /> },
      { path: 'journal', element: <Placeholder title="Journal" /> },
      { path: 'analytics', element: <Placeholder title="Analytics" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
]);

import { useState, useEffect } from 'react';

export default function Topbar({ title }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm px-4">
      <h1 className="h4 mb-0 text-gray-800 font-weight-bold">{title}</h1>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item d-flex align-items-center">
          <span className="text-gray-600 font-weight-bold">{currentTime}</span>
        </li>
      </ul>
    </nav>
  );
}
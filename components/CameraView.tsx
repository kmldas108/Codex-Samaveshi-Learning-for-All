import React, { useRef, useEffect, useState } from 'react';
import { ICONS } from '../constants';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera. Please check permissions.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Get base64 string without the data URL prefix for the server API
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1]; 
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {error ? (
        <div className="text-white p-4 text-center">
          <p>{error}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 rounded-lg">Close</button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay UI */}
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
            <button 
              onClick={onClose}
              className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Smart Capture Active</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 flex justify-center items-center bg-gradient-to-t from-black/70 to-transparent pb-12">
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform shadow-lg"
              aria-label="Capture Image"
            >
              <div className="w-16 h-16 rounded-full bg-white"></div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraView;

import {Webcam, Mic} from 'lucide-react';
import React from 'react';

const PermissionPrompts = () => {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-3">
        <Webcam size={40} />
        <Mic size={40} />

        <p className="text-center">
          Pleasae allow access to your microphone and camera to join the call
        </p>
      </div>
    </div>
  );
};

export default PermissionPrompts;

import React from 'react';
import EmailForm from './_components/emailForm';

export default function EmailPage() {
  return (
    <div className="p-6">
      <div>
        <p className="text-lg  mb-3 capitalize font-semibold">
          Send Emails to Students of different categories
        </p>
        <EmailForm />
      </div>
    </div>
  );
}

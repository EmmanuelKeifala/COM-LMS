import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-sky-200 to-sky-700">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md', // Adjust width of the sign-up box
            card: 'bg-white rounded-lg shadow-lg p-8', // Custom card styling
            headerTitle: 'text-2xl font-bold text-gray-800', // Custom title styling
            headerSubtitle: 'text-sm text-gray-600', // Custom subtitle styling
            socialButtons: 'gap-4', // Adjust spacing between social buttons
            socialButton: 'border border-gray-300 hover:bg-gray-50', // Custom social button styling
            formFieldInput:
              'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500', // Custom input styling
            formButtonPrimary:
              'w-full bg-sky-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ', // Custom primary button styling
            footerActionText: 'text-sm text-gray-600', // Custom footer text styling
            footerActionLink: 'text-sky-600 hover:text-sky-700', // Custom footer link styling
          },
        }}
      />
    </div>
  );
}
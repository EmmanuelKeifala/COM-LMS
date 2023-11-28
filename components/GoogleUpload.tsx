'use client';

import {GoogleLogin} from 'react-google-login';
import Dropzone from 'react-dropzone';

import {useEffect, useState} from 'react';
import axios from 'axios';
import {auth, useAuth} from '@clerk/nextjs';

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID! || '';
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
// const token = 'sk_test_GlSEH5jS3nCYXcshKF2elGMOK989OkHyBblff4RaiT';
export const GoogleUpload = () => {
  const [accessToken, setAccessToken] = useState(
    'ya29.a0AfB_byBCXHj1sr5bpbT5mkAgvJeR1dQ8mYanIz8BpDd68m1HtVt3G5RjWBygz-sVya3bIV-nrfLJKPBvL_SRaP4qPaNzwpNE_PSuCvuYODwm0VYiNJGdvO4A_tKBuiauskuTZYye05il3XCYJJBwuhuGJ8T1SkCBP_fPaCgYKAUsSARASFQHGX2Mi2UvJ2j4mruUt2hwP8uq0nQ0171',
  );
  const {userId} = useAuth();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_google`,
  //         {
  //           headers: {
  //             Authorization: `Bearer Token sk_test_GlSEH5jS3nCYXcshKF2elGMOK989OkHyBblff4RaiT`,
  //           },
  //         },
  //       );
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData(); // Call the async function
  // }, []);

  const handleUpload = async (files: File[]) => {
    if (!accessToken) {
      console.error('Access token is not available.');
      return;
    }

    const file = files[0]; // Assuming only one file is selected

    if (!file) {
      console.error('No file selected.');
      return;
    }

    // Use the Google Drive API to upload the file
    const url =
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=media';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': file.type,
    };

    try {
      const response = await axios.post(url, file, {headers});
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const responseGoogle = (response: any) => {
    // Handle Google login and obtain access token
    const newAccessToken = response?.tokenId;
    setAccessToken(newAccessToken);
    // Save the access token for later use
  };

  return (
    <>
      <Dropzone onDrop={handleUpload}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag and drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>

      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        disabled={!!accessToken}
      />
    </>
  );
};

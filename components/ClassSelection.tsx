"use client"
import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';

const ClassSelection = () => {
  const router = useRouter();
  const [userClassName, setuserClassName] = useState<string>('');
  const handleChange = async (value: string) => {
    try {
      await axios.post(`/api/userclass`, {
        userClass: value,
      });
      toast.success('Your class has been recorded');
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const getUserClassName = async () => {
      const reponse = await axios.get(`/api/userclass`);
      setuserClassName(reponse.data.userClass);
    };
    getUserClassName();
  }, []);


  return (
    <Select
      className="dark:bg-white dark:text-white dark:rounded-md"
      onChange={handleChange}
      showSearch
      placeholder={userClassName ? userClassName : 'Select your class'}
      optionFilterProp="children"
      bordered={false}
      filterOption={(input, option) => (option?.label ?? '').includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label?.toLowerCase() ?? '').localeCompare(
          optionB?.label?.toLowerCase() ?? '',
        )
      }
      options={[
        {
          label: 'Pre-Classes',
          options: [
            {
              label: 'Pre-Pharmacy & Pre-Med',
              value: 'Pre-Pharmacy & Pre-Med',
            },
          ],
        },
        {
          label: 'Pharmacy Professional Year',
          options: [
            {label: 'B.Pharm year 1', value: 'B.Pharm year 1'},
            {label: 'B.Pharm year 2', value: 'B.Pharm year 2'},
            {label: 'B.Pharm year 3', value: 'B.Pharm year 3'},
            {label: 'B.Pharm year 4', value: 'B.Pharm year 4'},
            {label: 'B.Pharm year 5', value: 'B.Pharm year 5'},
          ],
        },
      ]}
    />
  );
};

export default ClassSelection;

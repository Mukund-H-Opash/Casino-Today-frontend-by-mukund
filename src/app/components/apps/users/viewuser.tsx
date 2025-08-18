'use client';
import React, { useEffect, useState } from 'react';
import SingleUser from './SingleUser';
import { useDispatch, useSelector } from '@/store/hooks';
import { getUserById } from '@/store/apps/users/userSlice';
import { AppDispatch, RootState } from '@/store/store';
import { AccesslogData } from '@/app/api/accesslog/AccesslogData';

interface ViewUserProps {
  userId: string;
}

interface Log {
  id: number;
  username: string;
  action: string;
  date: string;
}

const ViewUser = ({ userId }: ViewUserProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { user: userData, isLoading: loading } = useSelector((state: RootState) => state.user);
  const [logsData, setLogsData] = useState<Log[]>([]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userData) {
      const logs = AccesslogData.filter((log) => log.username === userData.name);
      setLogsData(logs);
    }
  }, [userData]);

  if (loading) {
    return <div>Loading user...</div>;
  }

  if (!userData) {
    return <div>User not found for ID: {userId}</div>;
  }

  return <SingleUser user={userData} />;
};

export default ViewUser;

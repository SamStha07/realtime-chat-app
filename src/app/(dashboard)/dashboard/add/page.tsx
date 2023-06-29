import AddFriendButton from '@/components/AddFriendButton';
import { FC } from 'react';

const page: FC = ({}) => {
  return (
    <div className='pt-8'>
      <h1 className='mb-8 text-5xl font-bold'>Add a friend</h1>
      <AddFriendButton />
    </div>
  );
};

export default page;

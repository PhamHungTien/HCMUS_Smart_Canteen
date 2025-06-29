import React from 'react';

interface Props {
  username: string;
}

const UserDashboard: React.FC<Props> = ({ username }) => {
  return (
    <div>
      <h2>Xin chào {username}</h2>
    </div>
  );
};

export default UserDashboard;

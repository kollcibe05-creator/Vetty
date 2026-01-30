import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPendingApprovals } from '../../features/adminSlice';

// Admin page to view and manage pending product/service approvals
const ApprovalStats = () => {
  const dispatch = useDispatch();
  const { pendingApprovals } = useSelector((state) => state.admin);

  // Load demo pending approvals (replace with API call later)
  useEffect(() => {
    const demoApprovals = [
      { id: 1, type: 'product', name: 'Cat Food' },
      { id: 2, type: 'service', name: 'Dog Vaccination' },
    ];
    dispatch(setPendingApprovals(demoApprovals));
  }, [dispatch]);

  return (
    <div>
      <h1>Approval Stats</h1>
      <ul>
        {pendingApprovals.map((item) => (
          <li key={item.id}>
            {item.type.toUpperCase()}: {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovalStats;

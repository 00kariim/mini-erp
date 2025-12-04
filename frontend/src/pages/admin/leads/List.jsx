import React, { useEffect, useState } from 'react';
import { Button, Space, message } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import LeadsTable from '../../../components/Tables/LeadsTable';
import AssignLeadToOperatorModal from '../../../components/Modals/AssignLeadToOperatorModal';
import { getLeads, deleteLead, assignLeadToOperator } from '../../../api/leads';
import ConfirmDeleteModal from '../../../components/Modals/ConfirmDeleteModal';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLead(selectedLeadId);
      setDeleteModalVisible(false);
      setSelectedLeadId(null);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const openDeleteModal = (leadId) => {
    setSelectedLeadId(leadId);
    setDeleteModalVisible(true);
  };

  const openAssignModal = (lead) => {
    setSelectedLead(lead);
    setAssignModalVisible(true);
  };

  const handleAssignOperator = async (operatorId) => {
    try {
      setAssigning(true);
      await assignLeadToOperator(selectedLead.id, { operator_id: operatorId });
      message.success('Lead assigned to operator successfully!');
      setAssignModalVisible(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to assign lead to operator';
      message.error(errorMsg);
      console.error('Error assigning lead:', err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Leads</h1>
        <Link to="/admin/leads/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Create Lead
          </Button>
        </Link>
      </div>
      <LeadsTable
        leads={leads}
        onAssign={openAssignModal}
        onDelete={openDeleteModal}
        basePath="/admin"
        loading={loading}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedLeadId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Lead"
        content="Are you sure you want to delete this lead? This action cannot be undone."
      />

      <AssignLeadToOperatorModal
        visible={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          setSelectedLead(null);
        }}
        onOk={handleAssignOperator}
        leadId={selectedLead?.id}
        currentOperatorId={selectedLead?.assigned_operator_id}
        loading={assigning}
      />
    </div>
  );
};

export default AdminLeads;


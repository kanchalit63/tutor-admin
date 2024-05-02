import { useState, useEffect } from "react";
import axios from 'axios';
import { apiConfig } from "../../config/api.config"
import { Table, Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import dayjs from "dayjs";
import Toastifycon from "../../../global-components/Toastcon";

function EditTutor() {
  const [isModalApproveOpen, setIsModalApproveOpen] = useState(false);
  const [isModalRejectOpen, setIsModalRejectOpen] = useState(false);
  const [tutorlist, setTutorList] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลที่ถูกเลือกสำหรับแสดงใน modal
  const [modalVisible, setModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง modal



  const handleRowClick = (record) => {
    setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
    setModalVisible(true); // แสดง modal
  };

  const handleModalClose = () => {
    setModalVisible(false); // ปิด modal
  };

  const showModalApprove = (tutorId) => {
    const selectedTutorDetails = tutorlist.find((tutor) => tutor.id === tutorId);
    setSelectedTutor(selectedTutorDetails);
    setIsModalApproveOpen(true);
  }

  const handleOkApprove = () => {
    approveTutor(selectedTutor.id);

  }
  const handleCancelApprove = () => {
    setIsModalApproveOpen(false);
  }

  const showModalReject = (tutorId) => {
    const selectedTutorDetails = tutorlist.find((tutor) => tutor.id === tutorId);
    setSelectedTutor(selectedTutorDetails);
    setIsModalRejectOpen(true);
  }

  const handleOkReject = () => {
    rejectTutor(selectedTutor.id);
  }
  const handleCancelReject = () => {
    setIsModalRejectOpen(false);
  }

  useEffect(() => {
    getTutor();
  }, []);

  const getTutor = () => {
    axios.get(`${apiConfig.baseURL}/tutorlist`)
      .then((res) => {
        setTutorList(res.data.data);
      })
      .catch((err) => {
        console.log('Error fetching tutor list', err);
      });
  }

  const approveTutor = (id) => {
    axios.patch(`${apiConfig.baseURL}/updatetutorstatus`, {
      id: id,
      status: 2
    })
      .then(() => {
        toast("ยืนยันติวเตอร์สำเร็จ");
        getTutor();
        setIsModalApproveOpen(false);
      })
      .catch((err) => {
        console.error('Error updating tutor status', err);
      });
  }

  const rejectTutor = (id) => {
    axios.patch(`${apiConfig.baseURL}/updatetutorstatus`, {
      id: id,
      status: 3
    })
      .then(() => {
        toast("ปฏิเสธติวเตอร์สำเร็จ");
        getTutor();
        setIsModalRejectOpen(false);
      })
      .catch((err) => {
        console.error('Error updating tutor status', err);
      });
  }

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'ชื่อผู้ใช้งาน',
      dataIndex: 'username',
      key: 'username',
      width: 300,
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstname',
      key: 'firstname',
      width: 200,
    },
    {
      title: 'นาสกุล',
      dataIndex: 'lastname',
      key: 'lastname',
      width: 200,
    },
    {
      title: 'หลักฐาน',
      dataIndex: 'document',
      key: 'document',
      width: 200,
      render: (_, record) => (
        <Button type="link" onClick={() => handleRowClick(record)}>
          ดูรายละเอียด
        </Button>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => ({
        1: 'รอการยืนยัน',
        2: 'ยืนยันแล้ว',
        3: 'ปฏิเสธ',
      }[status] || 'No Status in Here'),
    },
    {
      title: 'สร้างเมื่อ',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 250,
      render: (createdAt) => (
        createdAt ? dayjs(createdAt).add(543, 'year').format('DD-MM-YYYY HH:mm:ss') : ''
      ),
    },
    {
      title: 'จัดการ',
      key: 'edit',
      width: 200,
      render: (record) => (
        <div className="space-x-4 w-52">
          <button
            type="button"
            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
            onClick={() => showModalApprove(record.id)}
          >
            ยืนยัน
          </button>
          <button
            type="button"
            className="bg-red-500 w-24 h-8 text-white rounded-md"
            onClick={() => showModalReject(record.id)}
          >
            ปฏิเสธ
          </button>
        </div>
      ),
    }
  ];

  return (
    <>
      <Toastifycon />
      <div>
        <h1 className='text-lg'>จัดการข้อมูลติวเตอร์</h1>
        <Table dataSource={tutorlist} columns={columns} />
      </div>

      <Modal
        title={<div className="text-2xl font-bold">ยืนยันติวเตอร์</div>}
        open={isModalApproveOpen}
        onCancel={handleCancelApprove}
        footer={null}
      >
        <p>ต้องการที่จะยืนยันข้อมูลติวเตอร์ <span className="text-red-500">{selectedTutor?.firstname} {selectedTutor?.lastname}</span> ใช่ไหม?</p>
        <div className="space-x-4  flex items-end justify-end mt-3">
          <button
            type="button"
            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
            onClick={handleOkApprove}
          >
            ตกลง
          </button>
          <button
            type="button"
            className="bg-red-500 w-24 h-8 text-white rounded-md"
            onClick={handleCancelApprove}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>

      <Modal
        title={<div className="text-2xl font-bold">ปฏิเสธติวเตอร์</div>}
        open={isModalRejectOpen}
        onCancel={handleCancelReject}
        footer={null}
      >
        <p>ต้องการที่จะปฏิเสธข้อมูลติวเตอร์ <span className="text-red-500">{selectedTutor?.firstname} {selectedTutor?.lastname}</span> ใช่ไหม?</p>
        <div className="space-x-4  flex items-end justify-end mt-3">
          <button
            type="button"
            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
            onClick={handleOkReject}
          >
            ตกลง
          </button>
          <button
            type="button"
            className="bg-red-500 w-24 h-8 text-white rounded-md"
            onClick={handleCancelReject}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>

      <Modal title="เอกสาร" open={modalVisible} onCancel={handleModalClose} footer={null}>
        {selectedRow && (
          <div>
            <p>ชื่อ: {selectedRow.firstname} {selectedRow.lastname} </p>
            {/* เพิ่มเงื่อนไขเช็คว่ามี documentUrl หรือไม่ ถ้ามีก็แสดงรูปภาพ */}
            {selectedRow.documentUrl && <img src={selectedRow.documentUrl} className="" alt="Document" />}
          </div>
        )}
      </Modal>
    </>
  );
}

export default EditTutor;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiConfig } from "../../config/api.config"
import { Table, Modal } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import Toastifycon from '../../../global-components/Toastcon';

const EditContact = () => {
    const [contactlist, setContactList] = useState([]);
    const [isModalContactOpen, setIsModalContactOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);

    const showModalContact = () => {
        setIsModalContactOpen(true);
    };

    const handleOkContact = () => {
        updateContact(selectedContactId);
    };

    const handleCancelContact = () => {
        setIsModalContactOpen(false);
    };

    useEffect(() => {
        getContact();
    }, []);

    const getContact = () => {
        axios.get(`${apiConfig.baseURL}/contact`)
            .then((res) => {
                setContactList(res.data.data);
            })
            .catch((err) => {
                console.log('เกิดข้อผิดพลาดในการแสดงผลรายวิชา', err);
            });
    };

    const updateContact = (id) => {
        axios.patch(`${apiConfig.baseURL}/updatecontact`, {
            id: id,
        })
            .then(() => {
                toast("รับเรื่องสำเร็จ")
                getContact();
                setIsModalContactOpen(false); // Close the modal after updating
            })
            .catch((err) => {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลติดต่อ', err);
            });
    };

    const columns = [
        {
            title: 'รหัสการติดต่อ',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            align: "center"
        },
        {
            title: 'ชื่อ-นาสกุล',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'เบอร์โทร',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: 'ข้อความที่ต้องการติดต่อ',
            dataIndex: 'detail',
            key: 'detail',
        },
        {
            title: 'วันที่รับเรื่อง',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (createdAt) => (
                createdAt ? dayjs(createdAt).add(543, 'year').format('DD-MM-YYYY HH:mm:ss') : '' // Check if the date is available
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status ? status : 'ยังไม่ได้รับเรื่อง'),
        },
        {
            title: 'แก้ไข',
            key: 'edit',
            width: 150,
            render: (record) => (
                <div className="space-x-4">
                    <button
                        type="button"
                        className="bg-green-700 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        onClick={() => {
                            setSelectedContactId(record.id);
                            showModalContact();
                        }}
                    >
                        รับเรื่องแล้ว
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Toastifycon />
            <div>
                <h1 className='text-lg'>ข้อมูลติดต่อฉัน</h1>
                <Table dataSource={contactlist} columns={columns} />
            </div>

            <Modal
                title={<div className="text-2xl font-bold">ยืนยันการรับเรื่อง</div>}
                open={isModalContactOpen}
                onCancel={handleCancelContact}
                footer={null}
            >
                <p className='text-md'>ต้องการยืนยันข้อมูลติดต่อเราหมายเลข <span className='text-red-500'>{selectedContactId}</span> ใช่ไหม?</p>
                <div className="space-x-4  flex items-end justify-end mt-3">
                    <button
                        type="button"
                        className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        onClick={handleOkContact}
                    >
                        ตกลง
                    </button>
                    <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelContact}>
                        ยกเลิก
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default EditContact;

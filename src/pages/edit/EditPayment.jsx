import { Modal } from 'antd';
import { Button, Table } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiConfig } from '../../config/api.config';


const EditPayment = () => {

    const [selectedRow, setSelectedRow] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลที่ถูกเลือกสำหรับแสดงใน modal
    const [modalVisible, setModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง modal
    const [confirmModalVisible, setConfirmModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง modal ยืนยัน
    const [rejectModalVisible, setRejectModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง modal ปฏิเสธ
    const [datapayment, setDatapayment] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลการชำระเงินทั้งหมด


    const handleRowClick = (record) => {
        setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
        setModalVisible(true); // แสดง modal
    };

    const handleModalClose = () => {
        setModalVisible(false); // ปิด modal
    };

    useEffect(() => {
        getAllPayment();
    }, []);

    const getAllPayment = () => {
        axios.get(`${apiConfig.baseURL}/allpaymentbooking`)
            .then((res) => {
                setDatapayment(res.data.data);
            })
            .catch((err) => {
                console.log("Error fetching tutor data", err);
            });
    };

    const updatePayment = (id) => {
        axios.patch(`${apiConfig.baseURL}/updatepaymentbooking`, {
            id: id
        }).then((res) => {
            console.log(res.data);
            setConfirmModalVisible(false); // ปิด Modal ยืนยัน
            getAllPayment()
        }
        ).catch((err) => {
            console.log("Can't Update Data", err);
        });
    }

    const updatePaymentReject = (id) => {
        axios.patch(`${apiConfig.baseURL}/updatepaymentbookingreject`, {
            id: id
        }).then((res) => {
            console.log(res.data);
            setRejectModalVisible(false); // ปิด Modal ยืนยัน
            getAllPayment()
        }
        ).catch((err) => {
            console.log("Can't Update Data", err);
        });
    }

    const handleConfirm = () => {
        updatePayment(selectedRow.id); // เรียกใช้ฟังก์ชันอัปเดตการชำระเงิน
    };

    const handleApproveButtonClick = (record) => {
        setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
        setConfirmModalVisible(true); // เปิด Modal ยืนยัน
    };

    const handleRejectButtonClick = (record) => {
        setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
        setRejectModalVisible(true); // เปิด Modal ยืนยัน
    }

    const handleReject = () => {
        updatePaymentReject(selectedRow.id); // เรียกใช้ฟังก์ชันอัปเดตการชำระเงิน
    }
    

    const columns = [
        {
            title: 'ชื่อ',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'นาสกุล',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'เบอร์โทร',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: 'ชื่อติวเตอร์',
            dataIndex: 'tutorname',
            key: 'tutorname',
        },
        {
            title: 'ราคา',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'หมายเลขธนาคาร',
            dataIndex: 'user_bankaccount',
            key: 'user_bankaccount',
        },
        {
            title: 'ธนาคาร',
            dataIndex: 'bank',
            key: 'bank',
        },
        {
            title: 'รูปภาพการชำระเงิน',
            dataIndex: 'payment',
            key: 'payment',
            render: (_, record) => (
                <Button type="link" onClick={() => handleRowClick(record)}>
                    ดูรายละเอียด
                </Button>
            ),
        },
        {
            title: 'สถานะการชำระเงิน',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'จัดการ',
            dataIndex: 'edit',
            key: 'edit',
            render: (text, record) => (
                <div>
                    <Button type='link' onClick={() => handleApproveButtonClick(record)}>อนุมัติ</Button>
                    <Button type='link' danger onClick={() => handleRejectButtonClick(record)}>ปฏิเสธ</Button>
                </div>
            )
        },
        
    ];

    const dataSource = datapayment ? datapayment.map(item => ({
        key: item.id,
        tutor_id: item.tutor_id,
        tutor_subject_id: item.tutor_subject_id,
        id: item.id,
        firstname: item.user_firstname,
        lastname: item.user_lastname,
        tel: item.user_tel,
        subject: item.subject_name,
        techdate: `${item.date}`,
        user_bankaccount: item.user_bankaccount,
        bank: item.user_bank,
        time: `${item.time}`,
        price: `${item.subject_price} บาท`,
        image: item.imageUrl,
        tutorname: item.tutor_name,
        study_place: item.study_place,
        status: item.status === 1 ? "รอชำระเงิน" : item.status === 6 ? "รอตรวจสอบ" : item.status === 7 ? "ชำระเงินสำเร็จ" : "รอยืนยัน",
    })) : [];

    return (
        <div>
            <h1 className='text-lg'>ข้อมูลติดต่อฉัน</h1>
            <Table dataSource={dataSource} columns={columns} />
            <Modal
                title="รูปภาพการชำระเงิน"
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                {selectedRow && (  // ตรวจสอบว่า selectedRow ไม่เป็น null ก่อนที่จะเข้าถึง properties
                    <div>
                        <div className='mb-4'>
                            <p>ชื่อ-นามสกุล: {selectedRow?.firstname} {selectedRow?.lastname}</p>
                            <p>เบอร์โทร: {selectedRow?.tel}</p>
                            <p>ชื่อติวเตอร์: {selectedRow?.tutorname}</p>
                            <p>ราคา: {selectedRow?.price}</p>
                            <p>สถานะการชำระเงิน: {selectedRow?.status}</p>
                        </div>
                        <img src={selectedRow?.image} alt="" />
                    </div>
                )}
            </Modal>
            <Modal
                title="ยืนยันการอนุมัติ"
                open={confirmModalVisible}
                onOk={handleConfirm}
                onCancel={() => setConfirmModalVisible(false)}
                footer
            >
                {selectedRow && (
                    <p>คุณแน่ใจหรือไม่ที่จะอนุมัติการชำระเงินของ <span className='text-red-500'>{selectedRow.firstname} {selectedRow.lastname}</span> ใช่หรือไม่?</p>
                )}


                <div className='flex justify-end mt-2'>
                    <Button type='link' onClick={handleConfirm}>ยืนยัน</Button>
                </div>
            </Modal>

            <Modal
                title="ปฏิเสธการชำระเงิน"
                open={rejectModalVisible}
                onOk={handleReject}
                onCancel={() => setRejectModalVisible(false)}
                footer
            >
                {selectedRow && (
                    <p>คุณแน่ใจหรือไม่ที่จะไม่อนุมัติการชำระเงินของ <span className='text-red-500'>{selectedRow.firstname} {selectedRow.lastname}</span> ใช่หรือไม่?</p>
                )}


                <div className='flex justify-end mt-2'>
                    <Button type='link' onClick={handleReject}>ยืนยัน</Button>
                </div>
            </Modal>
        </div>
    )
}

export default EditPayment;

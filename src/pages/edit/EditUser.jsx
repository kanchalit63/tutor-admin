import { useState, useEffect } from "react"
import axios from "axios"
import { apiConfig } from "../../config/api.config"
import { Table, Modal, Input } from "antd"
import Icon from "@mdi/react"
import { mdiSquareEditOutline, mdiDeleteOutline } from "@mdi/js"
import dayjs from "dayjs";
import { useFormik } from "formik"
import * as Yup from "yup"
import Toastifycon from "../../../global-components/Toastcon";
import { toast } from "react-toastify"

function Edituser() {
    const [userList, setUserList] = useState([])
    const [userById, setUserById] = useState({})
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)

    const showModalEdit = () => {
        setIsModalEditOpen(true)
    }

    const handleCancelEdit = () => {
        setIsModalEditOpen(false)
    }

    const showModalDelete = (id) => {
        getUserById(id); 
        setIsModalDeleteOpen(true);
    };

    const handleCancelDelete = () => {
        setIsModalDeleteOpen(false)
    }

    useEffect(() => {
        getUser()
    }, [])

    const getUser = () => {
        axios
            .get(`${apiConfig.baseURL}/getUserList`)
            .then((res) => {
                setUserList(res.data.data)
            })
            .catch((err) => {
                console.log("Error fetching user list", err)
            })
    }

    const getUserById = (id) => {
        axios
            .get(`${apiConfig.baseURL}/getUserList/${id}`)
            .then((res) => {
                setUserById({ ...res.data.data, id: id });
            })
            .catch((err) => {
                console.log("Error fetching user by ID", err);
            });
    };



    const initialValues = {
        id: userById.id || "",
        firstname: userById.firstname || "",
        lastname: userById.lastname || "",
        tel: userById.tel || "",
        email: userById.email || "",
    }

    const schema = Yup.object({
        firstname: Yup.string().required("กรุณากรอกชื่อ"),
        lastname: Yup.string().required("กรุณากรอกนาสกุล"),
        tel: Yup.string().required("กรุณากรอกเบอร์โทร"),
        email: Yup.string().required("กรุณากรอกอีเมล"),
    })

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values) => {
            updateUser(values)
        },
    })

    const updateUser = () => {
        axios.patch(`${apiConfig.baseURL}/upadteuserprofile`, {
            id: formik.values.id,
            firstname: formik.values.firstname,
            lastname: formik.values.lastname,
            tel: formik.values.tel,
            email: formik.values.email
        }).then((response) => {
            if (response.status === 200) {
                toast.success("อัปเดตข้อมูลผู้ใช้งานสำเร็จ")
                setIsModalEditOpen(false)

                getUser()
            } else {
                console.log("เกิดข้อผิดพลาดในการส่งข้อมูลแก้ไข User ")
            }
        })
    }

    const handleDelete = () => {
        axios
            .patch(`${apiConfig.baseURL}/delete-user`, {
                id: formik.values.id,
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("ลบผู้ใช้สำเร็จ");
                    setIsModalDeleteOpen(false);
                    getUser(); 
                } else {
                    console.log("เกิดข้อผิดพลาดในการลบรายวิชา");
                }
            })
            .catch((error) => {
                console.log("Err", error);
            });
    };


    const columns = [
        {
            title: "ลำดับ",
            dataIndex: "id",
            key: "id",
            width: 100,
        },
        {
            title: "ชื่อผู้ใช้งาน",
            dataIndex: "username",
            key: "username",
            width: 300,
        },
        {
            title: "ชื่อ",
            dataIndex: "firstname",
            key: "firstname",
            width: 200,
        },
        {
            title: "นาสกุล",
            dataIndex: "lastname",
            key: "lastname",
            width: 200,
        },
        {
            title: "เบอร์โทร",
            dataIndex: "tel",
            key: "tel",
            width: 200,
        },
        {
            title: "อีเมล",
            dataIndex: "email",
            key: "email",
            width: 200,
        },
        {
            title: "สร้างเมื่อ",
            dataIndex: "created_at",
            key: "created_at",
            width: 200,
            render: (createdAt) => (
                createdAt ? dayjs(createdAt).add(543, 'year').format('DD-MM-YYYY HH:mm:ss') : '' // Check if the date is available
            ),
        },
        {
            title: "จัดการ",
            key: "edit",
            width: 200,
            render: (record) => (
                <div className="space-x-4 flex">
                    <Icon path={mdiSquareEditOutline} size={1} onClick={() => {
                        showModalEdit();
                        getUserById(record.id);
                    }} className="cursor-pointer" />
                    <Icon path={mdiDeleteOutline} size={1} className="text-red-500 cursor-pointer" onClick={() => showModalDelete(record.id)} />
                </div>
            ),
        },
    ]


    return (
        <>
            <Toastifycon />

            <div>
                <h1 className="text-lg">จัดการข้อมูลผู้ใช้งาน</h1>
                <Table dataSource={userList} columns={columns} />
            </div>

            <Modal
                title={<div className="text-2xl font-bold">แก้ไขข้อมูลผู้ใช้งาน</div>}
                open={isModalEditOpen}
                onCancel={handleCancelEdit}
                footer={null}
            >

                <form action="" onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="">ชื่อผู้ใช้งาน</label>
                        <Input type="text" value={userById.username} disabled />
                    </div>
                    <div>
                        <p>ชื่อจริง</p>
                        <Input
                            placeholder="ชื่อ"
                            id="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                        {formik.touched.firstname && formik.errors.firstname ? (
                            <small className="text-red-500">{formik.errors.firstname}</small>
                        ) : null}
                    </div>
                    <div>
                        <p>นามสกุล</p>
                        <Input
                            placeholder="นาสกุล"
                            id="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.lastname && formik.errors.lastname ? (
                            <small className="text-red-500">{formik.errors.lastname}</small>
                        ) : null}
                    </div>

                    <div>
                        <p>เบอร์โทร</p>
                        <Input
                            placeholder="เบอร์โทร"
                            id="tel"
                            value={formik.values.tel}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.tel && formik.errors.tel ? (
                            <small className="text-red-500">{formik.errors.tel}</small>
                        ) : null}
                    </div>
                    <div>
                        <p>อีเมล</p>
                        <Input
                            placeholder="อีเมล"
                            id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <small className="text-red-500">{formik.errors.email}</small>
                        ) : null}
                    </div>

                    <div className="space-x-4  flex items-end justify-end mt-3">
                        <button
                            type="submit"
                            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        >
                            ตกลง
                        </button>
                        <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelEdit}>
                            ยกเลิก
                        </button>
                    </div>

                </form>

            </Modal>

            <Modal
                title={<div className="text-2xl font-bold">รายการที่จะลบ</div>}
                open={isModalDeleteOpen}
                onCancel={handleCancelDelete}
                footer={null}
            >
                <p className="text-md">
                    ต้องการลบผู้ใช้ <span className="text-red-500">{formik.values.firstname} {formik.values.lastname}</span> ใช่หรือไหม ?
                </p>
                <div className="space-x-4  flex items-end justify-end mt-3">
                    <button
                        type="button"
                        className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        onClick={handleDelete}
                    >
                        ตกลง
                    </button>
                    <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelDelete}>
                        ยกเลิก
                    </button>
                </div>
            </Modal>


        </>
    )
}

export default Edituser
